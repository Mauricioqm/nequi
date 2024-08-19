import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service'
import { ThemeService } from 'src/app/services/theme.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'nequi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: String; //Titulo querecibe el Header, debe ser de tipo string
  @Input() backButtom!: String; //Recibirá la ruta a la que queremos navegar cuando vamos hacia atras
  @Input() isModal!: boolean; //Verifica que se va a usar el Heaer en una modal
  @Input() color!: string; //Para asignar color al header
  @Input() centerTitle!: boolean; //PAra asignar color al header

  // Activar el modo oscuro
  darkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor
  (
    private utilsService: UtilsService,
    private themeSvc: ThemeService
  ) { }

  ngOnInit() {
    this.darkMode = this.themeSvc.darkMode
  }

  theme(darkMode: boolean) {
    this.themeSvc.setTheme(darkMode);
  }

  dismissModal() {
    this.utilsService.dismissModal();
  }

}
