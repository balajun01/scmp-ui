import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SetTargetLandingComponent} from './set-target/set-target-landing/set-target-landing.component';
import { AllocateCommoditiesComponent } from './set-target/allocate-commodities/allocate-commodities.component';
import { SimulationManagerComponent } from './simulation-manager/simulation-manager.component';

const routes: Routes = [
  { path: '', component: SetTargetLandingComponent, pathMatch: 'full'},
  { path: 'simulation-manager', component: SimulationManagerComponent, pathMatch: 'full'},
  { path: 'commodities', component: AllocateCommoditiesComponent, pathMatch: 'prefix' },
  { path: 'settarget', component: SetTargetLandingComponent, pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
