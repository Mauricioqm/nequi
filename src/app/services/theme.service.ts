import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = new BehaviorSubject<boolean>(false);

  constructor() {}

  setInitialTheme() {
    const storedDarkMode = localStorage.getItem('darkMode');

    if (storedDarkMode !== null) {
      const isDarkModeEnabled = JSON.parse(storedDarkMode);
      this.darkMode.next(isDarkModeEnabled);
      this.setTheme(isDarkModeEnabled);
    } else {
      this.darkMode.next(false);
      this.setTheme(false);
    }
  }

  setTheme(darkMode: boolean) {
    console.log(darkMode);

    if (darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
    this.darkMode.next(darkMode);

    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }
}
