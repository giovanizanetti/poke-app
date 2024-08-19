import { IType } from '../app/services/poke/pokeHttp.service.types'

export const capitalize = (string: string) =>
  string[0]?.toUpperCase() + string.toString().slice(1)
