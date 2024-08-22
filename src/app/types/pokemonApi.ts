export interface IPokemon {
  id: number
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number
  abilities: IAbility[]
  forms: IForm[]
  game_indices: IGameIndex[]
  held_items: IHeldItem[]
  location_area_encounters: string
  moves: IMove[]
  species: ISpecies
  sprites: ISprites
  stats: IStat[]
  types: IType[]
}

export interface IAbility {
  ability: INamedAPIResource
  is_hidden: boolean
  slot: number
}

export interface INamedAPIResource {
  name: string
  url: string
}

export interface IForm {
  name: string
  url: string
}

export interface IGameIndex {
  game_index: number
  version: INamedAPIResource
}

export interface IHeldItem {
  item: INamedAPIResource
  version_details: IVersionDetail[]
}

export interface IVersionDetail {
  rarity: number
  version: INamedAPIResource
}

export interface IMove {
  move: INamedAPIResource
  version_group_details: IVersionGroupDetail[]
}

export interface IVersionGroupDetail {
  level_learned_at: number
  move_learn_method: INamedAPIResource
  version_group: INamedAPIResource
}

export interface ISpecies {
  name: string
  url: string
}

export interface ISprites {
  back_default: URL | null
  back_female: URL | null
  back_shiny: URL | null
  back_shiny_female: URL | null
  front_default: URL | null
  front_female: URL | null
  front_shiny: URL | null
  front_shiny_female: URL | null
  other?: IOtherSprites
  versions?: TVersionSprites
}

export interface IOtherSprites {
  dream_world: IDreamWorld
  home: IHome
  official_artwork: IOfficialArtwork
}

export interface IDreamWorld {
  front_default: URL | null
  front_female: URL | null
}

export interface IHome {
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
}

export interface IOfficialArtwork {
  front_default: URL | null
}

export interface TVersionSprites {
  [key: string]: {
    [key: string]: {
      back_default: URL | null
      back_female: URL | null
      back_shiny: URL | null
      back_shiny_female: URL | null
      front_default: URL | null
      front_female: URL | null
      front_shiny: URL | null
      front_shiny_female: URL | null
    }
  }
}

export interface IStat {
  base_stat: number
  effort: number
  stat: INamedAPIResource
}

export interface IType {
  slot: number
  type: INamedAPIResource
}

export interface IPaginatedResponse<T> {
  count: number
  next: URL | null
  previous: URL | null
  results: T[]
}

export interface IPokemonSlot {
  slot: number
  pokemon: INamedAPIResource
}
export interface IPokemonTypeResponse {
  damage_relations: IDamageRelations
  game_indices: IGameIndex[]
  generation: INamedAPIResource
  id: number
  move_damage_class: INamedAPIResource
  moves: INamedAPIResource[]
  name: string
  names: IName[]
  pokemon: IPokemonSlot[]
}

export interface IName {
  name: string
  language: INamedAPIResource
}

export interface IGameIndex {
  game_index: number
  generation: INamedAPIResource
}

export interface IDamageRelations {
  no_damage_to: INamedAPIResource[]
  half_damage_to: INamedAPIResource[]
  double_damage_to: INamedAPIResource[]
  no_damage_from: INamedAPIResource[]
  half_damage_from: INamedAPIResource[]
  double_damage_from: INamedAPIResource[]
}
