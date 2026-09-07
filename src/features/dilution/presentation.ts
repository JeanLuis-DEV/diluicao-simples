import { MAX_DECIMAL_PLACES } from './constants'
import { fromMilliliters } from './conversion'
import type { DilutionPresentation, ExactDilution, VolumeUnit } from './types'

function roundToScaledInteger(value: number, scale: number): number {
  const scaled = value * scale
  const floatingPointTolerance = Number.EPSILON * Math.max(1, Math.abs(scaled)) * 4
  return Math.round(scaled + floatingPointTolerance)
}

function formatScaledInteger(
  value: number,
  decimalPlaces: number,
  trimTrailingZeros: boolean,
): string {
  const normalizedValue = value === 0 || Object.is(value, -0) ? 0 : value
  if (decimalPlaces === 0) return String(normalizedValue)

  const scale = 10 ** decimalPlaces
  const integerPart = Math.trunc(normalizedValue / scale)
  const rawFraction = String(Math.abs(normalizedValue % scale)).padStart(decimalPlaces, '0')
  const fraction = trimTrailingZeros ? rawFraction.replace(/0+$/, '') : rawFraction
  return fraction.length > 0 ? `${integerPart},${fraction}` : String(integerPart)
}

export function createDilutionPresentation(
  exact: ExactDilution,
  unit: VolumeUnit,
  _sourceDecimalPlaces = MAX_DECIMAL_PLACES,
): DilutionPresentation {
  const totalDisplay = fromMilliliters(exact.totalMl, unit)
  const productDisplay = fromMilliliters(exact.productExactMl, unit)
  const useMinimumValuePrecision = unit === 'ml'
    && totalDisplay > 0
    && roundToScaledInteger(totalDisplay, 100) === 0
  const preferredDecimalPlaces = unit === 'L' || useMinimumValuePrecision
    ? MAX_DECIMAL_PLACES
    : 2
  const preferredScale = 10 ** preferredDecimalPlaces
  const preferredProductScaled = roundToScaledInteger(productDisplay, preferredScale)
  const preferredWaterScaled = roundToScaledInteger(totalDisplay, preferredScale) - preferredProductScaled
  const hasFractionalMilliliters = unit === 'ml' && (
    !Number.isInteger(totalDisplay)
    || preferredProductScaled % preferredScale !== 0
    || preferredWaterScaled % preferredScale !== 0
  )
  const decimalPlaces = unit === 'L'
    ? MAX_DECIMAL_PLACES
    : hasFractionalMilliliters ? preferredDecimalPlaces : 0
  const scale = 10 ** decimalPlaces
  const totalScaled = roundToScaledInteger(totalDisplay, scale)
  const productScaled = roundToScaledInteger(productDisplay, scale)
  const waterScaled = totalScaled - productScaled
  const trimTrailingZeros = unit === 'L' || useMinimumValuePrecision

  return {
    unit,
    decimalPlaces,
    scale,
    totalScaled,
    productScaled,
    waterScaled,
    total: totalScaled / scale,
    product: productScaled / scale,
    water: waterScaled / scale,
    totalText: formatScaledInteger(totalScaled, decimalPlaces, trimTrailingZeros),
    productText: formatScaledInteger(productScaled, decimalPlaces, trimTrailingZeros),
    waterText: formatScaledInteger(waterScaled, decimalPlaces, trimTrailingZeros),
  }
}
