import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager, JhiLanguageService, JhiParseLinks } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/core/language/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { NotificationService } from 'app/entities/notification/notification.service';
import { INotification, Notifications } from 'app/shared/model/notification.model';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  swaggerEnabled?: boolean;
  countNotification = 0;
  version: string;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  eventSubscriber?: Subscription;
  ascending: boolean;
  webSocketEndPoint = 'http://45.115.217.68:8083/ws';
  topic = '/topic/greetings';
  stompClient?: string | any;
  notification: INotification | any = new Notifications();
  notifications?: INotification[] | any;
  notificationList?: INotification[];
  constructor(
    private loginService: LoginService,
    protected eventManager: JhiEventManager,
    private languageService: JhiLanguageService,
    public sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private router: Router,
    protected parseLinks: JhiParseLinks
  ) {
    this.notifications = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
    if (this.sessionStorage.retrieve('connect')) {
      this.connect();
      this.loadAll();
      this.registerChangeInNotifications();
      this.notificationService.findAll().subscribe(res => {
        this.notificationList = res.body || [];
      });
    }
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  registerChangeInNotifications(): void {
    this.eventSubscriber = this.eventManager.subscribe('notificationListModification', () => this.reset());
  }

  reset(): void {
    this.page = 0;
    this.notifications = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
    this.notificationChange();
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  loadAll(): void {
    this.notificationService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<INotification[]>) => this.paginateNotifications(res.body, res.headers));
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  login(): void {
    this.loginModalService.open();
  }

  notificationChange(): void {
    this.notificationList?.forEach((notification: any) => {
      if (!notification.readStatus) {
        this.notification = notification;
        this.notification.readStatus = true;
        this.notificationService.update(this.notification).subscribe(resp => {});
      }
    });
  }

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
    this.notifications = JSON.parse(message.body) as INotification[];
    let count = 0;
    this.notifications.forEach((notification: { readStatus: any }) => {
      if (!notification.readStatus) {
        count = count + 1;
      }
    });
    this.countNotification = count;
  }

  /*
   * Send message to sever via web socket
   * @param {*} m
   * essage
   */
  send(message: any): void {
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }
  trackId(index: number, item: INotification): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  logout(): void {
    this.collapseNavbar();
    this.disconnect();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : '';
  }

  protected paginateNotifications(data: INotification[] | any, headers: HttpHeaders): void {
    let headersLink: string | any;
    if (data?.length > 0) {
      headersLink = data[0].link;
    }
    if (headersLink !== undefined && data) {
      this.links = this.parseLinks.parse(headersLink ? headersLink : '');
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.notifications.push(data[i]);
        }
      }
    }
  }
}
