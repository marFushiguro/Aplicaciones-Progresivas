import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserPage } from '../../app/create-user/create-user.page';

describe('CreaterUserPage', () => {
  let component: CreateUserPage;
  let fixture: ComponentFixture<CreateUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
