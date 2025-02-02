package com.quicktradehub.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		.requestMatchers("/auth/**", "/auth/user/*/address").permitAll() // Allow public paths
																									// without
																									// authentication
				.anyRequest().authenticated() // Secure other paths
				.and().formLogin().disable() // Disable the default login page
				.httpBasic().disable().csrf().disable(); // Optionally disable HTTP basic authentication

		return http.build();
	}
}
