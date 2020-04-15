import { Component } from '@angular/core';
import { AdobeAnalyticsService } from  'src/service/adobe-analytics.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scmp-ui';
  constructor(private _AdobeAnalytics: AdobeAnalyticsService) { } 
}
