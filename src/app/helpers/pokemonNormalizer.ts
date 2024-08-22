import { IAbility, IForm, IPokemon, IType } from '../types/pokemonApi'
import { capitalize } from './strings'

export interface IPokemonNormalized {
  abilities: string
  name: string
  id: number
  image: {
    small: URL
    large: URL
  }
  forms: string
  species: string
  types: string
}

export class PokemonNormalized implements IPokemonNormalized {
  readonly abilities: string
  readonly name: string
  readonly id: number
  readonly image: {
    small: URL
    large: URL
  }
  readonly forms: string
  readonly species: string
  readonly types: string

  constructor(data: IPokemon) {
    this.id = data.id
    this.name = capitalize(data.name)

    this.image = {
      small: (data.sprites?.front_default || data.sprites.front_shiny) as URL,
      large: (data.sprites?.other?.official_artwork?.front_default ||
        data.sprites?.other?.dream_world.front_default ||
        data.sprites?.other?.home.front_default) as URL,
    }

    this.types = getTypes(data.types)
    this.abilities = getAbilities(data.abilities)
    this.species = capitalize(data.species.name)
    this.forms = getForms(data.forms)
  }
}

const getTypes = (types: IType[]) =>
  types.map((item) => capitalize(item.type.name)).join(' - ')

const getAbilities = (abilities: IAbility[]) =>
  abilities.map((item) => capitalize(item.ability.name)).join(' - ')

const getForms = (forms: IForm[]) =>
  forms.map((item) => capitalize(item.name)).join(' - ')
