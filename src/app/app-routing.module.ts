import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SetTargetLandingComponent} from './set-target/set-target-landing/set-target-landing.component';
import { AllocateCommoditiesComponent } from './set-target/allocate-commodities/allocate-commodities.component'
const routes: Routes = [
  { path: '', component: SetTargetLandingComponent, pathMatch: 'full' },
  { path: 'commodities', component: AllocateCommoditiesComponent,pathMatch: 'prefix'   },
 { path: 'settarget', component: SetTargetLandingComponent,pathMatch: 'prefix'   }
// { path: 'otherBrowser', component: RedirectionPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
