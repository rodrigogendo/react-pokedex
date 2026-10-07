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
        { id: 94, dexNumber: 94, name: 'Gengar', imageUrl: null, types: [] },
        { id: 25, dexNumber: 25, name: 'Pikachu', imageUrl: null, types: [] },
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
      dexNumber: 25,
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
      { id: 25, dexNumber: 25, name: 'pikachu', imageUrl: 'pikachu.png', types: [{ id: 17, name: 'electric' }] },
      { id: 26, dexNumber: 26, name: 'raichu', imageUrl: 'raichu.png', types: [{ id: 17, name: 'electric' }] },
    ])

    render(<SearchScreen />)

    fireEvent.change(screen.getByLabelText('Search by name'), {
      target: { value: '  Pikachu  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search Pokémon' }))

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu')
    })

    expect(screen.queryByLabelText('Search for Types')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'fairy' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'electric' }))

    await waitFor(() => {
      expect(fetchPokemonByType).toHaveBeenCalledWith('electric')
    })

    const typeResultButton = await screen.findByRole('button', { name: /pikachu/i })
    expect(typeResultButton).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(typeResultButton)

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledTimes(2)
    })
    expect(typeResultButton).toHaveAttribute('aria-pressed', 'true')
    expect((await screen.findAllByText('Base Stats')).length).toBe(2)
  })

  it('clears stale type details when the next search has no matches', async () => {
    vi.mocked(fetchPokemonByName).mockResolvedValue({
      id: 25,
      dexNumber: 25,
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

    vi.mocked(fetchPokemonByType)
      .mockResolvedValueOnce([
        { id: 25, dexNumber: 25, name: 'pikachu', imageUrl: 'pikachu.png', types: [{ id: 17, name: 'electric' }] },
      ])
      .mockResolvedValueOnce([])

    render(<SearchScreen />)

    fireEvent.click(screen.getByRole('button', { name: 'electric' }))

    await waitFor(() => {
      expect(fetchPokemonByType).toHaveBeenCalledWith('electric')
    })

    fireEvent.click(await screen.findByRole('button', { name: /pikachu/i }))

    expect(await screen.findByText('Base Stats')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'grass' }))

    await waitFor(() => {
      expect(fetchPokemonByType).toHaveBeenLastCalledWith('grass')
    })

    expect(await screen.findByText('No Pokémon were found for that type.')).toBeInTheDocument()
    expect(screen.queryByText('Base Stats')).not.toBeInTheDocument()
  })

  it('ignores stale async name responses so the latest search wins', async () => {
    let resolveFirst!: (value: {
      id: number
      dexNumber: number
      name: string
      imageUrl: string
      types: { id: number; name: string }[]
      baseExperience: number
      height: number
      weight: number
      stats: {
        hp: number
        attack: number
        defense: number
        specialAttack: number
        specialDefense: number
        speed: number
      }
    }) => void
    let resolveSecond!: (value: {
      id: number
      dexNumber: number
      name: string
      imageUrl: string
      types: { id: number; name: string }[]
      baseExperience: number
      height: number
      weight: number
      stats: {
        hp: number
        attack: number
        defense: number
        specialAttack: number
        specialDefense: number
        speed: number
      }
    }) => void

    vi.mocked(fetchPokemonByName)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve
          }),
      )

    render(<SearchScreen />)

    fireEvent.change(screen.getByLabelText('Search by name'), { target: { value: 'pikachu' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search Pokémon' }))

    fireEvent.change(screen.getByLabelText('Search by name'), { target: { value: 'bulbasaur' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search Pokémon' }))

    resolveSecond({
      id: 1,
      dexNumber: 1,
      name: 'bulbasaur',
      imageUrl: 'bulbasaur.png',
      types: [{ id: 4, name: 'grass' }],
      baseExperience: 64,
      height: 7,
      weight: 69,
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
    })

    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument()

    resolveFirst({
      id: 25,
      dexNumber: 25,
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

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument()
    })
  })

  it('groups type results under their species with alternate forms attached', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        id: 13,
        name: 'electric',
        pokemon: [{ pokemon: { name: 'pikachu-rock-star', url: 'https://pokeapi.co/api/v2/pokemon/10025/' } }],
      }),
    )
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        id: 10025,
        name: 'pikachu-rock-star',
        species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
        base_experience: 112,
        height: 4,
        weight: 60,
        types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
        stats: [],
        sprites: { other: { home: { front_default: 'pikachu-rock-star.png' } } },
      }),
    )
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        id: 25,
        name: 'pikachu',
        varieties: [
          { is_default: true, pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } },
          { is_default: false, pokemon: { name: 'pikachu-rock-star', url: 'https://pokeapi.co/api/v2/pokemon/10025/' } },
        ],
      }),
    )

    const { fetchPokemonByType: actualFetchPokemonByType } =
      await vi.importActual<typeof import('../../api/pokemonApi')>('../../api/pokemonApi')

    const results = await actualFetchPokemonByType('electric')

    expect(results).toEqual([
      {
        id: 25,
        dexNumber: 25,
        name: 'pikachu',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png',
        types: [],
        alternateForms: [
          {
            id: 10025,
            name: 'pikachu-rock-star',
            imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10025.png',
          },
        ],
      },
    ])

    fetchMock.mockRestore()
  })

  it('loads a full Pokémon detail when a roster item is selected', async () => {
    vi.mocked(fetchPokemonPage).mockResolvedValue({
      totalCount: 2,
      items: [
        { id: 25, dexNumber: 25, name: 'pikachu', imageUrl: 'pikachu.png', types: [{ id: 17, name: 'electric' }] },
      ],
    })

    vi.mocked(fetchPokemonByName).mockResolvedValue({
      id: 25,
      dexNumber: 25,
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

    render(<PokedexScreen />)

    fireEvent.click(await screen.findByRole('button', { name: /pikachu/i }))

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu')
    })
  })

  it('toggles the selected Pokémon inline panel open and closed', async () => {
    vi.mocked(fetchPokemonPage).mockResolvedValue({
      totalCount: 2,
      items: [
        { id: 25, dexNumber: 25, name: 'pikachu', imageUrl: 'pikachu.png', types: [{ id: 17, name: 'electric' }] },
        { id: 26, dexNumber: 26, name: 'raichu', imageUrl: 'raichu.png', types: [{ id: 17, name: 'electric' }] },
      ],
    })

    vi.mocked(fetchPokemonByName).mockResolvedValue({
      id: 25,
      dexNumber: 25,
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

    render(<PokedexScreen />)

    const pikachuButton = await screen.findByRole('button', { name: /pikachu/i })
    expect(pikachuButton).toHaveAttribute('aria-pressed', 'false')
    expect(fetchPokemonByName).not.toHaveBeenCalled()

    fireEvent.click(pikachuButton)

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledWith('pikachu')
    })

    const statsHeading = await screen.findByText('Base Stats')
    const detailCard = statsHeading.closest('article')
    expect(detailCard?.parentElement).toHaveClass('md:col-span-2')
    expect(detailCard?.querySelector('dl')).toHaveClass('grid-cols-3')
    expect(statsHeading.nextElementSibling).toHaveClass('grid-cols-3')
    expect(statsHeading.nextElementSibling?.firstElementChild).toHaveClass('p-2')
    expect(pikachuButton).toHaveClass('w-full')
    expect(pikachuButton).toHaveClass('h-20')
    expect(pikachuButton.parentElement).not.toHaveClass('md:col-span-2')

    fireEvent.click(pikachuButton)

    await waitFor(() => {
      expect(screen.queryByText('Base Stats')).not.toBeInTheDocument()
    })
  })

  it('loads all varieties for each species together on its dex-number page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        count: 1025,
        results: [
          { name: 'genesect', url: 'https://pokeapi.co/api/v2/pokemon-species/648/' },
        ],
      }),
    )
    fetchMock.mockResolvedValueOnce(
      mockFetchResponse({
        id: 648,
        name: 'genesect',
        varieties: [
          { is_default: true, pokemon: { name: 'genesect', url: 'https://pokeapi.co/api/v2/pokemon/649/' } },
          { is_default: false, pokemon: { name: 'genesect-douse', url: 'https://pokeapi.co/api/v2/pokemon/10001/' } },
          { is_default: false, pokemon: { name: 'genesect-shock', url: 'https://pokeapi.co/api/v2/pokemon/10002/' } },
        ],
      }),
    )

    const { fetchPokemonList: actualFetchPokemonList } =
      await vi.importActual<typeof import('../../api/pokemonApi')>('../../api/pokemonApi')

    const results = await actualFetchPokemonList(1, 647)

    expect(results).toEqual([
      {
        id: 649,
        dexNumber: 648,
        name: 'genesect',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/649.png',
        types: [],
        alternateForms: [
          {
            id: 10001,
            name: 'genesect-douse',
            imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10001.png',
          },
          {
            id: 10002,
            name: 'genesect-shock',
            imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10002.png',
          },
        ],
      },
    ])
    fetchMock.mockRestore()
  })

  it('switches the selected species detail card to an alternate form', async () => {
    vi.mocked(fetchPokemonPage).mockResolvedValue({
      totalCount: 1,
      items: [
        {
          id: 649,
          dexNumber: 648,
          name: 'genesect',
          imageUrl: 'genesect.png',
          types: [],
          alternateForms: [
            { id: 10001, name: 'genesect-douse', imageUrl: 'genesect-douse.png' },
          ],
        },
      ],
    })

    vi.mocked(fetchPokemonByName).mockImplementation(async (name) => ({
      id: name === 'genesect' ? 649 : 10001,
      dexNumber: 648,
      name,
      imageUrl: `${name}.png`,
      types: [],
      baseExperience: 100,
      height: 15,
      weight: 825,
      stats: {
        hp: 71,
        attack: 120,
        defense: 95,
        specialAttack: 120,
        specialDefense: 95,
        speed: 99,
      },
    }))

    render(<PokedexScreen />)

    const speciesButton = await screen.findByRole('button', { name: /genesect/i })
    fireEvent.click(speciesButton)
    expect(await screen.findByRole('button', { name: 'genesect douse' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    fireEvent.click(screen.getByRole('button', { name: 'genesect douse' }))

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenLastCalledWith('genesect-douse')
      expect(screen.getByRole('button', { name: 'genesect douse' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })
    expect(speciesButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'genesect douse' })).toBeInTheDocument()
  })
})
