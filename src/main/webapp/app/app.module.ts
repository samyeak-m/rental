import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { RentalUiSharedModule } from 'app/shared/shared.module';
import { RentalUiCoreModule } from 'app/core/core.module';
import { RentalUiAppRoutingModule } from './app-routing.module';
import { RentalUiHomeModule } from './home/home.module';
import { RentalUiEntityModule } from './entities/entity.module';

// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { SideNavbarComponent } from 'app/layouts/sidenavbar/sidenavbar.component';

@NgModule({
  imports: [
    BrowserModule,
    RentalUiSharedModule,
    RentalUiCoreModule,
    RentalUiHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    RentalUiEntityModule,
    RentalUiAppRoutingModule,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    SideNavbarComponent,
  ],
  bootstrap: [MainComponent],
})
export class RentalUiAppModule {}
