import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnggotaComponent } from './modal-anggota.component';

describe('ModalAnggotaComponent', () => {
  let component: ModalAnggotaComponent;
  let fixture: ComponentFixture<ModalAnggotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAnggotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAnggotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
