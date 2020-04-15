import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateCommodityViewFrameComponent } from './allocate-commodity-view-frame.component';

describe('AllocateCommodityViewFrameComponent', () => {
  let component: AllocateCommodityViewFrameComponent;
  let fixture: ComponentFixture<AllocateCommodityViewFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateCommodityViewFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateCommodityViewFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
