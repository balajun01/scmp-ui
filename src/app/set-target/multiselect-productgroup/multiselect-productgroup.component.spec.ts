import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectProductgroupComponent } from './multiselect-productgroup.component';

describe('MultiselectProductgroupComponent', () => {
  let component: MultiselectProductgroupComponent;
  let fixture: ComponentFixture<MultiselectProductgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectProductgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectProductgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
