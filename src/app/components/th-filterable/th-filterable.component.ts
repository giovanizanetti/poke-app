import { Component, EventEmitter, Input, Output } from '@angular/core'
import { INamedAPIResource, IPokemon } from '../../types/pokemonApi'
import { CommonModule } from '@angular/common'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { capitalize } from '../../helpers/strings'

@Component({
  selector: 'app-th-filterable',
  standalone: true,
  imports: [MatCheckboxModule, MatSelectModule, CommonModule],
  templateUrl: './th-filterable.component.html',
  styleUrl: './th-filterable.component.scss',
})
export class ThFilterableComponent {
  @Input() filterData!: INamedAPIResource[]
  @Input() label!: string
  @Output() selectionChange = new EventEmitter<MatSelectChange>()

  get capitalize() {
    return capitalize
  }
}
