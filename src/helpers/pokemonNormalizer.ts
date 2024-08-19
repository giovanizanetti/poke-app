import { IPokemon, IType } from '../app/services/poke/pokeHttp.service.types'
import { capitalize } from './strings'

/**
 * TODO:
 *
 * Finish data normalization by adding 3 more properties
 *
 * Move types file to a separed location
 *
 *
 * Use PokemonNormalized in the pokemoon list and Details
 */

interface IPokemonNormalized {
  id: number
  name: string
  image: URL
  types: string
}

export class PokemonNormalized implements IPokemonNormalized {
  readonly id: number
  readonly name: string
  readonly image: URL
  readonly types: string

  constructor(data: IPokemon) {
    this.id = data.id
    this.name = data.name
    this.image = data.sprites.front_default || (data.sprites.front_shiny as URL)
    this.types = getFormatedTypes(data.types)
  }
}

const getFormatedTypes = (types: IType[]) =>
  types.map((item) => capitalize(item.type.name)).join(' - ')
