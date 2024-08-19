import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from '../models/task.interface'
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor
  (
    private db: AngularFirestore,
    private utilsService: UtilsService
  )
  {}

  getCollection(path: string): Observable<Task[]> {
    return this.db.collection<Task>(path).valueChanges({idField: 'id'});
  }

  addTask(task: Task): Promise<void> {
    const id = this.db.createId();
    return this.db.collection<Task>('task').doc(id).set(task);
  }

  async updateTask(id: string, task: Task): Promise<void> {
    const taskDocRef = this.db.collection<Task>('task').doc(id);
    return taskDocRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot?.exists) {
        return taskDocRef.update(task);
      } else {
        throw new Error('El documento no existe en la colección');
      }
    }).catch(error => {
      console.error('Error al actualizar la tarea: ', error);
      throw error;
    });
  }

  async deleteTask(id: string): Promise<void> {
    const taskDocRef = this.db.collection<Task>('task').doc(id);

    return taskDocRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot?.exists) {
        return taskDocRef.delete().then(() => {
        });
      } else {
        throw new Error('El documento no existe y no puede ser eliminado');
      }
    }).catch(error => {
      console.error('Error al eliminar la tarea: ', error);
    });
  }


}
