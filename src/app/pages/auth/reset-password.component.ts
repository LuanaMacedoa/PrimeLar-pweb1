import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../../service/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly passwordResetService = inject(PasswordResetService);

  form = this.fb.nonNullable.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  });

  token = '';
  mensagem = '';

  erroToken = '';
  erroFormulario = '';

  carregando = false;
  sucesso = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.erroToken = 'Solicite um novo link de recuperação para redefinir sua senha.';
    }
  }

  get novaSenhaInvalida(): boolean {
    const control = this.form.controls.novaSenha;
    return control.invalid && control.touched;
  }

  get confirmarSenhaInvalida(): boolean {
    const control = this.form.controls.confirmarSenha;
    return control.invalid && control.touched;
  }

  onSubmit(): void {
    this.erroFormulario = '';

    if (!this.token) {
      this.erroToken = 'Solicite um novo link de recuperação para redefinir sua senha.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const novaSenha = this.form.controls.novaSenha.value;
    const confirmarSenha = this.form.controls.confirmarSenha.value;

    if (novaSenha !== confirmarSenha) {
      this.erroFormulario = 'As senhas não coincidem.';
      return;
    }

    this.carregando = true;

    this.passwordResetService.confirmarReset(this.token, novaSenha).subscribe({
      next: (resposta: string) => {
        this.mensagem = resposta || 'Sua senha foi redefinida com sucesso.';
        this.carregando = false;
        this.sucesso = true;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.erroFormulario =
          err?.error || 'Erro ao redefinir senha. O link pode ter expirado.';

        this.carregando = false;
      },
    });
  }
}