import { MAX_TOTAL_ML, MAX_WATER_PARTS } from './constants'
import type {
  DilutionCalculationInput,
  DilutionError,
  DilutionField,
  DomainResult,
  ExactDilution,
} from './types'

function validateNumber(value: number, field: DilutionField, maximum: number): DilutionError | undefined {
  if (!Number.isFinite(value)) return { field, code: 'non_finite' }
  if (value <= 0 || Object.is(value, -0)) return { field, code: 'must_be_positive' }
  if (value > maximum) return { field, code: 'exceeds_maximum', maximum }
  return undefined
}

export function calculateDilution({
  totalMl,
  waterParts,
}: DilutionCalculationInput): DomainResult<ExactDilution> {
  const totalError = validateNumber(totalMl, 'total', MAX_TOTAL_ML)
  if (totalError) return { ok: false, error: totalError }

  const waterPartsError = validateNumber(waterParts, 'waterParts', MAX_WATER_PARTS)
  if (waterPartsError) return { ok: false, error: waterPartsError }

  const productParts = 1 as const
  const totalParts = productParts + waterParts
  const productExactMl = totalMl / totalParts
  const waterExactMl = totalMl - productExactMl

  return {
    ok: true,
    value: {
      totalMl,
      productParts,
      waterParts,
      totalParts,
      productExactMl,
      waterExactMl: Object.is(waterExactMl, -0) ? 0 : waterExactMl,
    },
  }
}
