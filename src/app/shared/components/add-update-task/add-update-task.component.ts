import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Item, Task } from 'src/app/models/task.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'nequi-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent  implements OnInit {
  @Input() task!: Task;

  form = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    title: new FormControl<string>('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl<Item[]>([], [Validators.required, Validators.minLength(1)])
  });

  constructor
  (
    private utilsService: UtilsService,
    private firebaseService: FirebaseService
  )
  {}

  ngOnInit() {
    if (this.task) {
      this.form.patchValue(this.task);
      this.form.updateValueAndValidity()
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.task) {
        this.updateTask();
      } else {
        this.addNewTask()
      }
    }
  }

  getPercentege() {
    return this.utilsService.getPercentege(this.form.value as Task);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const currentItems = this.form.value.items ?? [];
    this.form.patchValue({ items: ev.detail.complete(currentItems) });
    this.form.updateValueAndValidity();
  }


  addNewTask() {
    const formValue = this.form.value;
    const task: Task = {
      title: formValue.title!,
      description: formValue.description!,
      items: formValue.items || []
    };

    this.firebaseService.addTask(task).then(() => {
      this.utilsService.dismissModal({ success: true });

      this.utilsService.presentToast({
        message: 'Tarea creada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
      this.utilsService.dismissLoading();
    }, error => {
      this.utilsService.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsService.dismissLoading()
    }).catch(error => {
      console.error('Error al agregar la tarea: ', error);
    });
  }

  removeItem(index: number) {
    this.form.value.items?.splice(index, 1);
    this.form.controls.items.updateValueAndValidity();
  }

  createItem() {
    this.utilsService.presentAlert({
      header: 'Nueva actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Agregar',
          handler: (res) => {

            let item: Item = { name: res.name, complete: false };
            this.form.value.items?.push(item);
            this.form.controls.items.updateValueAndValidity();
          }
        }
      ]
    })
  }

  updateTask() {
    const formValue = this.form.value;
    const task: Task = {
      id: formValue.id,
      title: formValue.title!,
      description: formValue.description!,
      items: formValue.items || []
    };
    this.firebaseService.updateTask(task.id!, task).then(() => {
      this.utilsService.dismissModal({ success: true });

      this.utilsService.presentToast({
        message: 'Tarea actualizada con éxito',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
      this.utilsService.dismissLoading();
    }, error => {
      this.utilsService.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsService.dismissLoading()
    }).catch(error => {
      console.error('Error al actualizar la tarea: ', error);
    });
  }

}
