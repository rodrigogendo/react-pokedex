export const formatPokemonName = (name: string) =>
	name
		.replaceAll('-', ' ')
		.replace(/\bmale\b/gi, '♂')
		.replace(/\bfemale\b/gi, '♀')