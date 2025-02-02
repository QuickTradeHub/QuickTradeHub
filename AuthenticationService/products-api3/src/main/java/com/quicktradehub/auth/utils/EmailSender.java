package com.quicktradehub.auth.utils;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSender {

    private final JavaMailSender javaMailSender;

    public EmailSender(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    // Send an email
    public void sendEmail(String to, String subject, String body)  {
        

        try {
        	MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);  // HTML format email body
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            // You can log the error or throw an exception if needed
        }
    }

    // Send email with a reset password link
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Password Reset Request";
        String body = "<p>Click the link below to reset your password:</p>" +
                      "<a href='" + resetLink + "'>Reset Password</a>";
        sendEmail(to, subject, body);
    }

    // You can add more specialized methods for different types of emails here.
}
