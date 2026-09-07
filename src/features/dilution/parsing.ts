import { MAX_DECIMAL_PLACES, MAX_TOTAL_ML, MAX_WATER_PARTS } from './constants'
import { toMilliliters } from './conversion'
import type { DilutionError, DilutionField, DomainResult, ParsedTotal, VolumeUnit } from './types'

interface ParsedDecimal {
  readonly value: number
  readonly decimalPlaces: number
}

const DECIMAL_PATTERN = /^-?\d+(?:[.,]\d+)?$/

function failure(field: DilutionField, error: Omit<DilutionError, 'field'>): DomainResult<never> {
  return { ok: false, error: { field, ...error } }
}

function parsePositiveDecimal(raw: string, field: DilutionField): DomainResult<ParsedDecimal> {
  const normalized = raw.trim()
  if (normalized.length === 0) return failure(field, { code: 'required' })
  if (!DECIMAL_PATTERN.test(normalized)) return failure(field, { code: 'invalid_format' })

  const separatorIndex = Math.max(normalized.lastIndexOf('.'), normalized.lastIndexOf(','))
  const decimalPlaces = separatorIndex === -1 ? 0 : normalized.length - separatorIndex - 1
  if (decimalPlaces > MAX_DECIMAL_PLACES) {
    return failure(field, { code: 'decimal_places_exceeded' })
  }

  const value = Number(normalized.replace(',', '.'))
  if (!Number.isFinite(value)) return failure(field, { code: 'non_finite' })
  if (value <= 0 || Object.is(value, -0)) return failure(field, { code: 'must_be_positive' })
  return { ok: true, value: { value, decimalPlaces } }
}

export function parseTotalAmount(raw: string, unit: VolumeUnit): DomainResult<ParsedTotal> {
  const parsed = parsePositiveDecimal(raw, 'total')
  if (!parsed.ok) return parsed

  const totalMl = toMilliliters(parsed.value.value, unit)
  if (!Number.isFinite(totalMl)) return failure('total', { code: 'non_finite' })
  if (totalMl > MAX_TOTAL_ML) {
    return failure('total', { code: 'exceeds_maximum', maximum: MAX_TOTAL_ML })
  }

  return {
    ok: true,
    value: {
      totalMl,
      sourceValue: parsed.value.value,
      sourceUnit: unit,
      sourceDecimalPlaces: parsed.value.decimalPlaces,
    },
  }
}

export function parseWaterParts(raw: string): DomainResult<number> {
  const parsed = parsePositiveDecimal(raw, 'waterParts')
  if (!parsed.ok) return parsed
  if (parsed.value.value > MAX_WATER_PARTS) {
    return failure('waterParts', { code: 'exceeds_maximum', maximum: MAX_WATER_PARTS })
  }
  return { ok: true, value: parsed.value.value }
}
