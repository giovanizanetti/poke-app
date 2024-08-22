import { PokeService } from '../../services/poke/pokeHttp.service'
import { Component } from '@angular/core'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { Router } from '@angular/router'
import {
  IPokemonNormalized,
  PokemonNormalized,
} from '../../helpers/pokemonNormalizer'
import { INamedAPIResource, IPokemon } from '../../types/pokemonApi'
import { TEnumKeys } from '../../types/globals'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { capitalize } from '../../helpers/strings'

const columns = {
  id: 'Id',
  name: 'Name',
  types: 'Types',
  species: 'Species',
  sprite: 'Sprite',
} as const
type TColumn = TEnumKeys<typeof columns>

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
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
  limit = 5
  pageIndex = 0
  typeFilterOptions: INamedAPIResource[] = []

  typeFilters: { active: INamedAPIResource[]; results: IPokemonNormalized[] } =
    {
      results: [],
      active: [],
    }

  get columns() {
    return columns
  }

  get listData() {
    return //DO SOME LOGIC HERE TO COMPUTE DATA GETTING DATA
  }

  get capitalize() {
    return capitalize
  }

  async ngOnInit() {
    await this.fetchPokeList()
    await this.fetchTypes()
  }

  async fetchPokeList(limit: number = 5, pageIndex: number = 0) {
    this.loading = true
    const results: IPokemonNormalized[] = []

    this.pokeService.getPokemonNamesAndUrls(limit, pageIndex).subscribe({
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
              this.pokeList = [...results]
              this.loading = false
            },
          })
        })
      },
      error: (error) => console.error(error), //TODO: Improve error handling
    })
  }

  onRowClicked(id: string) {
    this.router.navigate([`poke/${id}`])
  }

  onPaginationChange(payload: PageEvent) {
    this.limit = payload.pageSize
    this.pageIndex = payload.pageIndex

    if (this.typeFilters.active?.length) {
      this.getTypeFilteredList(this.typeFilters.active)
    } else {
      this.fetchPokeList(payload.pageSize, payload.pageIndex)
    }
  }

  // applyEmpFilter(payload: any) {
  //   console.log(payload, 'apply')
  // }

  async fetchTypes() {
    this.loading = true
    this.pokeService.getTypes().subscribe({
      next: (data) => {
        this.typeFilterOptions = data.results.filter(
          (item) => item.name !== 'unknown' && item.name !== 'stellar',
        )
      },
      error: (error: Error) => console.error(error), //TODO: Improve error handling
      complete: () => (this.loading = false),
    })
  }

  async onTypesFilterSelect(payload: MatSelectChange) {
    const types: INamedAPIResource[] = payload.value
    this.typeFilters = payload.value

    if (payload.value?.length) {
      this.getTypeFilteredList(types)
    } else {
      this.fetchPokeList()
    }
  }

  getTypeFilteredList(types: INamedAPIResource[]) {
    this.loading = true
    const results: IPokemonNormalized[] = []

    this.pokeService.getPokemonByType(types).subscribe({
      next: (data) => {
        data.forEach((item, index) => {
          if (index < this.limit) {
            this.pokeService.getPokemonByNameOrId(item.name).subscribe({
              next: (result: IPokemon) => {
                results.push(new PokemonNormalized(result))
                results.sort((itemA, itemB) => itemA.id - itemB.id)
              },
              error: (error: Error) => console.error(error), //TODO: Improve error handling
              complete: () => {
                this.pokeList = [...results]
                this.loading = false
              },
            })
          } else return
        })
      },
      error: (error) => console.error(error), //TODO: Improve error handling
      complete: () => (this.loading = false),
    })
  }
}
