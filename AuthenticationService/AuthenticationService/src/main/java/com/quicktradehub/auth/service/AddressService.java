package com.quicktradehub.auth.service;

import com.quicktradehub.auth.dto.AddressDto;
import java.util.List;
import java.util.Optional;

public interface AddressService {

    // Add a new address for a user
    AddressDto addAddress(int userId, AddressDto addressDto);

    // Get all addresses for a specific user
    List<AddressDto> getUserAddresses(int userId);

    // Get a specific address by ID
    Optional<AddressDto> getAddressById(int addressId);

    // Update an existing address
    AddressDto updateAddress(int addressId, AddressDto addressDto);

    // Delete an address by ID
    boolean deleteAddress(int addressId);
    
    //Mark particular address as primary
    public void markPrimaryAddress(int userId, int addressId);
    
    //Get all addresses of a user
    public List<AddressDto> getAllAddressesForUser(int userId);
}
