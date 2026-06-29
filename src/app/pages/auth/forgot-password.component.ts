import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordResetService } from '../../../service/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  

  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  mensagem = '';     
  erro = '';          
  carregando = false; 
  enviado = false;    

  constructor(
    private passwordResetService: PasswordResetService
  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    const email = this.form.value.email!;

    this.passwordResetService.solicitarReset(email).subscribe({
      next: (resposta: string) => {
        this.mensagem = resposta;
        this.carregando = false;
        this.enviado = true; // esconde o form e mostra mensagem
      },
      error: () => {
        // Mesmo em erro, mostra mensagem genérica por segurança
        this.mensagem = 'Se o e-mail estiver cadastrado, você receberá um link em breve.';
        this.carregando = false;
        this.enviado = true;
      }
    });
  }
}