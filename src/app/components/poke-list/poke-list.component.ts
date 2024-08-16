import { Component, OnInit } from '@angular/core'
import { PokeService } from '../../services/poke/pokeHttp.service'
import { IPokemon } from '../../services/poke/pokeHttp.service.types'
import { TableModule } from 'primeng/table'

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [TableModule],
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

  async fetchPokeList(limit: number = 3, offset: number = 0) {
    this.loading = true
    const results: IPokemon[] = []

    this.pokeService.getPokemonNamesAndUrls(limit, offset).subscribe({
      next: (data) =>
        data?.results.forEach((item) => {
          this.pokeService.getPokemonByNameOrId(item.name).subscribe({
            next: (result: IPokemon) => results.push(result),
            error: (error) => console.error(error),
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
}
