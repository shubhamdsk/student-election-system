export const MIN_YEAR_OF_STUDY = 1
export const MAX_YEAR_OF_STUDY = 10

export const YEAR_OF_STUDY_OPTIONS = Array.from(
  { length: MAX_YEAR_OF_STUDY - MIN_YEAR_OF_STUDY + 1 },
  (_, index) => MIN_YEAR_OF_STUDY + index,
)
