import { PokeService } from '../../services/poke/pokeHttp.service'
import { IPokemon, IType } from '../../services/poke/pokeHttp.service.types'
import { capitalize } from '../../../helpers/strings'
import { Component } from '@angular/core'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent {
  pokeList: IPokemon[] = []
  loading: boolean = false
  selectedPoke: any

  constructor(private pokeService: PokeService) {}

  async ngOnInit() {
    await this.fetchPokeList()
  }

  async fetchPokeList(limit: number = 1, offset: number = 0) {
    this.loading = true
    const results: IPokemon[] = []

    this.pokeService.getPokemonNamesAndUrls(limit, offset).subscribe({
      next: (data) =>
        data?.results.forEach((item) => {
          this.pokeService.getPokemonByNameOrId(item.name).subscribe({
            next: (result: IPokemon) => results.push(result),
            error: (error) => console.error(error), //TODO: Improve error handling
            complete: () => {
              if (results?.length == data.results.length) {
                this.pokeList = [...results]
                this.loading = false
              }
            },
          })
        }),
      error: (error) => console.error(error),
    })
  }

  get capitalize() {
    return capitalize
  }

  getFormatedTypes = (types: IType[]) =>
    types.map((item, index) => capitalize(item.type.name)).join(' - ')

  displayedColumns: string[] = ['id', 'name', 'types', 'sprite']
}
