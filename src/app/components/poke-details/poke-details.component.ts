import { Component } from '@angular/core'
import { PokeService } from '../../services/poke/pokeHttp.service'
import { ActivatedRoute } from '@angular/router'
import { IPokemon } from '../../services/poke/pokeHttp.service.types'
import { MatCardModule } from '@angular/material/card'
import { PokemonNormalized } from '../../../helpers/pokemonNormalizer'

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent {
  constructor(
    private pokeService: PokeService,
    private route: ActivatedRoute,
  ) {}

  pokemon: IPokemon | null = null
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
      this.pokeService.getPokemonByNameOrId(this.pokemonId).subscribe({
        next: (result: IPokemon) => {
          console.log(new PokemonNormalized(result))
        },
        error: (error: Error) => console.error(error), //TODO: Improve error handling
        complete: () => {
          this.loading = false
          if (this.pokemon) console.log(new PokemonNormalized(this.pokemon))
        },
      })
    }
  }
}
