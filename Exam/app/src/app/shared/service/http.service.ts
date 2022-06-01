import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message} from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getMessages(value: string): Observable<Array<Message>> {
    return this.httpClient.get<Array<Message>>(`${this.baseUrl}/message?sender=${value}`);
  }

  deleteMessage(message: Message): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/message/${message.id}`);
  }

}
