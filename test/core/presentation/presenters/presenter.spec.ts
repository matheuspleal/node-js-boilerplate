import { Presenter } from '@/core/presentation/presenters/presenter'

import { CSVToJSON } from '#/core/presentation/@helpers/csv-to-json'
import {
  type FakeCollectionDTO,
  type FakeCollectionOutput,
  makeFakeCollectionDTOStub,
  type FakeOutput,
  type FakeDTO,
} from '#/core/presentation/@mocks/fake-presenter-stub'

class FakePresenter extends Presenter<FakeCollectionDTO, FakeCollectionOutput> {
  static toJSON(fakeCollectionDTO: FakeCollectionDTO): FakeCollectionOutput {
    return fakeCollectionDTO.map((fakeDTO) => ({
      full_name: fakeDTO.name,
      email: fakeDTO.email,
      age: new Date().getFullYear() - fakeDTO.birthdate.getFullYear(),
    }))
  }

  static toCSV(fakeCollectionDTO: FakeCollectionDTO): string {
    const jsonOutput = FakePresenter.toJSON(fakeCollectionDTO)
    if (jsonOutput.length === 0) {
      return ''
    }
    const headers = Object.keys(jsonOutput[0]) as Array<keyof FakeOutput>
    const csvRows = jsonOutput.map((json: FakeOutput) =>
      headers
        .map(
          (header: keyof FakeOutput) =>
            `"${String(json[header]).replace(/"/g, '""')}"`,
        )
        .join(','),
    )
    return [headers.join(','), ...csvRows].join('\n')
  }
}

describe('Presenter', () => {
  let fakeCollectionDTO: FakeCollectionDTO
  let length: number

  beforeAll(() => {
    length = 10
    fakeCollectionDTO = makeFakeCollectionDTOStub({ length })
  })

  it('should be able to present Input data (DTO) to Output data (JSON)', () => {
    const presentedData = FakePresenter.toJSON(fakeCollectionDTO)
    const [anyItemPresentedData] = presentedData

    expect(presentedData).toHaveLength(length)
    expect(anyItemPresentedData).toMatchObject({
      full_name: expect.any(String),
      email: expect.any(String),
      age: expect.any(Number),
    })
  })

  it('should be able to present Input data (DTO) to Output data (CSV) when Input data length is equal zero', () => {
    const fakeCollectionDTO = [] as any
    const presentedData = FakePresenter.toCSV(fakeCollectionDTO)

    expect(presentedData).toBeTypeOf('string')
    expect(presentedData).toEqual('')
  })

  it('should be able to present Input data (DTO) to Output data (CSV) when Input data length is non-zero', () => {
    const presentedData = FakePresenter.toCSV(fakeCollectionDTO)
    const csvToJSON = CSVToJSON<FakeDTO>(presentedData)

    const [anyItemPresentedData] = csvToJSON

    expect(presentedData).toBeTypeOf('string')
    expect(anyItemPresentedData).toMatchObject({
      full_name: expect.any(String),
      email: expect.any(String),
      age: expect.any(String),
    })
  })
})
