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
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: string | null
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
  other?: IOtherSprites
  versions?: TVersionSprites
}

export interface IOtherSprites {
  dream_world: IDreamWorld
  home: IHome
  official_artwork: IOfficialArtwork
}

export interface IDreamWorld {
  front_default: string | null
  front_female: string | null
}

export interface IHome {
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
}

export interface IOfficialArtwork {
  front_default: string | null
}

export interface TVersionSprites {
  [key: string]: {
    [key: string]: {
      back_default: string | null
      back_female: string | null
      back_shiny: string | null
      back_shiny_female: string | null
      front_default: string | null
      front_female: string | null
      front_shiny: string | null
      front_shiny_female: string | null
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

export interface IPokeListResponse {
  count: number
  next: URL | null
  previous: URL | null
  results: {
    name: string
    url: URL
  }[]
}
