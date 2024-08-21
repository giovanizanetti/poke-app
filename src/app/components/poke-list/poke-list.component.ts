import { PokeService } from '../../services/poke/pokeHttp.service'
import { Component } from '@angular/core'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { Router } from '@angular/router'
import {
  IPokemonNormalized,
  PokemonNormalized,
} from '../../helpers/pokemonNormalizer'
import { IPokemon, IType } from '../../types/pokemonApi'
import { TEnumKeys } from '../../types/globals'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'

const columns = {
  id: 'id',
  name: 'name',
  types: 'types',
  species: 'species',
  sprite: 'sprite',
} as const
type TColumn = TEnumKeys<typeof columns>

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent {
  constructor(
    private pokeService: PokeService,
    private router: Router,
  ) {}

  displayedColumn: TColumn[] = Object.values(columns)
  pokeList: IPokemonNormalized[] = []
  loading: boolean = false
  count = 0
  selectedPoke: any

  get columns() {
    return columns
  }

  async ngOnInit() {
    await this.fetchPokeList()
  }

  async fetchPokeList(limit: number = 5, offset: number = 0) {
    this.loading = true
    const results: IPokemonNormalized[] = []

    this.pokeService.getPokemonNamesAndUrls(limit, offset).subscribe({
      next: (data) => {
        this.count = data.count

        data?.results.forEach((item) => {
          this.pokeService.getPokemonByNameOrId(item.name).subscribe({
            next: (result: IPokemon) => {
              results.push(new PokemonNormalized(result))
              results.sort((itemA, itemB) => itemA.id - itemB.id)
            },
            error: (error: Error) => console.error(error), //TODO: Improve error handling
            complete: () => {
              if (results?.length == data.results.length) {
                this.pokeList = results
                this.loading = false
              }
            },
          })
        })
      },
      error: (error) => console.error(error),
    })
  }

  onRowClicked(id: string) {
    this.router.navigate([`poke/${id}`])
  }

  onPaginationChange(payload: PageEvent) {
    this.fetchPokeList(payload.pageSize, payload.pageIndex)
  }
}
