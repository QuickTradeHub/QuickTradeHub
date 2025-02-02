package com.quicktradehub.auth.repository;

import com.quicktradehub.auth.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    // Find addresses by user ID
    List<Address> findByUserUserId(Integer userId);

    // Find address by city
    List<Address> findByCity(String city);

    // Check if a user has a specific address
    boolean existsByStreetAndCityAndStateAndZipCode(String street, String city, String state, String zipCode);
}
