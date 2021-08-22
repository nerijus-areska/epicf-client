import { Injectable } from '@angular/core';
import { UserStatus } from '../shared/UserStatus';
import { UserStatusComponent } from '../user-status/user-status.component';
declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public userStatus: UserStatus;

  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient;
  public msg = [];
  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/message', (message) => {
        if (message.body) {
          // that.msg.push(message.body);
          // console.log('GOT MESSAGE: ' + message.body);
          that.processMessage(message.body);
        }
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send('/app/send/message', {}, message);
  }

  processMessage(message) {
    const msg = JSON.parse(message);
    if (msg.type === 'userStatus') {
      console.log('new Energy ' + msg.payload.energy);
      this.userStatus = msg.payload;
    }
  }

  getUserStatus() {
    return this.userStatus;
  }
}
