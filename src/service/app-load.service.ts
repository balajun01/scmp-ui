import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthenticateService } from 'src/service/authenticate.service';
@Injectable({
  providedIn: 'root'
})
export class AppLoadService {

  constructor(private authService: AuthenticateService) { }

  
  initializeApp() {
   
   // All app initialization requests after SSO Authentication
    if (localStorage.getItem('har_composer_sso_token')) {
      console.log('inside if  initapp');
        this.setAuthDetails();
    } else {
      console.log('inside if else  initapp');
        // Before sso or Just after SSO (with token in URL)
        const afterHash = location.hash.replace('#', '');
        const tokenArr = afterHash.split('&');
        const token_type = (tokenArr[0] || '').split('=')[1];
        const access_token = (tokenArr[1] || '').split('=')[1];
        const id_token = (tokenArr[2] || '').split('=')[1];
        const expires_in = (tokenArr[3] || '').split('=')[1];
        if (!(token_type && access_token)
            && !localStorage.getItem('har_composer_sso_token')) {
            location.href = this.constructUaaRedirect(environment.ssoURL,
                environment.clientID, location.href);
            // environment.ssoRedirectURL);
            return;
        }
        if ((token_type && access_token) && !localStorage.getItem('har_composer_sso_token')) {
            // To DO: set expiration
            localStorage.setItem('har_composer_sso_token', JSON.stringify({
                token_type,
                access_token,
                id_token
            }));
            this.setAuthDetails();
        }
    }
  }
  private constructUaaRedirect(ssoServiceUrl, clientId, thisUrl): string {
    
     var   url = ssoServiceUrl + '/oauth/authorize?client_id=' +
     clientId + '&response_type=token+id_token&redirect_uri='
     + thisUrl + '#uaaLocation=' + ssoServiceUrl;
    return ssoServiceUrl + '/oauth/authorize?client_id=' +
        clientId + '&response_type=token+id_token&redirect_uri='
        + thisUrl + '#uaaLocation=' + ssoServiceUrl;
  }
  private setAuthDetails() {

    const ssoToken = JSON.parse(localStorage.getItem('har_composer_sso_token'));
    if (ssoToken && ssoToken.access_token) {
        const at = ssoToken.access_token;
        // console.log("**User Details Set**");
        //console.log(this.parseJwt(at));
        
        this.authService.setUserDetails(this.parseJwt(at));
    }
  }
  
  private parseJwt(token) {
    const base64Url = token.split('.')[1];

    // console.log("base64Url",base64Url)    
    // const base64 = base64Url.replace('-', '+').replace('_', '/');
    // console.log("base64",base64)
    // console.log("Decoded",JSON.parse(atob(base64Url)))

    return JSON.parse(atob(base64Url));
  }

}

export function init_app(appLoadService: AppLoadService) {
  // console.log("init_app");
  return () => appLoadService.initializeApp();
}