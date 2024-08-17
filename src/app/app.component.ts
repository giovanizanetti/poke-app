import { Component } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'poke-app'
}
