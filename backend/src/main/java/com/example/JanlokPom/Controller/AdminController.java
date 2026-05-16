
package com.example.JanlokPom.Controller;

import com.example.JanlokPom.entity.Admin;
import com.example.JanlokPom.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService service;

    // ✅ REGISTER WITH IMAGE
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(
            @RequestParam String adminName,
            @RequestParam String adminPhoneNo,
            @RequestParam String adminAddress,
            @RequestParam String adminEmail,
            @RequestParam String adminPassword,
            @RequestParam MultipartFile image
    ) {
        return service.registerAdmin(
                adminName,
                adminPhoneNo,
                adminAddress,
                adminEmail,
                adminPassword,
                image
        );
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
            @RequestParam String adminEmail,
            @RequestParam String adminPassword
    ) {
        return service.loginAdmin(adminEmail, adminPassword);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateAdmin(
            @RequestParam Long adminId,
            @RequestParam String adminName,
            @RequestParam String adminEmail,
            @RequestParam String adminPhoneNo,
            @RequestParam String adminAddress,

            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "removeImage", required = false) Boolean removeImage
    ) throws IOException {

        Admin updated = service.updateAdmin(
                adminId, adminName, adminEmail,
                adminPhoneNo, adminAddress,
                image, removeImage
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Updated successfully",
                        "admin", updated
                )
        );
    }
}