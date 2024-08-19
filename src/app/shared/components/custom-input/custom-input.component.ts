import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'nequi-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  @Input() control!: FormControl;
  @Input() label!: String;
  @Input() icon!: String;
  @Input() type!: String;



  constructor() { }

  ngOnInit() {}

}
