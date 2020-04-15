import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { SetTargetLandingComponent } from './set-target-landing.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SetTargetService } from 'src/app/set-target/set-target-landing/set-target.service';
import { of } from 'rxjs';


let stubData = {
  dataList : {
    "calDate": "2012-02-09",
    "cpMonth": [
        {
            "cpMonthId": 720120303,
            "cpMonth": "MARCH"
        },
        {
            "cpMonthId": 720120331,
            "cpMonth": "APRIL"
        },
        {
            "cpMonthId": 720120505,
            "cpMonth": "MAY"
        },
        {
            "cpMonthId": 720120602,
            "cpMonth": "JUNE"
        }
    ],
    "releaseQuarter": [
        {
            "releaseQuarterId": 820120204,
            "releaseQuarter": "FY21Q1"
        },
        {
            "releaseQuarterId": 820120505,
            "releaseQuarter": "FY21Q2"
        }
    ],
    "targetMethod": [
      {
        "targetMethodId": 1,
        "targetMethod": "$M Impact"
    },
    {
        "targetMethodId": 3,
        "targetMethod": "Cost-per-box"
    },
    {
        "targetMethodId": 2,
        "targetMethod": "Brick %"
    }
    ]
}
}



let fetchCPMonthList;
 let  fetchcaldate1;
 let fetchreleasetqtrList;
let fetchtargetmthdList;

const setTargetService = jasmine.createSpyObj('SetTargetService', ['getCPMonthQuarterTargetList']);
//fetchcaldate= setTargetService.getCPMonthQuarterTargetList

fetchcaldate1 =  setTargetService.getCPMonthQuarterTargetList.and.returnValue(of(stubData.dataList.calDate));
fetchCPMonthList =  setTargetService.getCPMonthQuarterTargetList.and.returnValue(of(stubData.dataList.cpMonth));
fetchreleasetqtrList =  setTargetService.getCPMonthQuarterTargetList.and.returnValue(of(stubData.dataList.releaseQuarter));
fetchtargetmthdList =  setTargetService.getCPMonthQuarterTargetList.and.returnValue(of(stubData.dataList.targetMethod));
console.log("this is from test " + fetchcaldate1.calls.calDate);

describe('SetTargetLandingComponent', () => {
  let component: SetTargetLandingComponent;
  let fixture: ComponentFixture<SetTargetLandingComponent>;

 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ SetTargetLandingComponent ],
      imports: [ClarityModule, FormsModule, NgMultiSelectDropDownModule],
      providers: [ FormBuilder,
       {provide: SetTargetService, useValue: setTargetService }  
         ]
       })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTargetLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   it('cal date  should not be empty', () => {
//     var x =component.caldate;
// expect(fetchcaldate1).toBe(x);

//   //  expect(x).toEqual(fetchcaldate.calls.any;
//   });

  // it('cal date  should not be empty ', () => {
  //   let x =component.caldate;
  //   expect(x).toMatch('2012-02-09');
  // });

  it(' cp month list should have less than 5 months', () => {
    let x =component.cpMonthList.length;
    expect(x).toBeLessThanOrEqual(5);
  });

  it(' cp month list should be equal to 4 months', () => {
    let x =component.cpMonthList.length;
    expect(x).toEqual(4);
  });

  it(' cp month list should have greater than 3 months', () => {
    let x =component.cpMonthList.length;
    expect(x).toBeGreaterThanOrEqual(3);
  });

   it(' date is 13 feb first CP month should be March', () => {
    let x =component.cpMonthList[0];
    expect(x.cpMonth).toEqual("MARCH")
  });

 it(' date is 13 feb second CP month should be APRIL', () => {
    let x =component.cpMonthList[1];
    expect(x.cpMonth).toEqual("APRIL");
  });

  it(' date is 13 feb Third CP month should be MAY', () => {
    let x =component.cpMonthList[2];
    expect(x.cpMonth).toEqual("MAY")
  });

  it(' date is 13 feb first CP month should be JUNE', () => {
    let x =component.cpMonthList[3];
    expect(x.cpMonth).toEqual("JUNE")
  });
 
   it(' first CP month is MARCH 1st RELEASE QUARTER SHOULD BE FY13Q1 ', () => {
    let x =component.quarterList[0];
    expect(x.releaseQuarter).toEqual("FY13Q1")
  }); 

  it(' first CP month is MARCH 2nd RELEASE QUARTER SHOULD BE FY13Q2 ', () => {
    let x =component.quarterList[1];
    expect(x.releaseQuarter).toEqual("FY13Q2")
  }); 

  it(' 1st target Methods is "$M Impact" ', () => {
    let x =component.targetList[0];
    expect(x.targetMethod).toEqual("$M Impact")
  });
 
  it(' 3rd target Methods is Brick % ', () => {
    let x =component.targetList[2];
    expect(x.targetMethod).toEqual("Brick %")
  });

  it(' 2nd target Methods is Cost-per-box ', () => {
    let x =component.targetList[1];
    expect(x.targetMethod).toEqual("Cost-per-box")
  });
   it(' total target methods should be 3 ', () => {
    let x =component.targetList.length;
    expect(x).toEqual(3)
  }); 

  

});
