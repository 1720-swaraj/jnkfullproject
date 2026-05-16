


package com.example.JanlokPom.service;

import com.example.JanlokPom.entity.User;
import com.example.JanlokPom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir = System.getProperty("user.dir") + "/images/";

    public UserService() {
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
            System.out.println("Images folder created at: " + uploadDir);
        }
    }

    private String validateImage(MultipartFile image) {

        if (image == null || image.isEmpty()) return "Image is required";

        String type = image.getContentType();

        if (!"image/jpeg".equals(type) && !"image/png".equals(type)) {
            return "Only JPG & PNG allowed";
        }

        if (image.getSize() > (2 * 1024 * 1024)) {
            return "Max size 2MB allowed";
        }

        return null;
    }

    private String saveImage(MultipartFile image) throws Exception {

        String originalName = image.getOriginalFilename();
        String extension = originalName.substring(originalName.lastIndexOf("."));

        String fileName = System.currentTimeMillis() + extension;

        File file = new File(uploadDir + fileName);

        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(image.getBytes());
        }

        return fileName;
    }

    public ResponseEntity<?> addUser(
            String fullName,
            String email,
            String mobileNumber,
            LocalDate dateOfBirth,
            String gender,
            String city,
            String address,
            MultipartFile image
    ) {

        try {

            String error = validateImage(image);
            if (error != null) {
                return ResponseEntity.badRequest().body(error);
            }

            String fileName = saveImage(image);

            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setMobileNumber(mobileNumber);
            user.setDateOfBirth(dateOfBirth);
            user.setGender(gender);
            user.setCity(city);
            user.setAddress(address);
            user.setImagePath(fileName);

            User savedUser = userRepository.save(user);

            // ✅ JSON RESPONSE
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User Added Successfully");
            response.put("user", savedUser);
            response.put("imageUrl", "http://localhost:8080/api/images/" + fileName);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> userList = userRepository.findAll();
            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    // DELETE
    public ResponseEntity<?> deleteUser(int id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User Deleted Successfully"));
    }

    // GET SINGLE
    public ResponseEntity<?> getUser(int id) {
        User user = userRepository.findById(id).orElse(null);
        return ResponseEntity.ok(user);
    }

    // UPDATE
    public ResponseEntity<?> updateUser(
            int userId,
            String fullName,
            String email,
            String mobileNumber,
            String gender,
            String city,
            String address,
            MultipartFile image
    ) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User Not Found"));
        }

        user.setFullName(fullName);
        user.setEmail(email);
        user.setMobileNumber(mobileNumber);
        user.setGender(gender);
        user.setCity(city);
        user.setAddress(address);

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = saveImage(image);
                user.setImagePath(fileName);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body(Map.of("message", "Image upload failed"));
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User Updated Successfully"));
    }
}