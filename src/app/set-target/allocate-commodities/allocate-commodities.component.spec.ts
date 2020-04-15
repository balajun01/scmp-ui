import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateCommoditiesComponent } from './allocate-commodities.component';

describe('AllocateCommoditiesComponent', () => {
  let component: AllocateCommoditiesComponent;
  let fixture: ComponentFixture<AllocateCommoditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateCommoditiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateCommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
