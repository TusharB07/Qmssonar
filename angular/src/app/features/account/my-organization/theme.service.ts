// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'isDarkTheme';

  constructor() {
    this.applyTheme();
  }

   applyTheme(): void {
    const isDarkTheme = JSON.parse(localStorage.getItem(this.themeKey)) || false;
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  setTheme(isDarkTheme: boolean): void {
    localStorage.setItem(this.themeKey, JSON.stringify(isDarkTheme));
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
