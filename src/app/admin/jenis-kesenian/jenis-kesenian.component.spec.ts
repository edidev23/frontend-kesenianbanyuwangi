import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKesenianComponent } from './jenis-kesenian.component';

describe('JenisKesenianComponent', () => {
  let component: JenisKesenianComponent;
  let fixture: ComponentFixture<JenisKesenianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JenisKesenianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKesenianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
