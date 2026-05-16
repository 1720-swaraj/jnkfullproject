package com.example.JanlokPom.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class ImageService {

    private final String uploadDir = System.getProperty("user.dir") + "/images";

    // Create folder automatically
    public ImageService() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
            System.out.println("Images folder created at: " + uploadDir);
        }
    }

    public String saveImage(MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty!");
        }

        // Get original file name
        String originalFilename = file.getOriginalFilename();

        // Get file extension
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

        // Create unique file name using timestamp
        String fileName = System.currentTimeMillis() + extension;

        // Save file path
        String filePath = uploadDir + "/" + fileName;

        // Save file
        File dest = new File(filePath);
        file.transferTo(dest);

        return fileName;
    }
    public void deleteImage(String fileName) {
        try {
            File file = new File("uploads/" + fileName);
            if (file.exists()) {
                file.delete();
            }
        } catch (Exception e) {
            System.out.println("Image delete failed: " + e.getMessage());
        }
    }
}