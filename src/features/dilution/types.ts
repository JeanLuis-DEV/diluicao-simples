export type VolumeUnit = 'ml' | 'L'
export type DilutionField = 'total' | 'waterParts'
export type DilutionErrorCode =
  | 'required'
  | 'invalid_format'
  | 'decimal_places_exceeded'
  | 'non_finite'
  | 'must_be_positive'
  | 'exceeds_maximum'

export interface DilutionError {
  readonly field: DilutionField
  readonly code: DilutionErrorCode
  readonly maximum?: number
}

export type DomainResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: DilutionError }

export interface ParsedTotal {
  readonly totalMl: number
  readonly sourceValue: number
  readonly sourceUnit: VolumeUnit
  readonly sourceDecimalPlaces: number
}

export interface DilutionCalculationInput {
  readonly totalMl: number
  readonly waterParts: number
}

export interface ExactDilution {
  readonly totalMl: number
  readonly productParts: 1
  readonly waterParts: number
  readonly totalParts: number
  readonly productExactMl: number
  readonly waterExactMl: number
}

export interface DilutionPresentation {
  readonly unit: VolumeUnit
  readonly decimalPlaces: number
  readonly scale: number
  readonly totalScaled: number
  readonly productScaled: number
  readonly waterScaled: number
  readonly total: number
  readonly product: number
  readonly water: number
  readonly totalText: string
  readonly productText: string
  readonly waterText: string
}
