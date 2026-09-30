import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStations } from './admin-stations';

describe('AdminStations', () => {
  let component: AdminStations;
  let fixture: ComponentFixture<AdminStations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStations],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
