import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { POKE_BASE_URL } from '../../dictionary'
import { IPokeListResponse, IPokemon } from './pokeHttp.service.types'

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  constructor(private http: HttpClient) {}

  getPokemonNamesAndUrls(
    limit: number = 10,
    offset: number = 0,
  ): Observable<IPokeListResponse> {
    return this.http.get<IPokeListResponse>(
      `${POKE_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    )
  }

  getPokemonByNameOrId(nameOrId: string | number): Observable<IPokemon> {
    return this.http.get<IPokemon>(`${POKE_BASE_URL}/pokemon/${nameOrId}`)
  }
}
