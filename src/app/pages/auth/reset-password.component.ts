import { Component, OnInit , inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordResetService } from '../../../service/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  private fb = inject(FormBuilder);

  form = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', Validators.required]
  });

  token = '';          // lido da URL: /redefinir-senha?token=abc123
  mensagem = '';
  erro = '';
  carregando = false;
  sucesso = false;     // controla redirecionamento após sucesso

  constructor(
    private route: ActivatedRoute, // lê parâmetros da URL
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {
    // Lê o token do query param da URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Se não tiver token na URL, mostra erro imediatamente
    if (!this.token) {
      this.erro = 'Link inválido ou expirado. Solicite um novo link de recuperação.';
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.token) return;

    const { novaSenha, confirmarSenha } = this.form.value;

    // Validação: as duas senhas precisam ser iguais
    if (novaSenha !== confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.passwordResetService.confirmarReset(this.token, novaSenha!).subscribe({
      next: (resposta) => {
        this.mensagem = resposta;
        this.carregando = false;
        this.sucesso = true;
        // Redireciona para login após 3 segundos
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.erro = err.error || 'Erro ao redefinir senha. O link pode ter expirado.';
        this.carregando = false;
      }
    });
  }
}