import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInventarisComponent } from './modal-inventaris.component';

describe('ModalInventarisComponent', () => {
  let component: ModalInventarisComponent;
  let fixture: ComponentFixture<ModalInventarisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInventarisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInventarisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
