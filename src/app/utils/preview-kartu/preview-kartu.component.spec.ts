import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewKartuComponent } from './preview-kartu.component';

describe('PreviewKartuComponent', () => {
  let component: PreviewKartuComponent;
  let fixture: ComponentFixture<PreviewKartuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewKartuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewKartuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
