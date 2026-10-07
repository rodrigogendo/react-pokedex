import type { PokemonDetail } from '../../types/pokemon'
import { pokemonStatLabels } from '../../types/pokemon'

type PokemonDetailCardProps = {
  pokemon: PokemonDetail
}

const formatMeasurement = (value: number, unit: string) => `${(value / 10).toFixed(1)} ${unit}`

export function PokemonDetailCard({ pokemon }: PokemonDetailCardProps) {
  return (
    <article className="mt-6 rounded-2xl border-4 border-pokedex-red bg-pokedex-paper p-4 shadow-[6px_6px_0_var(--color-pokedex-red-dark)] sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-pokedex-red bg-white p-4">
          {pokemon.imageUrl ? (
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="h-40 w-40 object-contain sm:h-48 sm:w-48"
            />
          ) : (
            <span className="text-lg font-bold uppercase tracking-[0.2em] text-pokedex-red-dark">
              #{String(pokemon.id).padStart(3, '0')}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
            <span>#{String(pokemon.id).padStart(3, '0')}</span>
          </div>

          <h3 className="mt-2 text-3xl font-bold capitalize text-pokedex-ink">{pokemon.name}</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map(({ name, id }) => (
              <span
                key={`${id}-${name}`}
                className="rounded-full border-2 border-pokedex-red bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-pokedex-red-dark"
              >
                {name}
              </span>
            ))}
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">Base XP</dt>
              <dd className="mt-1 text-pokedex-ink">{pokemon.baseExperience ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">Height</dt>
              <dd className="mt-1 text-pokedex-ink">{formatMeasurement(pokemon.height, 'm')}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">Weight</dt>
              <dd className="mt-1 text-pokedex-ink">{formatMeasurement(pokemon.weight, 'kg')}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
          Base Stats
        </h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(pokemonStatLabels).map(([key, label]) => (
            <div key={key} className="rounded-xl border-2 border-pokedex-red bg-white p-3">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
                {label}
              </dt>
              <dd className="mt-2 text-xl font-bold text-pokedex-ink">
                {pokemon.stats[key as keyof typeof pokemon.stats]}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
