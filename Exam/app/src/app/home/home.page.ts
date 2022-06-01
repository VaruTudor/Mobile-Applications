import {Component} from '@angular/core';
import {WebsocketService} from '../shared/service/websocket.service';
import * as Rx from 'rxjs';
import {LoadingController, ToastController} from '@ionic/angular';
import {HttpService} from '../shared/service/http.service';
import {Message} from '../shared/model/message';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  websocketSubject: Rx.Subject<MessageEvent>;
  messages: Message[] = [];
  senders: string[] = [];
  toggledMessages: Message[] = [];
  lastSender = '';
  unToggledColor = 'blue';
  toggledColor = 'red';

  constructor(private websocketService: WebsocketService, private toastController: ToastController,
              private httpService: HttpService, private loadingController: LoadingController) {

  }

  ionViewDidEnter() {
    this.websocketSubject = this.websocketService.connect();
    this.websocketSubject.subscribe(
      async messageEvent => {
        const response = JSON.parse(messageEvent.data);
        this.senders = response.users;
      }
    );
  }

  async getMessages(sender) {
    const loading = await this.loadingController.create({
      message: 'Fetching messages, please wait...',
    });
    await loading.present();

    this.httpService.getMessages(sender).subscribe(
      response => {
        this.messages = response;
        this.lastSender = sender;
        loading.dismiss();
      },
      async error => {
        const toast = await this.toastController.create({
          message: 'An error has occurred while trying to fetch tasks',
          duration: 2000
        });
        toast.present();
        loading.dismiss();
      });
  }

  toggleMessage(message: Message) {
    let messageFound = false;
    this.toggledMessages.forEach((m, index) => {
      if (m === message) {
        this.toggledMessages.splice(index,1);
        messageFound = true;
      }
    });
    if (!messageFound) {
      this.toggledMessages.push(message);
    }

  }

  async deleteToggledMessages() {
    const loading = await this.loadingController.create({
      message: 'Deleting messages, please wait...',
    });
    await loading.present();

    for (let i=0; i< this.toggledMessages.length; i++){
      this.httpService.deleteMessage(this.toggledMessages[i]).subscribe(
        response => {},
        error => {
          const toastError = await this.toastController.create({
            message: 'Toggled Messages Deleted successfully',
            duration: 2000
          });
          toastSuccess.present();
          loading.dismiss();
        }
      );
    }

    const toastSuccess = await this.toastController.create({
      message: 'Toggled Messages Deleted successfully',
      duration: 2000
    });
    toastSuccess.present();
    loading.dismiss();

    this.getMessages(this.lastSender);
  }

  isToggled(message) {
    let messageFound = false;
    this.toggledMessages.forEach((m, index) => {
      if (m === message) {
        messageFound = true;
      }
    });

    return messageFound;
  }
}
