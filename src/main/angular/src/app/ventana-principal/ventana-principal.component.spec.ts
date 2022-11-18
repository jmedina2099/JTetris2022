import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaPrincipalComponent } from './ventana-principal.component';

describe('VentanaPrincipalComponent', () => {
  let component: VentanaPrincipalComponent;
  let fixture: ComponentFixture<VentanaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
