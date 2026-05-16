package com.example.JanlokPom.service;

import com.example.JanlokPom.entity.Admin;
import com.example.JanlokPom.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repository;

    @Autowired
    private ImageService imageService;



    public ResponseEntity<?> registerAdmin(
            String adminName,
            String adminPhoneNo,
            String adminAddress,
            String adminEmail,
            String adminPassword,
            MultipartFile image
    ) {
        try {

            Optional<Admin> existing = repository.findByAdminEmail(adminEmail);
            if (existing.isPresent()) {
                return ResponseEntity.badRequest().body(
                        java.util.Map.of("message", "Email already exists ❌")
                );
            }

            String fileName = imageService.saveImage(image);

            Admin admin = new Admin();
            admin.setAdminName(adminName);
            admin.setAdminPhoneNo(adminPhoneNo);
            admin.setAdminAddress(adminAddress);
            admin.setAdminEmail(adminEmail);
            admin.setAdminPassword(adminPassword);
            admin.setAdminImage(fileName);

            Admin savedAdmin = repository.save(admin);

            String baseUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .build()
                    .toUriString();

            String imageUrl = baseUrl + "/api/images/" + fileName;

            // ✅ CLEAN JSON RESPONSE
            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message", "Admin Registered Successfully ✅",
                            "admin", savedAdmin,
                            "imageUrl", imageUrl
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    java.util.Map.of("message", "Error: " + e.getMessage())
            );
        }
    }



    public ResponseEntity<?> loginAdmin(String email, String password) {

        Optional<Admin> adminOpt = repository.findByAdminEmail(email);

        if (adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "Invalid Email ❌")
            );
        }

        Admin admin = adminOpt.get();

        if (!admin.getAdminPassword().equals(password)) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "Invalid Password ❌")
            );
        }

        // ✅ RETURN FULL DATA
        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Login Successful ✅",
                        "admin", admin   // 🔥 IMPORTANT
                )
        );
    }
    public Admin updateAdmin(Long id, String name, String email,
                             String phone, String address,
                             MultipartFile image, Boolean removeImage) throws IOException {

        Admin admin = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // ✅ CHECK EMAIL DUPLICATE
        Optional<Admin> existing = repository.findByAdminEmail(email);
        if (existing.isPresent() && !existing.get().getAdminId().equals(id)) {
            throw new RuntimeException("Email already in use!");
        }

        admin.setAdminName(name);
        admin.setAdminEmail(email);
        admin.setAdminPhoneNo(phone);
        admin.setAdminAddress(address);

        // 🔴 CASE 1: REMOVE IMAGE
        if (Boolean.TRUE.equals(removeImage)) {

            if (admin.getAdminImage() != null) {
                imageService.deleteImage(admin.getAdminImage()); // 🔥 create this method
            }

            admin.setAdminImage(null);
        }

        // 🟢 CASE 2: NEW IMAGE UPLOAD
        else if (image != null && !image.isEmpty()) {

            // delete old image
            if (admin.getAdminImage() != null) {
                imageService.deleteImage(admin.getAdminImage());
            }

            String fileName = imageService.saveImage(image);
            admin.setAdminImage(fileName);
        }

        // ⚪ CASE 3: NO CHANGE → do nothing

        return repository.save(admin);
    }
}