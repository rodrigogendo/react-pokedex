# Project: Pokedex React

This project will use an API (https://pokeapi.co/api/v2/), to simulate a simple version of a pokedex from the Pokemon game.

## Technical

- Vite + React + Typescript + Tailwind
- Use of states, emptystates, useEffect and cleanup with try/catch and components
- Use types instead of interface
- All types and components should be separated and organized in individual folders
- API should be isolated from the project (decoupled) for easier change of API if necessary
- Mobile-first and responsive
- Code should be as simple as possible for easy maintenance

## Visual

- The pokedex will have a max width and be centralized on the screen on larger screens, while occupying the whole screen on smaller screens
- The background will have a classic Pokemon theme color pallete as seen at /src/assets/insp-models/pokesample.png
- The pokedex will also have a similar theme as seen at /src/assets/insp-models/pokesample.png
- The font used in the project is at /src/assets/fonts
- First screen will have a small bar with three buttons at the top:
    -- Home, Pokédex and Search
- Below will have a main area with a simple design:
    -- "Welcome to the Pokédex App" message at the top
    -- "Explore the world of Pokémon with a comprehensive Pokédex" at the center
- In the Search screen, a search bar above the middle of the screen where the user can type and search for a specific name
- Slightly below the search bar, another Search Area with a "Search for Types", where the user can search for pokemons of each type.

## Features

- Home button will send the user back to the first screen
- Pokédex button will open a list of all registered pokemon, showing their number (id) and name
- Clicking a pokemon will open another screen with the pokemon's image on the left and information on the right
- Information displayed:
    -- ID, Name, Type, Base Experience, Height and Weight
    -- Base Stats: HP, Attack, Defense, Special Attack, Special Defense and Speed

## API

API link:
https://pokeapi.co/api/v2/

The project will support searching for the pokemon name and type.
Searching the name will simply insert the pokemon name to the api link (use trim and toLowerCase) to find the pokemon. Example:
https://pokeapi.co/api/v2/pokemon/{pokemon-name}

Information needed from API:
    - id
    - name
    - base_experience
    - height
    - weight
    - "types": [{name}], both for displaying the type in the Pokémon details, as well as for searching a pokémon by types
    - "stats": [{base_stat}] and "stats": [{stat{name}}] for each of the stats (HP, attack, defense, special-attack, special-defense and speed)
    - "sprites": {"other": {"home: {"front_default"}"}}, this will be used to provide the image of the Pokémon on the left

---

Searching for type (e.g. fire, water, flying, etc) will search for the type ID at https://pokeapi.co/api/v2/type/{pokemon-type}. Them use this ID to find and list all pokemon belonging to that type.

Information needed from API:
- "pokemon": [{"pokemon": {name}}], to find and list all the pokemon

---

When no results are found, for whatever reason (mispell, pokemon doesn't exist or not in the API), display a human response that the pokemon was not found