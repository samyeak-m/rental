import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebSocketAPI {
  webSocketEndPoint = 'http://45.115.217.68:8083/ws';
  topic = '/topic/greetings';
  stompClient?: string | any;
  greeting?: string | any;
  constructor() {}
  connect(): void {
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect(
      {},
      (): any => {
        this.stompClient.subscribe(this.topic, (sdkEvent: any): any => {
          this.onMessageReceived(sdkEvent);
        });
        //_this.stompClient.reconnect_delay = 2000;
      },
      this.errorCallBack
    );
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(): void {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }
  onMessageReceived(message: any): void {
    JSON.stringify(message.body);
  }
  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  send(message: any): void {
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }
}
