const typeIconUrls = import.meta.glob('../assets/insp-models/type-icons/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

export const getPokemonTypeIconUrl = (typeName: string) =>
  typeIconUrls[`../assets/insp-models/type-icons/${typeName.toLowerCase()}.png`]