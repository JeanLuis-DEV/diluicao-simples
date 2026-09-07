import type { VolumeUnit } from './types'

const MILLILITERS_PER_LITER = 1_000

export function toMilliliters(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value * MILLILITERS_PER_LITER : value
}

export function fromMilliliters(valueMl: number, unit: VolumeUnit): number {
  return unit === 'L' ? valueMl / MILLILITERS_PER_LITER : valueMl
}
