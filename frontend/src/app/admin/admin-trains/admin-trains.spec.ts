import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrains } from './admin-trains';

describe('AdminTrains', () => {
  let component: AdminTrains;
  let fixture: ComponentFixture<AdminTrains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrains],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTrains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
