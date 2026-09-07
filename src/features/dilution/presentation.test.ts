import { describe, expect, it } from 'vitest'
import {
  calculateDilution,
  createDilutionExplanation,
  createDilutionPresentation,
  formatPtBrNumber,
  type ExactDilution,
  type VolumeUnit,
} from '.'

function exact(totalMl: number, waterParts: number): ExactDilution {
  const result = calculateDilution({ totalMl, waterParts })
  if (!result.ok) throw new Error(result.error.code)
  return result.value
}

describe('apresentação determinística', () => {
  it.each([
    [1000, 1, 'ml' as const, 0, '500', '500'],
    [1000, 5, 'ml' as const, 0, '166,67', '833,33'],
    [1000, 10, 'ml' as const, 0, '90,91', '909,09'],
    [1000, 100, 'ml' as const, 0, '9,90', '990,10'],
    [1000, 5, 'L' as const, 0, '0,167', '0,833'],
    [350, 2.5, 'ml' as const, 0, '100', '250'],
    [250.5, 4, 'ml' as const, 1, '50,10', '200,40'],
  ])('formata total=%s e N=%s em %s', (total, waterParts, unit, places, product, water) => {
    const result = createDilutionPresentation(exact(total, waterParts), unit, places)
    expect(result.productText).toBe(product)
    expect(result.waterText).toBe(water)
    expect(result.productScaled + result.waterScaled).toBe(result.totalScaled)
  })

  it.each([0.001, 1, 1.005, 250.5, 1000, 1_000_000])(
    'preserva a soma apresentada no total %s',
    (totalMl) => {
      for (const unit of ['ml', 'L'] satisfies VolumeUnit[]) {
        const result = createDilutionPresentation(exact(totalMl, 10_000), unit, 3)
        expect(result.productScaled + result.waterScaled).toBe(result.totalScaled)
        expect(Object.is(result.product, -0)).toBe(false)
      }
    },
  )

  it('arredonda empate para cima e obtém água por complemento', () => {
    const result = createDilutionPresentation(exact(1.005, 1), 'ml', 3)
    expect(result.totalText).toBe('1,01')
    expect(result.productText).toBe('0,50')
    expect(result.waterText).toBe('0,51')
  })

  it('preserva três casas somente quando duas fariam o total positivo virar zero', () => {
    const result = createDilutionPresentation(exact(0.001, 10_000), 'ml', 3)
    expect(result.totalText).toBe('0,001')
    expect(result.productText).toBe('0')
    expect(result.waterText).toBe('0,001')
    expect(result.productScaled + result.waterScaled).toBe(result.totalScaled)
  })

  it('exibe 1:100 com duas casas e soma visual de 1000,00 ml', () => {
    const result = createDilutionPresentation(exact(1000, 100), 'ml')
    expect(result).toEqual(expect.objectContaining({
      totalText: '1000,00',
      productText: '9,90',
      waterText: '990,10',
    }))
    expect(result.productScaled + result.waterScaled).toBe(result.totalScaled)
  })

  it('não acrescenta casas quando produto e água são inteiros', () => {
    const result = createDilutionPresentation(exact(1000, 1), 'ml')
    expect(result).toEqual(expect.objectContaining({
      totalText: '1000',
      productText: '500',
      waterText: '500',
    }))
  })
})

describe('texto funcional', () => {
  it('formata números em pt-BR sem zeros finais', () => {
    expect([formatPtBrNumber(2.5), formatPtBrNumber(6), formatPtBrNumber(3.125)]).toEqual([
      '2,5', '6', '3,125',
    ])
  })

  it('explica o resultado usando os mesmos valores apresentados', () => {
    const calculation = exact(1000, 5)
    const presentation = createDilutionPresentation(calculation, 'ml', 0)
    expect(createDilutionExplanation(calculation, presentation)).toContain(
      'Use aproximadamente 166,67 ml de produto e 833,33 ml de água.',
    )
  })

  it('mantém card e explicação equivalentes em 1:100', () => {
    const calculation = exact(1000, 100)
    const presentation = createDilutionPresentation(calculation, 'ml')
    expect(createDilutionExplanation(calculation, presentation)).toBe(
      'O total é dividido em 101 partes iguais: 1 parte de produto e 100 partes de água.'
      + ' Use aproximadamente 9,90 ml de produto e 990,10 ml de água.',
    )
  })
})
