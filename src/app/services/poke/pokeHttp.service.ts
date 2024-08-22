import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { forkJoin, map, Observable } from 'rxjs'
import { POKE_BASE_URL } from '../../dictionary'
import {
  INamedAPIResource,
  IPaginatedResponse,
  IPokemon,
  IPokemonTypeResponse,
} from '../../types/pokemonApi'
import {
  IPokemonNormalized,
  PokemonNormalized,
} from '../../helpers/pokemonNormalizer'

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  constructor(private http: HttpClient) {}

  getPokemonNamesAndUrls(
    limit: number,
    pageIndex: number,
  ): Observable<IPaginatedResponse<INamedAPIResource>> {
    const offset = pageIndex * limit

    return this.http.get<IPaginatedResponse<INamedAPIResource>>(
      `${POKE_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    )
  }

  getPokemonByName(nameOrId: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(
      `${POKE_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`,
    )
  }

  getPokemons(
    pokemonInfoData: INamedAPIResource[],
  ): Observable<IPokemonNormalized[]> {
    const requests = pokemonInfoData.map((item: INamedAPIResource) =>
      this.getPokemonByName(item.name),
    )

    return forkJoin(requests).pipe(
      map((responses: IPokemon[]) => {
        return responses.flatMap((response) => new PokemonNormalized(response))
      }),
    )
  }

  getTypes(): Observable<IPaginatedResponse<INamedAPIResource>> {
    return this.http.get<IPaginatedResponse<INamedAPIResource>>(
      `${POKE_BASE_URL}/type`,
    )
  }

  getPokemonByType(
    types: INamedAPIResource[],
  ): Observable<INamedAPIResource[]> {
    const requests: Observable<IPokemonTypeResponse>[] = types.map((type) =>
      this.http.get<IPokemonTypeResponse>(`${POKE_BASE_URL}/type/${type.name}`),
    )

    return forkJoin(requests).pipe(
      map((responses: IPokemonTypeResponse[]) => {
        return responses.flatMap((response) =>
          response.pokemon.map((item) => item.pokemon),
        )
      }),
    )
  }

  getTypesPokemons(
    data: INamedAPIResource[],
  ): Observable<IPokemonNormalized[]> {
    const requests: Observable<IPokemon>[] = data.map((item) =>
      this.getPokemonByName(item.name),
    )

    return forkJoin(requests).pipe(
      map((responses: IPokemon[]) => {
        return responses.flatMap((response) => new PokemonNormalized(response))
      }),
    )
  }
}
