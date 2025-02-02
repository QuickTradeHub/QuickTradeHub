package com.quicktradehub.auth.exception;

public class ResourceNotFoundException extends RuntimeException {

    // Constructor accepting a custom message
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Constructor accepting a custom message and cause
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
