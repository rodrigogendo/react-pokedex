import type { PokemonDetail, PokemonFormSummary } from '../../types/pokemon'
import { pokemonStatLabels } from '../../types/pokemon'
import { formatPokemonName } from '../../utils/pokemon'

type PokemonDetailCardProps = {
  pokemon: PokemonDetail
  baseForm?: PokemonFormSummary
  alternateForms?: PokemonFormSummary[]
  onFormSelect?: (form: PokemonFormSummary) => void
}

const formatMeasurement = (value: number, unit: string) => `${(value / 10).toFixed(1)} ${unit}`

export function PokemonDetailCard({
  pokemon,
  baseForm,
  alternateForms = [],
  onFormSelect,
}: PokemonDetailCardProps) {
  return (
    <article className="mt-6 animate-[formSlideIn_240ms_ease-out] rounded-2xl border-4 border-pokedex-red bg-pokedex-paper p-4 shadow-[6px_6px_0_var(--color-pokedex-red-dark)] sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-pokedex-red bg-white p-4">
          {pokemon.imageUrl ? (
            <img
              src={pokemon.imageUrl}
              alt={formatPokemonName(pokemon.name)}
              className="h-40 w-40 object-contain sm:h-48 sm:w-48"
            />
          ) : (
            <span className="text-lg font-bold uppercase tracking-[0.2em] text-pokedex-red-dark">
              #{String(pokemon.dexNumber).padStart(3, '0')}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
            <span>#{String(pokemon.dexNumber).padStart(3, '0')}</span>
          </div>

          <h3 className="mt-2 h-[2.5em] min-w-0 overflow-hidden text-2xl font-bold capitalize leading-tight text-pokedex-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-3xl">
            {formatPokemonName(pokemon.name)}
          </h3>

          {alternateForms.length > 0 && onFormSelect && (
            <div className="mt-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
                Alternate Forms
              </h4>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Alternate forms">
                {[baseForm ?? { id: pokemon.id, name: pokemon.name, imageUrl: pokemon.imageUrl }, ...alternateForms].map((form) => (
                  <button
                    key={form.id}
                    type="button"
                    aria-pressed={pokemon.id === form.id}
                    onClick={() => onFormSelect(form)}
                    title={formatPokemonName(form.name)}
                    className={`max-w-full truncate rounded-md border-2 px-2 py-1 text-xs font-bold capitalize transition ${
                      pokemon.id === form.id
                        ? 'border-pokedex-red bg-pokedex-red text-white'
                        : 'border-pokedex-red bg-white text-pokedex-red-dark hover:bg-pokedex-paper'
                    }`}
                  >
                    {formatPokemonName(form.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          <dl className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm">
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
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.entries(pokemonStatLabels).map(([key, label]) => (
            <div key={key} className="min-w-0 rounded-lg border-2 border-pokedex-red bg-white p-2">
              <dt className="text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-pokedex-red-dark sm:text-xs">
                {label}
              </dt>
              <dd className="mt-1 text-lg font-bold text-pokedex-ink sm:text-xl">
                {pokemon.stats[key as keyof typeof pokemon.stats]}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
