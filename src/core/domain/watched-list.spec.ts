import { WatchedList } from '@/core/domain/watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  it('should be able to create an empty watched list', () => {
    const list = new NumberWatchedList()

    expect(list.getItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('should be able to add a new item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.getItems()).toEqual([1, 2, 3, 4])
    expect(list.getNewItems()).toEqual([4])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('should not add a duplicate item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(2)

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an initial item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.getItems()).toEqual([1, 3])
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove a new item without tracking it as removed', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('should be able to re-add a removed item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.getItems()).toEqual([1, 3, 2])
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update an existing item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update(2)

    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should not update a non-existing item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update(99)

    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should be able to check if an item exists', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.exists(2)).toBe(true)
    expect(list.exists(99)).toBe(false)
  })

  it('should not duplicate removed items when removing twice', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.remove(2)

    expect(list.getRemovedItems()).toEqual([2])
  })
})
