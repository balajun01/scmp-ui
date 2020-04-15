import { Injectable } from '@angular/core';
import { Router, RoutesRecognized ,ActivatedRoute} from '@angular/router';
import { Subject } from 'rxjs';
//import { CommonDataService } from '../../core/services/commonDataService';
//import { collabPlanningHttpService } from '../../core/services/collabPlaningHttpService';
//import { landingPageService } from '../../../app/modules/landing-page/services/landingPageService';

import { filter } from 'rxjs/operators';

export interface PageInfo {
  url: string,
  propertyName: string,
  componentName?: string
}

@Injectable()
export class AdobeAnalyticsService {
  private _appName = 'sCMP'; // application name
  private _partialPageName: string = 'us|en|corp|dsc|';
  public customEvents$ = new Subject<PageInfo>();
  public adobeGlobalVars = window['Dell']['Metrics']['sc'];
  public _routerList = ['settarget','simulation_manager','user_settings']; //all the route names, settarget, simulationmgr,usersetting
  private _staticProperties = ['userid', 'userrole', 'applicationname']; 
  private _editableProperties: string[] = ['pagename'];
  private _userId: any = 123456; // fetch from rbac or sso 
  private _role:string= "Admin"; // fetch from rbac
  private firstLoad:number = 0;
  private loggedInUser;
  private userRole;
  private loggedInUserFirstName;
  constructor(private _router: Router, private router: Router) {
    // watcher for ant route change occurs
    this._router.events.pipe(
      filter(e => e instanceof RoutesRecognized)
      ).subscribe((event) => {
        const currentUrl:string=location.href.split('/')[location.href.split('/').length-1]; 
        const url: string = event['urlAfterRedirects']
        const pageInfo: PageInfo = {url: url, propertyName: this._editableProperties[0]}
        if (this._isValidRouting(url)) {
          this.firstLoad++;
          pageInfo.url= url.split('?')[0].replace(/^\/+|\/+$/gm,'').replace('/','-');
          this._setGlobalVariables(pageInfo.propertyName, pageInfo.url);
        }
    });

    // this._userSvc.currentUser.subscribe(data=>{
    //   const currentUrl:string=location.href.split('/')[location.href.split('/').length-1];
    //   if(data.role && data.userName){
    //     this._userId = data["userName"];
    //     this._role = data["role"];        
    //     const pageInfo: PageInfo = {url: currentUrl, propertyName: this._editableProperties[0]}
    //     if (this._isValidRouting(currentUrl)) {
    //       this._setGlobalVariables(pageInfo.propertyName, pageInfo.url);
    //     } 
    //   }
    // })
  }

  //methid to set all the global variables
  private _setGlobalVariables = (propertyName: string, value: any) => {
    this._setAllSatticProperties();
    switch(propertyName) {
      case this._editableProperties[0]: 
        this.adobeGlobalVars[propertyName] = `${this._partialPageName}${value}`;
        break;
      default: 
        this.adobeGlobalVars[propertyName] = value; 
    }
    if (this._isAllGoodToTriggerAdobeAnalytics()) {
      this._triggerPageAdobeAnalyticsWithData(this.adobeGlobalVars[propertyName]);
    }
  }

//triggering the the analytics method
// remove timeout 5000 later -- shiva
  private _triggerPageAdobeAnalyticsWithData = (metrics) => {
    // trigger bootstrap js file method
    setTimeout(function(){
      window['dellmetrics_pagenav'](metrics);
    },5000)
    
  }

// checking the validity of the routing
  private _isValidRouting = (path: string) => {
   return this._routerList.some((item) => {
      return path.includes(item);
    });
  }

  //setting user role and ID to adobeGlobalVars object
  private _setAllSatticProperties = () => {
    this._staticProperties.forEach((propertyName) => {
      switch(propertyName) {
        case this._staticProperties[0]:
          const userId = this._userId; // this._userSvc.getUserDetails() ? this._userSvc.getUserDetails().user_id : undefined; 
          console.log("User ID : "+ userId);
          this.adobeGlobalVars[propertyName] = userId;
          break;
        case this._staticProperties[1]: 
          // const role = this._errorSvc.getRole()
         console.log("User Role : "+ this._role);
          this.adobeGlobalVars[propertyName] = this._role;
          break;
        case this._staticProperties[2]: 
          this.adobeGlobalVars[propertyName] = this._appName;
          break; 
      }
    });
  }
// method to check the values of user ID and role, if not present then call the service and fetch.. this can be done in app-initializer also
  private _isAllGoodToTriggerAdobeAnalytics = () => {
    if(
      this.adobeGlobalVars[this._staticProperties[0]] && this.adobeGlobalVars[this._staticProperties[1]]){
      return true;
    }else{
      const currentUrl:string=location.href.split('/')[location.href.split('/').length-1];
      if(currentUrl=="settarget"){
        return false;
      }
         }
      }
    
    
  

}
