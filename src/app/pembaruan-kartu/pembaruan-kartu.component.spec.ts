import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PembaruanKartuComponent } from './pembaruan-kartu.component';

describe('PembaruanKartuComponent', () => {
  let component: PembaruanKartuComponent;
  let fixture: ComponentFixture<PembaruanKartuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PembaruanKartuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PembaruanKartuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
