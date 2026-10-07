import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PokedexScreen } from './PokedexScreen'
import { SearchScreen } from '../search/SearchScreen'
import { fetchPokemonByName, fetchPokemonByType, fetchPokemonPage } from '../../api/pokemonApi'

vi.mock('../../api/pokemonApi', () => ({
  fetchPokemonList: vi.fn(),
  fetchPokemonPage: vi.fn(),
  fetchPokemonByName: vi.fn(),
  fetchPokemonByType: vi.fn(),
}))

const mockFetchResponse = (payload: unknown) =>
  ({
    ok: true,
    json: async () => payload,
  } as Response)

describe('PokedexScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Pokémon fetched from the API', async () => {
    vi.mocked(fetchPokemonPage).mockResolvedValue({
      totalCount: 2,
      items: [
        { id: 94, name: 'Gengar', imageUrl: null, types: [] },
        { id: 25, name: 'Pikachu', imageUrl: null, types: [] },
      ],
    })

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

  it('maps type results to a summary with a generated sprite URL', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        id: 13,
        name: 'electric',
        pokemon: [{ pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } }],
      }),
    )

    const { fetchPokemonByType: actualFetchPokemonByType } =
      await vi.importActual<typeof import('../../api/pokemonApi')>('../../api/pokemonApi')

    const results = await actualFetchPokemonByType('electric')

    expect(results).toEqual([
      {
        id: 25,
        name: 'pikachu',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png',
        types: [{ id: 13, name: 'electric' }],
      },
    ])

    fetchMock.mockRestore()
  })

  it('requests the full Pokémon roster in paginated chunks', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        count: 1351,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      }),
    )

    const { fetchPokemonList: actualFetchPokemonList } =
      await vi.importActual<typeof import('../../api/pokemonApi')>('../../api/pokemonApi')

    const results = await actualFetchPokemonList(2, 0)

    expect(results).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png',
        types: [],
      },
      {
        id: 2,
        name: 'ivysaur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/2.png',
        types: [],
      },
    ])

    fetchMock.mockRestore()
  })
})
