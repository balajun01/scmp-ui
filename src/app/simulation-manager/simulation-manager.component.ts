import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulation-manager',
  templateUrl: './simulation-manager.component.html',
  styleUrls: ['./simulation-manager.component.css']
})

export class SimulationManagerComponent implements OnInit {

  systemDate: string;
  showIndex:number|null = null;
  childIndex:number|null = null;


  constructor(private router: Router) { }

  ngOnInit() {
    this.systemDate = JSON.stringify(new Date()).slice(1, 11);
  }

  navigateToSetTargets() {
    this.router.navigate(['']);
  }
  showTargetDetails(i: number) {
    this.showIndex = (this.showIndex ==i)? null: i;
  }
  
  showCommodityDetails(j: number) {
    this.childIndex = (this.childIndex ==j)? null: j;
  }


}
