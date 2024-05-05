import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/core/language/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { WebSocketAPI } from 'app/home/WebSocketAPI';
import { NotificationService } from 'app/entities/notification/notification.service';
import { INotification } from 'app/shared/model/notification.model';

@Component({
  selector: 'jhi-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['sidenavbar.scss'],
})
export class SideNavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  swaggerEnabled?: boolean;
  version: string;
  notifications?: INotification[];
  countNotification?: number;
  name?: string | any;

  constructor(
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private webSocketApi: WebSocketAPI,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
    this.name = this.getName();
    if (this.isAuthenticated()) {
      this.sessionStorage.store('isAuthenticated', this.isAuthenticated());
      this.webSocketApi.connect();
      this.sessionStorage.store('connect', 'isConnected');
      this.notificationService.query().subscribe(res => {
        this.notifications = res.body || [];
        this.sessionStorage.store('notifications', this.notifications);
        let count = 0;
        this.notifications.forEach(notification => {
          if (!notification.readStatus) {
            count = count + 1;
          }
        });
        this.countNotification = count;
        this.sessionStorage.store('count', this.countNotification);
      });
    }
    if (localStorage.getItem('reloaded')) {
      // The page was just reloaded. Clear the value from local storage
      // so that it will reload the next time this page is visited.
      localStorage.removeItem('reloaded');
    } else {
      // Set a flag so that we know not to reload the page twice.
      localStorage.setItem('reloaded', '1');
      window.location.reload();
    }
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  logout(): void {
    this.collapseNavbar();
    this.webSocketApi.disconnect();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : '';
  }

  getName(): any {
    return this.isAuthenticated() ? this.accountService.getName() : null;
  }
}
