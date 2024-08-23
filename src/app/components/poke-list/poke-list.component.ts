import { PokeService } from '../../services/poke/pokeHttp.service'
import { Component } from '@angular/core'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { Router } from '@angular/router'
import {
  IPokemonNormalized,
  PokemonNormalized,
} from '../../helpers/pokemonNormalizer'
import { INamedAPIResource } from '../../types/pokemonApi'
import { TEnumKeys } from '../../types/globals'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { capitalize } from '../../helpers/strings'
import { getPageData } from '../../helpers/arrays'
import { ThFilterableComponent } from '../th-filterable/th-filterable.component'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSortModule } from '@angular/material/sort'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { debounced } from '../../helpers/inputField'
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
    ThFilterableComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent {
  constructor(
    private pokeService: PokeService,
    private router: Router,
  ) {}

  pageSizeOptions = [5, 10, 15]
  displayedColumn: TColumn[] = Object.values(columns)
  pokeList: IPokemonNormalized[] = []
  loading: boolean = false
  count = 0
  perPage = 5
  pageIndex = 0
  typeFilterOptions: INamedAPIResource[] = []
  nameSearchTerm: null | string = null
  emptyMessage: string | null = null

  typeFilters: {
    active: INamedAPIResource[]
    results?: IPokemonNormalized[]
  } | null = null

  get capitalize() {
    return capitalize
  }

  get columns() {
    return columns
  }

  get listData() {
    const fitleredResults = this.typeFilters?.results

    const data = fitleredResults
      ? getPageData<IPokemonNormalized[]>(
          this.pageIndex,
          this.perPage,
          fitleredResults,
        )
      : this.pokeList

    if (data?.length) this.emptyMessage = null

    return data
  }

  //if filtered get total from the fitlered results
  get total() {
    return this.typeFilters?.results?.length ?? this.count
  }

  get showPagination() {
    return this.listData.length >= this.pageSizeOptions[0] || this.pageIndex > 0
  }

  async ngOnInit() {
    await this.fetchPokeList()
    await this.fetchTypes()
  }

  async fetchPokeList(perPage: number = 5, pageIndex: number = 0) {
    this.loading = true

    this.pokeService.getPokemonNamesAndUrls(perPage, pageIndex).subscribe({
      next: (data) => {
        this.count = data.count
        this.pokeService.getPokemons(data.results).subscribe({
          next: (results: IPokemonNormalized[]) => (this.pokeList = results),
          error: (error: Error) => console.error(error), //TODO: Improve error
          complete: () => {
            if (data.results?.length == this.pokeList?.length) {
              this.loading = false
            }
          },
        })
      },
      error: (error) => console.error(error), //TODO: Improve error handling
    })
  }

  onRowClicked(id: string) {
    this.router.navigate([`poke/${id}`])
  }

  onPaginationChange(payload: PageEvent) {
    this.perPage = payload.pageSize
    this.pageIndex = payload.pageIndex

    if (!this.typeFilters) {
      this.fetchPokeList(payload.pageSize, payload.pageIndex)
    }
  }

  onEnterSearchName(event: Event) {
    if (this.nameSearchTerm) {
      this.pokeService.getPokemonByName(this.nameSearchTerm).subscribe({
        next: (result) => (this.pokeList = [new PokemonNormalized(result)]),
      })
    }
  }

  searchByName(value: string) {
    if (!value?.length) this.onClearSearchByName()
    this.loading = true

    this.typeFilters = null

    debounced(() => {
      this.pokeService.getPokemonByName(value).subscribe({
        next: (result) => (this.pokeList = [new PokemonNormalized(result)]),
        error: (error) => {
          if (error.status == 404) {
            this.pokeList = []
          }
          this.loading = false
          this.emptyMessage = `Sorry! No results with the term ${value} was found.`
        },
        complete: () => (this.loading = false),
      })
    }, 1000)
  }

  onClearSearchByName(event?: Event) {
    this.typeFilters = null
    this.nameSearchTerm = ''
    this.fetchPokeList(this.perPage, this.pageIndex)
  }

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
    this.nameSearchTerm = null
    const types: INamedAPIResource[] = payload.value

    if (payload.value?.length) {
      this.typeFilters = {
        active: payload.value,
        results: [],
      }
      this.getTypeFilteredList(types)
    } else {
      this.typeFilters = null
      this.fetchPokeList()
    }
  }

  getTypeFilteredList(types: INamedAPIResource[]) {
    this.loading = true
    this.pokeService.getPokemonByType(types).subscribe({
      next: (data) => {
        this.pokeService.getTypesPokemons(data).subscribe({
          next: (data) => {
            if (this.typeFilters) this.typeFilters.results = data
          },
          error: (error: Error) => console.error(error), //TODO: Improve error handling
          complete: () => {
            if (data.length == this?.typeFilters?.results?.length) {
              this.loading = false
            }
          },
        })
      },
      error: (error) => console.error(error), //TODO: Improve error handling
    })
  }
}
