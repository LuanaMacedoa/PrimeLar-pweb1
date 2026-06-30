package com.primelar.backend.config;

import java.util.Arrays;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public static BeanFactoryPostProcessor entityManagerFlywayDependency() {
        return beanFactory -> {
            ConfigurableListableBeanFactory clbf = (ConfigurableListableBeanFactory) beanFactory;
            Arrays.stream(clbf.getBeanDefinitionNames())
                .filter(name -> name.equals("entityManagerFactory"))
                .map(clbf::getBeanDefinition)
                .forEach(bd -> {
                    String[] existing = bd.getDependsOn();
                    String[] updated;
                    if (existing == null) {
                        updated = new String[]{"flyway"};
                    } else {
                        updated = Arrays.copyOf(existing, existing.length + 1);
                        updated[existing.length] = "flyway";
                    }
                    bd.setDependsOn(updated);
                });
        };
    }

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .load();
        flyway.migrate();
        return flyway;
    }
}
