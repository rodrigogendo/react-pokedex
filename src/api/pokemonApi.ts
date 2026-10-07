import type {
  PokemonApiDetail,
  PokemonDetail,
  PokemonFormSummary,
  PokemonListPage,
  PokemonListResponse,
  PokemonSpeciesDetailResponse,
  PokemonStats,
  PokemonSummary,
  PokemonTypeDetailResponse,
  PokemonTypeListResponse,
} from '../types/pokemon'

export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2'

const apiUrl = (pathname: string) => {
  const normalizedPath = pathname.replace(/^\/+/, '')
  return `${POKEMON_API_BASE_URL.replace(/\/$/, '')}/${normalizedPath}`
}

const parseResourceId = (url: string) => {
  const match = url.match(/\/\d+\/?$/)
  const id = match ? Number.parseInt(match[0].replace(/\//g, ''), 10) : Number.NaN

  return Number.isFinite(id) ? id : 0
}

const normalizePokemonName = (value: string) => value.trim().toLowerCase()

const getStatValue = (stats: PokemonApiDetail['stats'], statName: string) =>
  stats.find(({ stat }) => stat.name === statName)?.base_stat ?? 0

const mapPokemonStats = (stats: PokemonApiDetail['stats']): PokemonStats => ({
  hp: getStatValue(stats, 'hp'),
  attack: getStatValue(stats, 'attack'),
  defense: getStatValue(stats, 'defense'),
  specialAttack: getStatValue(stats, 'special-attack'),
  specialDefense: getStatValue(stats, 'special-defense'),
  speed: getStatValue(stats, 'speed'),
})

const getPokemonImageUrl = (pokemon: PokemonApiDetail): string | null => {
  const homeImageUrl = pokemon.sprites?.other?.home?.front_default
  if (homeImageUrl) {
    return homeImageUrl
  }

  const officialArtworkUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
  if (officialArtworkUrl) {
    return officialArtworkUrl
  }

  const frontDefaultUrl = pokemon.sprites?.front_default
  if (frontDefaultUrl) {
    return frontDefaultUrl
  }

  return null
}

const mapPokemonSummary = (pokemon: PokemonApiDetail): PokemonSummary => ({
  id: pokemon.id,
  dexNumber: parseResourceId(pokemon.species.url),
  name: pokemon.name,
  imageUrl: getPokemonImageUrl(pokemon),
  types: pokemon.types.map(({ type }) => ({
    id: parseResourceId(type.url),
    name: type.name,
  })),
})

const mapSpeciesSummary = (species: PokemonSpeciesDetailResponse): PokemonSummary | null => {
  const defaultVariety = species.varieties.find(({ is_default }) => is_default) ?? species.varieties[0]

  if (!defaultVariety) {
    return null
  }

  const toFormSummary = ({ name, url }: { name: string; url: string }): PokemonFormSummary => {
    const id = parseResourceId(url)
    return {
      id,
      name,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
    }
  }

  return {
    ...toFormSummary(defaultVariety.pokemon),
    dexNumber: species.id,
    types: [],
    alternateForms: species.varieties
      .filter(({ pokemon }) => pokemon.url !== defaultVariety.pokemon.url)
      .map(({ pokemon }) => toFormSummary(pokemon)),
  }
}

const mapPokemonDetail = (pokemon: PokemonApiDetail): PokemonDetail => ({
  ...mapPokemonSummary(pokemon),
  baseExperience: pokemon.base_experience,
  height: pokemon.height,
  weight: pokemon.weight,
  stats: mapPokemonStats(pokemon.stats),
})

class ApiRequestError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

const toUserFriendlyError = (query: string, type: 'Pokémon' | 'type') => {
  const label = type === 'Pokémon' ? 'Pokémon' : 'type'
  return new Error(`No ${label} found for "${query}". Please try another search.`)
}

const requestJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new ApiRequestError(response.status, `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapItem: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex++
        results[index] = await mapItem(items[index])
      }
    }),
  )

  return results
}

export async function fetchPokemonPage(limit = 100, offset = 0): Promise<PokemonListPage> {
  const list = await requestJson<PokemonListResponse>(
    `${apiUrl('/pokemon-species')}?limit=${limit}&offset=${offset}`,
  )
  const species = await mapWithConcurrency(list.results, 10, ({ url }) =>
    requestJson<PokemonSpeciesDetailResponse>(url),
  )

  return {
    totalCount: list.count,
    items: species.flatMap((entry) => {
      const summary = mapSpeciesSummary(entry)
      return summary ? [summary] : []
    }),
  }
}

export async function fetchPokemonList(limit = 100, offset = 0): Promise<PokemonSummary[]> {
  const { items } = await fetchPokemonPage(limit, offset)
  return items
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetail> {
  const normalizedName = normalizePokemonName(name)

  if (!normalizedName) {
    throw toUserFriendlyError(name, 'Pokémon')
  }

  try {
    const pokemon = await requestJson<PokemonApiDetail>(apiUrl(`/pokemon/${normalizedName}`))
    return mapPokemonDetail(pokemon)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      throw toUserFriendlyError(name, 'Pokémon')
    }

    throw error
  }
}

export async function fetchPokemonByType(typeName: string): Promise<PokemonSummary[]> {
  const normalizedTypeName = normalizePokemonName(typeName)

  if (!normalizedTypeName) {
    throw toUserFriendlyError(typeName, 'type')
  }

  let typeResponse: PokemonTypeDetailResponse

  try {
    typeResponse = await requestJson<PokemonTypeDetailResponse>(apiUrl(`/type/${normalizedTypeName}`))
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      throw toUserFriendlyError(typeName, 'type')
    }

    throw error
  }

  if (!typeResponse?.pokemon?.length) {
    throw toUserFriendlyError(typeName, 'type')
  }

  const matchedPokemon = await mapWithConcurrency(typeResponse.pokemon, 10, async ({ pokemon }) => {
    const detail = await requestJson<PokemonApiDetail>(apiUrl(`/pokemon/${pokemon.name}`))
    return parseResourceId(detail.species.url)
  })

  const speciesIds = [...new Set(matchedPokemon)]
  const species = await mapWithConcurrency(speciesIds, 10, (id) =>
    requestJson<PokemonSpeciesDetailResponse>(apiUrl(`/pokemon-species/${id}`)),
  )

  return species.flatMap((entry) => {
    const summary = mapSpeciesSummary(entry)
    return summary ? [summary] : []
  })
}

export async function fetchTypeList(): Promise<PokemonTypeListResponse> {
  return requestJson<PokemonTypeListResponse>(apiUrl('/type'))
}

export async function fetchTypeByName(typeName: string): Promise<PokemonTypeDetailResponse> {
  const normalizedTypeName = normalizePokemonName(typeName)

  if (!normalizedTypeName) {
    throw toUserFriendlyError(typeName, 'type')
  }

  try {
    return await requestJson<PokemonTypeDetailResponse>(apiUrl(`/type/${normalizedTypeName}`))
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      throw toUserFriendlyError(typeName, 'type')
    }

    throw error
  }
}
