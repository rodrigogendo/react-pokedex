import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PokedexScreen } from './PokedexScreen'
import { SearchScreen } from '../search/SearchScreen'
import { fetchPokemonByName, fetchPokemonByType, fetchPokemonList } from '../../api/pokemonApi'

vi.mock('../../api/pokemonApi', () => ({
  fetchPokemonList: vi.fn(),
  fetchPokemonByName: vi.fn(),
  fetchPokemonByType: vi.fn(),
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

  it('searches Pokémon by name and by type', async () => {
    vi.mocked(fetchPokemonByName).mockResolvedValue({
      id: 25,
      name: 'pikachu',
      imageUrl: 'pikachu.png',
      types: [{ id: 17, name: 'electric' }],
      baseExperience: 112,
      height: 4,
      weight: 60,
      stats: {
        hp: 35,
        attack: 55,
        defense: 40,
        specialAttack: 50,
        specialDefense: 50,
        speed: 90,
      },
    })

    vi.mocked(fetchPokemonByType).mockResolvedValue([
      { id: 25, name: 'pikachu', imageUrl: 'pikachu.png', types: [{ id: 17, name: 'electric' }] },
      { id: 26, name: 'raichu', imageUrl: 'raichu.png', types: [{ id: 17, name: 'electric' }] },
    ])

    render(<SearchScreen />)

    fireEvent.change(screen.getByLabelText('Search by name'), {
      target: { value: '  Pikachu  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search Pokémon' }))

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu')
    })

    fireEvent.change(screen.getByLabelText('Search for Types'), {
      target: { value: '  electric  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search type' }))

    await waitFor(() => {
      expect(fetchPokemonByType).toHaveBeenCalledWith('electric')
    })
    expect((await screen.findAllByText('pikachu')).length).toBeGreaterThan(0)
  })
})
