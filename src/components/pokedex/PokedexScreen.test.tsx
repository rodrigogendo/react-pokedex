import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PokedexScreen } from './PokedexScreen'
import { fetchPokemonList } from '../../api/pokemonApi'

vi.mock('../../api/pokemonApi', () => ({
  fetchPokemonList: vi.fn(),
}))

describe('PokedexScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Pokémon fetched from the API', async () => {
    vi.mocked(fetchPokemonList).mockResolvedValue([
      { id: 94, name: 'Gengar', imageUrl: null, types: [] },
      { id: 25, name: 'Pikachu', imageUrl: null, types: [] },
    ])

    render(<PokedexScreen />)

    expect(screen.getByText('Pokémon roster')).toBeInTheDocument()
    expect((await screen.findAllByText('Gengar')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('#094').length).toBeGreaterThan(0)
  })
})
