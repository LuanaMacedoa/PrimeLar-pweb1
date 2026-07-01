import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PasswordResetService } from '../../../service/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly passwordResetService = inject(PasswordResetService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  mensagem = '';
  erro = '';
  carregando = false;
  enviado = false;

  get emailInvalido(): boolean {
    const email = this.form.controls.email;
    return email.invalid && email.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    const email = this.form.controls.email.value;

    this.passwordResetService.solicitarReset(email).subscribe({
      next: (resposta: string) => {
        this.mensagem =
          resposta || 'Se o e-mail estiver cadastrado, você receberá um link em breve.';

        this.carregando = false;
        this.enviado = true;
      },
      error: () => {
        this.mensagem =
          'Se o e-mail estiver cadastrado, você receberá um link em breve.';

        this.carregando = false;
        this.enviado = true;
      },
    });
  }
}