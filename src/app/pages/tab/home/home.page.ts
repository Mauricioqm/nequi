import { Component, OnInit } from '@angular/core';
import { Task } from '../../../models/task.interface'
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { FeatureFlagService } from 'src/app/services/feature-flag.service';


import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';



@Component({
  selector: 'nequi-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];

  newFeatureEnabled: boolean = false;
  logoPrincipalEnabled: boolean = false;
  loading: boolean = false

  constructor
  (
    private utilsService: UtilsService,
    private firebaseService: FirebaseService,
    private featureFlagService: FeatureFlagService,
    private remoteConfig: AngularFireRemoteConfig
  ) {}

  ngOnInit() {
    this.featureFlagService.getFeatureFlag('add_categories').subscribe(isEnabled => {
      this.newFeatureEnabled = isEnabled;
    });

    this.featureFlagService.getFeatureFlag('logo_principal').subscribe(isEnabled => {
      this.logoPrincipalEnabled = isEnabled;
    });
  }


  ionViewWillEnter(){
    this.getTask()
  }

  getTask() {
    this.loading = true;
    let sub = this.firebaseService.getCollection('task').subscribe({
      next: (resp: any[]) => {
        this.tasks = resp;
        sub.unsubscribe();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getPercentege(task: Task) {
    return this.utilsService.getPercentege(task);
  }

  async addUpdateTask (task?: Task) {
    let res = await this.utilsService.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
      cssClass: 'add-update-modal'
    });
    if (res && res.success) {
      this.getTask();
    }
  }

  confirmDeleteTask(task: Task) {
    this.utilsService.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar esta tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteTask(task)
          }
        }
      ]
    })
  }

  deleteTask(task: Task) {
    this.utilsService.presentLoading()

    this.firebaseService.deleteTask(task.id!).then(res => {

      this.utilsService.presentToast({
        message: 'Tarea eliminada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
      this.getTask()
      this.utilsService.dismissLoading()

    }, error => {

      this.utilsService.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
      this.utilsService.dismissLoading()

    })

  }

}
