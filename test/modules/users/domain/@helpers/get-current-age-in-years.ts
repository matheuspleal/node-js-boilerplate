const UTC_FIRST_YEAR = 1970

export function getCurrentAgeInYears(birthdate: Date): number {
  const currentDate = new Date()
  const timeDifferenceInMilliseconds =
    currentDate.getTime() - birthdate.getTime()
  const ageInMilliseconds = new Date(timeDifferenceInMilliseconds)
  const age = Math.abs(ageInMilliseconds.getUTCFullYear() - UTC_FIRST_YEAR)
  return age
}
