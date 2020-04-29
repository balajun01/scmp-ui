import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationManagerComponent } from './simulation-manager.component';

describe('SimulationManagerComponent', () => {
  let component: SimulationManagerComponent;
  let fixture: ComponentFixture<SimulationManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
