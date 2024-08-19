import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Task } from '../models/task.interface'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor
  (
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  // Present
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // Dismiss
  async dismissLoading() {
    return await this.loadingController.dismiss()
  }

  async presentAlert(opts: AlertOptions) {
    const alert= await this.alertController.create(opts);
    await alert.present();
  }

  // Para abrir la modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }

  // Cierra la modal
  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }

  getPercentege(task: Task) {
    let completedItems= task.items.filter(item => item.complete).length;
    let totalItems= task.items.length;
    let percentage= (100 / totalItems) * completedItems;
    return parseInt(percentage.toString());
  }
}
