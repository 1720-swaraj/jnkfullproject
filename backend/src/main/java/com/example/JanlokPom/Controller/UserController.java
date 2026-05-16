



package com.example.JanlokPom.Controller;

import com.example.JanlokPom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ ADD USER
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(

            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String mobileNumber,

            // ✅ FIXED FORMAT (VERY IMPORTANT)
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dateOfBirth,

            @RequestParam String gender,
            @RequestParam String city,
            @RequestParam(required = false) String address,
            @RequestParam("image") MultipartFile image
    ) {

        return userService.addUser(
                fullName,
                email,
                mobileNumber,
                dateOfBirth,
                gender,
                city,
                address,
                image
        );
    }

    // ✅ GET ALL USERS
    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ DELETE USER
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }

    // ✅ GET SINGLE USER
    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        return userService.getUser(id);
    }

    // ✅ UPDATE USER
    @PostMapping("/updateUser")
    public ResponseEntity<?> updateUser(
            @RequestParam int userId,
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String mobileNumber,
            @RequestParam String gender,
            @RequestParam String city,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) MultipartFile image
    ) {
        return userService.updateUser(userId, fullName, email, mobileNumber, gender, city, address, image);
    }
}