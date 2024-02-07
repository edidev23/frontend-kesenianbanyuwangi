import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCheckKartuComponent } from './modal-check-kartu.component';

describe('ModalCheckKartuComponent', () => {
  let component: ModalCheckKartuComponent;
  let fixture: ComponentFixture<ModalCheckKartuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCheckKartuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCheckKartuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
