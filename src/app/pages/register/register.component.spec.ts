import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el formulario con todos los controles necesarios', () => {
    const form = component.registerForm;

    expect(form.contains('nombre')).toBeTrue();
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('edad')).toBeTrue();
    expect(form.contains('password')).toBeTrue();
    expect(form.contains('password2')).toBeTrue();
    expect(form.contains('direccion')).toBeTrue();
  });

  it('debería marcar correo como inválido si el formato no es correcto', () => {
    const control = component.registerForm.get('email');
    control?.setValue('correo-invalido');
    expect(control?.valid).toBeFalse();
  });

  it('debería marcar error cuando las contraseñas no coinciden', () => {
    const form = component.registerForm;
    form.get('password')?.setValue('Abc123');
    form.get('password2')?.setValue('Abc124');

    form.updateValueAndValidity();

    expect(form.hasError('passwordsNoCoinciden')).toBeTrue();
  });
});
