import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { forkJoin, map, Observable, pipe, take } from 'rxjs'
import { POKE_BASE_URL } from '../../dictionary'
import {
  INamedAPIResource,
  IPaginatedResponse,
  IPokemon,
  IPokemonTypeResponse,
  IType,
} from '../../types/pokemonApi'

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

  getPokemonByNameOrId(nameOrId: string | number): Observable<IPokemon> {
    return this.http.get<IPokemon>(`${POKE_BASE_URL}/pokemon/${nameOrId}`)
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
        const allPokemon = responses.flatMap((response) =>
          response.pokemon.map((item) => item.pokemon),
        )
        return Array.from(new Set(allPokemon))
      }),
    )
  }
}
