import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTetrisComponent } from './panel-tetris.component';

describe('PanelTetrisComponent', () => {
  let component: PanelTetrisComponent;
  let fixture: ComponentFixture<PanelTetrisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelTetrisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelTetrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
