package com.primelar.backend.config.logging;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {

    @Bean
    public FilterRegistrationBean<CorrelationIdFilter> correlationIdFilterRegistration(
        CorrelationIdFilter filter
    ) {
        FilterRegistrationBean<CorrelationIdFilter> registrationBean =
            new FilterRegistrationBean<>(filter);

        // RODA ANTES DE TODOS OS FILTROS para garantir que o correlationId esteja disponível desde o início
        registrationBean.setOrder(1);

        // Aplica em todas as rotas
        registrationBean.addUrlPatterns("/*");

        return registrationBean;
    }
}

