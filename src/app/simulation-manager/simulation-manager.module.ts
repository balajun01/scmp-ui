import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationManagerComponent } from './simulation-manager.component';



@NgModule({
  declarations: [SimulationManagerComponent],
  imports: [
    CommonModule
  ],
  exports : [SimulationManagerComponent]
})
export class SimulationManagerModule { }
