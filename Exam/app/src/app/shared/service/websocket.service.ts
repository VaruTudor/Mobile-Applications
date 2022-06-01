import {Injectable} from '@angular/core';
import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  baseUrl = 'localhost:3000';
  wsUrl = `ws://${this.baseUrl}`;

  private subject: Rx.Subject<MessageEvent>;

  constructor() {
  }

  public connect(): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(this.wsUrl);
    }
    return this.subject;
  }

  waitForConnection(ws, callback, interval) {
    if (ws.readyState === WebSocket.OPEN) {
      callback();
    } else {
      setTimeout(() => {
        this.waitForConnection(ws, callback, interval);
      }, interval);
    }
  };

  private create(url): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = new Observable((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    const observer = {
      next: (data) => {
        this.waitForConnection(ws, () => {
          ws.send(JSON.stringify(data));
        }, 5);
      }
    };

    return Rx.Subject.create(observer, observable);
  }

}
