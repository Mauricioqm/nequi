import { Component, OnInit } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { map } from 'rxjs/operators';

@Component({
  selector: 'nequi-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {

  imageUrl: string = '';
  constructor(private remoteConfig: AngularFireRemoteConfig) {}

  async ngOnInit() {
    try {
      // Fetch and activate the Remote Config values
      await this.remoteConfig.fetchAndActivate();

      // Get the value from Remote Config
      const heroImageUrlValue = this.remoteConfig.getValue('logo_principal');
      this.imageUrl = (await heroImageUrlValue).asString();
    } catch (error) {
      console.error('Error fetching Remote Config value: ', error);
    }
  }

}
