package com.synthetic.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EntityScan(basePackages = "com.synthetic.platform.model")
@EnableJpaRepositories(basePackages = "com.synthetic.platform.repository")
public class SyntheticDataPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(SyntheticDataPlatformApplication.class, args);
	}

}
