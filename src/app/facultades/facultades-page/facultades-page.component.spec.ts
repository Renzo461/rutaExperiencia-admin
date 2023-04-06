import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultadesPageComponent } from './facultades-page.component';

describe('FacultadesPageComponent', () => {
  let component: FacultadesPageComponent;
  let fixture: ComponentFixture<FacultadesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultadesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultadesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
