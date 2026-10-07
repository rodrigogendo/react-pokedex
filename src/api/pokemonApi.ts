import type {
  PokemonApiDetail,
  PokemonDetail,
  PokemonListResponse,
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

const mapPokemonSummary = (pokemon: PokemonApiDetail): PokemonSummary => ({
  id: pokemon.id,
  name: pokemon.name,
  imageUrl: pokemon.sprites?.other?.home?.front_default ?? null,
  types: pokemon.types.map(({ type }) => ({
    id: parseResourceId(type.url),
    name: type.name,
  })),
})

const mapPokemonDetail = (pokemon: PokemonApiDetail): PokemonDetail => ({
  ...mapPokemonSummary(pokemon),
  baseExperience: pokemon.base_experience,
  height: pokemon.height,
  weight: pokemon.weight,
  stats: mapPokemonStats(pokemon.stats),
})

const toUserFriendlyError = (query: string, type: 'Pokémon' | 'type') => {
  const label = type === 'Pokémon' ? 'Pokémon' : 'type'
  return new Error(`No ${label} found for "${query}". Please try another search.`)
}

const requestJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export async function fetchPokemonList(limit = 1000): Promise<PokemonSummary[]> {
  const list = await requestJson<PokemonListResponse>(`${apiUrl('/pokemon')}?limit=${limit}`)

  return list.results.map(({ name, url }) => {
    const id = parseResourceId(url)

    return {
      id,
      name,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
      types: [],
    }
  })
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetail> {
  const normalizedName = normalizePokemonName(name)

  if (!normalizedName) {
    throw toUserFriendlyError(name, 'Pokémon')
  }

  const pokemon = await requestJson<PokemonApiDetail>(apiUrl(`/pokemon/${normalizedName}`))

  return mapPokemonDetail(pokemon)
}

export async function fetchPokemonByType(typeName: string): Promise<PokemonSummary[]> {
  const normalizedTypeName = normalizePokemonName(typeName)

  if (!normalizedTypeName) {
    throw toUserFriendlyError(typeName, 'type')
  }

  const typeResponse = await requestJson<PokemonTypeDetailResponse>(
    apiUrl(`/type/${normalizedTypeName}`),
  )

  if (!typeResponse?.pokemon?.length) {
    throw toUserFriendlyError(typeName, 'type')
  }

  const typeId = typeResponse.id
  const detailedType = await requestJson<PokemonTypeDetailResponse>(apiUrl(`/type/${typeId}`))

  return detailedType.pokemon.map(({ pokemon }) => ({
    id: parseResourceId(pokemon.url),
    name: pokemon.name,
    imageUrl: null,
    types: [],
  }))
}

export async function fetchTypeList(): Promise<PokemonTypeListResponse> {
  return requestJson<PokemonTypeListResponse>(apiUrl('/type'))
}

export async function fetchTypeByName(typeName: string): Promise<PokemonTypeDetailResponse> {
  const normalizedTypeName = normalizePokemonName(typeName)

  if (!normalizedTypeName) {
    throw toUserFriendlyError(typeName, 'type')
  }

  return requestJson<PokemonTypeDetailResponse>(apiUrl(`/type/${normalizedTypeName}`))
}
