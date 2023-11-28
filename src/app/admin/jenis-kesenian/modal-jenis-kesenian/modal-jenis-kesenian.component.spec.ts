import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalJenisKesenianComponent } from './modal-jenis-kesenian.component';

describe('ModalJenisKesenianComponent', () => {
  let component: ModalJenisKesenianComponent;
  let fixture: ComponentFixture<ModalJenisKesenianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalJenisKesenianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalJenisKesenianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
