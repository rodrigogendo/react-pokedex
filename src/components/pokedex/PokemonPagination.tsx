type PokemonPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PokemonPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PokemonPaginationProps) {
  const pageStart = Math.max(0, currentPage - 2)
  const pageEnd = Math.min(totalPages, pageStart + 5)
  const pageNumbers = Array.from({ length: pageEnd - pageStart }, (_, index) => pageStart + index + 1)

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="rounded-md border-2 border-pokedex-red bg-white px-2 py-1 text-[10px] font-bold uppercase text-pokedex-red-dark transition hover:bg-pokedex-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          First
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="rounded-md border-2 border-pokedex-red bg-white px-2 py-1 text-[10px] font-bold uppercase text-pokedex-red-dark transition hover:bg-pokedex-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber - 1 === currentPage

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber - 1)}
              className={`h-7 min-w-7 rounded-md border-2 px-1 text-xs font-bold transition ${
                isActive
                  ? 'border-pokedex-red bg-pokedex-red text-white shadow-[1px_1px_0_var(--color-pokedex-red-dark)]'
                  : 'border-pokedex-red bg-white text-pokedex-red-dark hover:bg-pokedex-paper'
              }`}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="rounded-md border-2 border-pokedex-red bg-white px-2 py-1 text-[10px] font-bold uppercase text-pokedex-red-dark transition hover:bg-pokedex-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="rounded-md border-2 border-pokedex-red bg-white px-2 py-1 text-[10px] font-bold uppercase text-pokedex-red-dark transition hover:bg-pokedex-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          Last
        </button>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-pokedex-red-dark">
        Page {currentPage + 1} of {totalPages}
      </p>
    </div>
  )
}
