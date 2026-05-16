package com.example.JanlokPom.Controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/downloads")
@CrossOrigin("*")
public class FileAccessController {

    private final String uploadDir =
            System.getProperty("user.dir")
                    + "/uploads/downloads/";

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<?> getFile(
            @PathVariable String fileName
    ) {

        try {

            File file =
                    new File(uploadDir + fileName);

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .body(new FileSystemResource(file));

        } catch (Exception e) {

            return ResponseEntity
                    .status(500)
                    .body(e.getMessage());
        }
    }
}