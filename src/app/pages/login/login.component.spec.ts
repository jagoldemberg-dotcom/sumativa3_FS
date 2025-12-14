// src/app/pages/login/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería crear el formulario con email y password', () => {
    const form = component.loginForm;
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('password')).toBeTrue();
  });

  it('debería ser inválido cuando los campos están vacíos', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería ser válido con email y password correctos', () => {
    component.loginForm.get('email')?.setValue('usuario@ejemplo.cl');
    component.loginForm.get('password')?.setValue('Abc123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería marcar el formulario como enviado cuando se hace submit inválido', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    component.onSubmit();

    expect(component.enviado).toBeTrue();
    expect(component.loginForm.invalid).toBeTrue();
  });
});
