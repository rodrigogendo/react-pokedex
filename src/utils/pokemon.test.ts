import { describe, expect, it } from 'vitest'

import { formatPokemonName } from './pokemon'

describe('formatPokemonName', () => {
  it('replaces whole-word gender names with their symbols', () => {
    expect(formatPokemonName('nidoran-male')).toBe('nidoran ♂')
    expect(formatPokemonName('nidoran-female')).toBe('nidoran ♀')
    expect(formatPokemonName('indeedee-female')).toBe('indeedee ♀')
  })

  it('does not replace gender words embedded in other words', () => {
    expect(formatPokemonName('malamar')).toBe('malamar')
    expect(formatPokemonName('femaleish')).toBe('femaleish')
  })
})