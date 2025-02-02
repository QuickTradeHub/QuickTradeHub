package com.quicktradehub.auth.service.impl;

import com.quicktradehub.auth.dto.AddressDto;
import com.quicktradehub.auth.entity.Address;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.repository.AddressRepository;
import com.quicktradehub.auth.repository.UserRepository;
import com.quicktradehub.auth.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    @Autowired
	private final AddressRepository addressRepository;
    
    @Autowired
    private final UserRepository userRepository;

    @Override
    public AddressDto addAddress(int userId, AddressDto addressDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Address address = new Address();
            address.setStreet(addressDto.getStreet());
            address.setCity(addressDto.getCity());
            address.setState(addressDto.getState());
            address.setZipCode(addressDto.getZipCode());
            address.setCountry(addressDto.getCountry());
            address.setPrimary(addressDto.isPrimary());
            address.setUser(user); // Set the user for the address
            Address savedAddress = addressRepository.save(address);
            return mapToDto(savedAddress); // Return the saved AddressDto
        } else {
            throw new RuntimeException("User not found with id " + userId);
        }
    }

    @Override
    public List<AddressDto> getAllAddressesForUser(int userId) {
        List<Address> addresses = addressRepository.findByUserUserId(userId);
        return addresses.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList()); // Convert to AddressDto list
    }

    @Override
    public Optional<AddressDto> getAddressById(int addressId) {
        Optional<Address> addressOptional = addressRepository.findById(addressId);
        return addressOptional.map(this::mapToDto); // Convert to AddressDto if present
    }

    @Override
    public AddressDto updateAddress(int addressId, AddressDto updatedAddressDto) {
        Optional<Address> existingAddressOptional = addressRepository.findById(addressId);
        if (existingAddressOptional.isPresent()) {
            Address existingAddress = existingAddressOptional.get();
            existingAddress.setStreet(updatedAddressDto.getStreet());
            existingAddress.setCity(updatedAddressDto.getCity());
            existingAddress.setState(updatedAddressDto.getState());
            existingAddress.setZipCode(updatedAddressDto.getZipCode());
            existingAddress.setCountry(updatedAddressDto.getCountry());
            existingAddress.setPrimary(updatedAddressDto.isPrimary());
            Address updatedAddress = addressRepository.save(existingAddress); // Save updated address
            return mapToDto(updatedAddress); // Return updated AddressDto
        } else {
            throw new RuntimeException("Address not found with id " + addressId);
        }
    }

    @Override
    public boolean deleteAddress(int addressId) {
        Optional<Address> addressOptional = addressRepository.findById(addressId);
        if (addressOptional.isPresent()) {
            addressRepository.delete(addressOptional.get()); // Delete the address
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void markPrimaryAddress(int userId, int addressId) {
        List<Address> addresses = addressRepository.findByUserUserId(userId);
        for (Address address : addresses) {
            address.setPrimary(address.getAddressId() == addressId); // Mark as primary if the IDs match
            addressRepository.save(address); // Save updated address
        }
    }

    // Helper method to map Address entity to AddressDto
    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .addressId(address.getAddressId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .isPrimary(address.isPrimary())
                .build();
    }

	@Override
	public List<AddressDto> getUserAddresses(int userId) {
		// TODO Auto-generated method stub
		return null;
	}


}
