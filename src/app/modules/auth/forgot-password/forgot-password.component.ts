import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.value.email;
      console.log('Enviar enlace de recuperación a:', email);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
