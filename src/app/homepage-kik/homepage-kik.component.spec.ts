import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageKikComponent } from './homepage-kik.component';

describe('HomepageKikComponent', () => {
  let component: HomepageKikComponent;
  let fixture: ComponentFixture<HomepageKikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageKikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageKikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
