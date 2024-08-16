import { Routes } from '@angular/router'
import { PokeDetailsComponent } from './components/poke-details/poke-details.component'
import { PokeListComponent } from './components/poke-list/poke-list.component'
import { NotFoundComponent } from './components/not-found/not-found.component'

export const routes: Routes = [
  { path: 'poke-list', component: PokeListComponent },
  { path: '', redirectTo: '/poke-list', pathMatch: 'full' },
  { path: 'poke/:id', component: PokeDetailsComponent },
  { path: '**', component: NotFoundComponent },
]
