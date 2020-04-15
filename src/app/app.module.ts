import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SetTargetLandingComponent } from './set-target/set-target-landing/set-target-landing.component';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticateService } from 'src/service/authenticate.service';
import { AppLoadService } from 'src/service/app-load.service';
import { MultiselectDropdownComponent } from './set-target/multiselect-dropdown/multiselect-dropdown.component';
import { NumericDirective } from './set-target/product-group-frame/numeric.directive';
import { SearchFilterPipe } from 'src/pipe/search-filter.pipe';
import { MultiselectProductgroupComponent } from './set-target/multiselect-productgroup/multiselect-productgroup.component';
import { ProductGroupViewFrameComponent } from './set-target/product-group-frame/product-group-view-frame/product-group-view-frame.component';
import { ProductGroupEditFrameComponent } from './set-target/product-group-frame/product-group-edit-frame/product-group-edit-frame.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllocateCommoditiesComponent } from './set-target/allocate-commodities/allocate-commodities.component';
import {MatDividerModule} from '@angular/material/divider';
import { AdobeAnalyticsService } from 'src/service/adobe-analytics.service';
import { AllocateCommodityViewFrameComponent } from './set-target/allocate-commodities/allocate-commodity-view-frame/allocate-commodity-view-frame.component';
import { AllocationPipe } from './set-target/allocate-commodities/allocation.pipe';

@NgModule({

  declarations: [
    AppComponent,
    HeaderComponent,
    SetTargetLandingComponent,
    MultiselectDropdownComponent,
    NumericDirective,
    SearchFilterPipe,
    MultiselectProductgroupComponent,
    ProductGroupViewFrameComponent,
    ProductGroupEditFrameComponent,
    AllocateCommodityViewFrameComponent,
    AllocateCommoditiesComponent,
    AllocationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClarityModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDividerModule
  ],
  providers: [
    AuthenticateService, AppLoadService, AdobeAnalyticsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
