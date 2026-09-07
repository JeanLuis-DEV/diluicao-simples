import { MAX_TOTAL_ML, MAX_WATER_PARTS } from './constants'
import type {
  DilutionError,
  DilutionErrorCode,
  DilutionPresentation,
  ExactDilution,
  VolumeUnit,
} from './types'

export function formatPtBrNumber(value: number): string {
  if (!Number.isFinite(value)) return ''
  const normalized = Object.is(value, -0) ? 0 : value
  return normalized.toFixed(3).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',')
}

export function createDilutionExplanation(
  exact: ExactDilution,
  presentation: DilutionPresentation,
): string {
  const waterPartNoun = exact.waterParts === 1 ? 'parte' : 'partes'
  return `O total é dividido em ${formatPtBrNumber(exact.totalParts)} partes iguais: `
    + `1 parte de produto e ${formatPtBrNumber(exact.waterParts)} ${waterPartNoun} de água.`
    + ` Use aproximadamente ${presentation.productText} ${presentation.unit} de produto e `
    + `${presentation.waterText} ${presentation.unit} de água.`
}

export function getDilutionErrorMessage(error: DilutionError, unit: VolumeUnit): string {
  const messages: Record<Exclude<DilutionErrorCode, 'exceeds_maximum'>, string> = {
    required: error.field === 'total' ? 'Informe a quantidade final.' : 'Informe as partes de água.',
    invalid_format: 'Digite um número válido usando vírgula ou ponto.',
    decimal_places_exceeded: 'Use no máximo 3 casas decimais.',
    non_finite: 'Digite um número válido usando vírgula ou ponto.',
    must_be_positive: 'Informe um valor maior que zero.',
  }

  if (error.code !== 'exceeds_maximum') return messages[error.code]
  if (error.field === 'waterParts') {
    return `O máximo é ${MAX_WATER_PARTS.toLocaleString('pt-BR')} partes de água.`
  }
  return unit === 'L'
    ? `O máximo é ${(MAX_TOTAL_ML / 1_000).toLocaleString('pt-BR')} L.`
    : `O máximo é ${MAX_TOTAL_ML.toLocaleString('pt-BR')} ml.`
}
