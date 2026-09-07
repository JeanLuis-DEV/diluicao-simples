import { describe, expect, it } from 'vitest'
import {
  DILUTION_PRESETS,
  MAX_TOTAL_ML,
  MAX_WATER_PARTS,
  calculateDilution,
} from '.'

describe('cálculo de diluição 1:N', () => {
  it('preserva todos os presets oficiais', () => {
    expect(DILUTION_PRESETS).toEqual([1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100])
  })

  it.each([
    [1000, 1, 500, 500],
    [1000, 5, 1000 / 6, 5000 / 6],
    [1000, 10, 1000 / 11, 10000 / 11],
    [350, 2.5, 100, 250],
    [250.5, 4, 50.1, 200.4],
  ])('calcula total=%s e N=%s', (totalMl, waterParts, product, water) => {
    const result = calculateDilution({ totalMl, waterParts })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.productExactMl).toBeCloseTo(product, 12)
    expect(result.value.waterExactMl).toBeCloseTo(water, 12)
    expect(result.value.productExactMl + result.value.waterExactMl).toBeCloseTo(totalMl, 12)
  })

  it.each([
    [Number.NaN, 1, 'total', 'non_finite'],
    [Number.POSITIVE_INFINITY, 1, 'total', 'non_finite'],
    [1000, Number.NaN, 'waterParts', 'non_finite'],
    [0, 1, 'total', 'must_be_positive'],
    [-1, 1, 'total', 'must_be_positive'],
    [1000, 0, 'waterParts', 'must_be_positive'],
    [MAX_TOTAL_ML + 1, 1, 'total', 'exceeds_maximum'],
    [1000, MAX_WATER_PARTS + 1, 'waterParts', 'exceeds_maximum'],
  ])('rejeita total=%s e N=%s', (totalMl, waterParts, field, code) => {
    expect(calculateDilution({ totalMl: Number(totalMl), waterParts: Number(waterParts) })).toEqual({
      ok: false,
      error: expect.objectContaining({ field, code }),
    })
  })

  it('aceita os limites máximos inclusivos', () => {
    expect(calculateDilution({ totalMl: MAX_TOTAL_ML, waterParts: MAX_WATER_PARTS }).ok).toBe(true)
  })
})
