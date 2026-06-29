// service/EmailService.java

package com.primelar.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmailResetSenha(String destinatario, String token) {
        String link = frontendUrl + "/redefinir-senha?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject("PrimeLar — Redefinição de senha");
        mensagem.setText(
            "Olá!\n\n" +
            "Recebemos uma solicitação para redefinir sua senha.\n" +
            "Clique no link abaixo (válido por 30 minutos):\n\n" +
            link + "\n\n" +
            "Se você não solicitou isso, ignore este e-mail.\n\n" +
            "Equipe PrimeLar"
        );

        mailSender.send(mensagem);
    }
}
