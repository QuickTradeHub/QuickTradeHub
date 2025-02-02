package com.quicktradehub.auth.dto;

import com.quicktradehub.auth.entity.Address;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {

    private int addressId;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private boolean isPrimary;
    private int userId; // assuming you want to include userId in the DTO to track the user
    
    public AddressDto(Address address) {
    	this.addressId=address.getAddressId();
    	this.street=address.getStreet();
    	this.city=address.getCity();
    	this.state=address.getState();
    	this.country=address.getCountry();
    	this.isPrimary=address.isPrimary();
    	this.userId=address.getUser().getUserId();
    	
    }
    
}
