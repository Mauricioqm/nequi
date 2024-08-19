import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags = new BehaviorSubject<{ [key: string]: boolean }>({
    // Default values
    new_feature_enabled: false,
    beta_mode: false,
    show_banner: false,
    logo_principal: false,
    add_categories: false
  });

  constructor(private remoteConfig: AngularFireRemoteConfig) {
    this.loadFeatureFlags();
  }

  private async loadFeatureFlags() {
    try {
      await this.remoteConfig.fetchAndActivate();
      const flags = {
        new_feature_enabled: (await this.remoteConfig.getValue('new_feature_enabled')).asBoolean(),
        beta_mode: (await this.remoteConfig.getValue('beta_mode')).asBoolean(),
        show_banner: (await this.remoteConfig.getValue('show_banner')).asBoolean(),
        logo_principal: (await this.remoteConfig.getValue('logo_principal')).asBoolean(),
        add_categories: (await this.remoteConfig.getValue('add_categories')).asBoolean()
      };

      this.featureFlags.next(flags);
    } catch (error) {
      console.error('Error loading feature flags:', error);
    }
  }

  public getFeatureFlag(key: string): Observable<boolean> {
    return this.featureFlags.asObservable().pipe(
      map(flags => flags[key] || false)
    );
  }
}
