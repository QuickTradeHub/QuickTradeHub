package com.quicktradehub.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication()
@EnableDiscoveryClient
public class AuthenticationService1Application {

	public static void main(String[] args) {
		SpringApplication.run(AuthenticationService1Application.class, args);
	}
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder1() {
		return new BCryptPasswordEncoder();
	}

}
