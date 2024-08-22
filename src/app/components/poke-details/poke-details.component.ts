import { Component } from '@angular/core'
import { PokeService } from '../../services/poke/pokeHttp.service'
import { ActivatedRoute } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list'
import { IPokemon } from '../../types/pokemonApi'
import {
  IPokemonNormalized,
  PokemonNormalized,
} from '../../helpers/pokemonNormalizer'
import { CommonModule } from '@angular/common'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent {
  constructor(
    private pokeService: PokeService,
    private route: ActivatedRoute,
  ) {}

  pokemon: IPokemonNormalized | null = null
  loading = false

  get pokemonId() {
    return this.route.snapshot.paramMap.get('id')
  }

  async ngOnInit() {
    await this.fetchPokemon()
  }

  async fetchPokemon() {
    if (this.pokemonId) {
      this.loading = true
      this.pokeService.getPokemonByName(this.pokemonId).subscribe({
        next: (result: IPokemon) => {
          this.pokemon = new PokemonNormalized(result)
        },
        error: (error: Error) => console.error(error), //TODO: Improve error handling
        complete: () => {
          setTimeout(() => (this.loading = false), 200)
        },
      })
    }
  }
}
