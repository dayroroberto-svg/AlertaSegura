import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooter } from './client/shared/site-footer/site-footer';
import { SiteHeader } from './client/shared/site-header/site-header';

@Component({
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly showChrome = signal(true);

  constructor(router: Router) {
    this.showChrome.set(this.hasChrome(router.url));
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.showChrome.set(this.hasChrome(event.urlAfterRedirects)));
  }

  // El panel admin trae su propio layout, así que no lleva el header ni el footer públicos.
  private hasChrome(url: string): boolean {
    return !['/login', '/registro'].includes(url) && url !== '/admin' && !url.startsWith('/admin/');
  }
}
