import { describe, expect, it } from 'vitest'
import { MAX_TOTAL_ML, MAX_WATER_PARTS, parseTotalAmount, parseWaterParts } from '.'

describe('parsing de quantidade total', () => {
  it.each([
    ['1000', 'ml' as const, 1000],
    ['1.5', 'ml' as const, 1.5],
    ['1,5', 'ml' as const, 1.5],
    ['0.001', 'ml' as const, 0.001],
    ['1', 'L' as const, 1000],
    ['1000', 'L' as const, MAX_TOTAL_ML],
  ])('aceita %s %s', (raw, unit, expectedMl) => {
    const result = parseTotalAmount(raw, unit)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.totalMl).toBe(expectedMl)
  })

  it.each([
    ['', 'required'],
    ['.', 'invalid_format'],
    ['.5', 'invalid_format'],
    ['1.', 'invalid_format'],
    ['+1', 'invalid_format'],
    ['12ml', 'invalid_format'],
    ['1e3', 'invalid_format'],
    ['1,2.3', 'invalid_format'],
    ['1.0000', 'decimal_places_exceeded'],
    ['0', 'must_be_positive'],
    ['-1', 'must_be_positive'],
  ])('rejeita %j', (raw, code) => {
    expect(parseTotalAmount(raw, 'ml')).toEqual({ ok: false, error: { field: 'total', code } })
  })

  it('preserva 1.000 como decimal equivalente a 1', () => {
    expect(parseTotalAmount('1.000', 'ml')).toEqual(expect.objectContaining({
      ok: true,
      value: expect.objectContaining({ totalMl: 1 }),
    }))
  })

  it('aplica o limite após converter litros', () => {
    expect(parseTotalAmount('1000.001', 'L')).toEqual({
      ok: false,
      error: { field: 'total', code: 'exceeds_maximum', maximum: MAX_TOTAL_ML },
    })
  })
})

describe('parsing de proporção personalizada', () => {
  it.each([['1', 1], ['2.5', 2.5], ['2,5', 2.5], ['10000.000', MAX_WATER_PARTS]])(
    'aceita %s',
    (raw, expected) => expect(parseWaterParts(raw)).toEqual({ ok: true, value: expected }),
  )

  it.each([
    ['', 'required'],
    ['texto', 'invalid_format'],
    ['1e2', 'invalid_format'],
    ['1.0000', 'decimal_places_exceeded'],
    ['0', 'must_be_positive'],
    ['10000.001', 'exceeds_maximum'],
  ])('rejeita %j', (raw, code) => {
    expect(parseWaterParts(raw)).toEqual({
      ok: false,
      error: expect.objectContaining({ field: 'waterParts', code }),
    })
  })
})
