export { calculateDilution } from './calculation'
export {
  DILUTION_PRESETS,
  DILUTION_TOLERANCE,
  MAX_DECIMAL_PLACES,
  MAX_TOTAL_ML,
  MAX_WATER_PARTS,
} from './constants'
export { createDilutionExplanation, formatPtBrNumber, getDilutionErrorMessage } from './content'
export { fromMilliliters, toMilliliters } from './conversion'
export { parseTotalAmount, parseWaterParts } from './parsing'
export { createDilutionPresentation } from './presentation'
export type {
  DilutionCalculationInput,
  DilutionError,
  DilutionErrorCode,
  DilutionField,
  DilutionPresentation,
  DomainResult,
  ExactDilution,
  ParsedTotal,
  VolumeUnit,
} from './types'
