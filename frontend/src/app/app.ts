import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooter } from './shared/site-footer/site-footer';
import { SiteHeader } from './shared/site-header/site-header';

@Component({
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly showChrome = signal(true);

  constructor(router: Router) {
    this.showChrome.set(!['/login', '/registro'].includes(router.url));
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.showChrome.set(!['/login', '/registro'].includes(event.urlAfterRedirects)));
  }
}
