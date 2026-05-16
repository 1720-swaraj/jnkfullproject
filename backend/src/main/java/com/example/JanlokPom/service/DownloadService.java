package com.example.JanlokPom.service;

import com.example.JanlokPom.entity.DownloadEntity;
import com.example.JanlokPom.repository.DownloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DownloadService {

    @Autowired
    private DownloadRepository repository;

    private final String uploadDir =
            System.getProperty("user.dir") +
                    "/uploads/downloads/";

    // ✅ ADD
    public DownloadEntity uploadFiles(
            String downloadFileName,
            String downloadDescription,
            MultipartFile[] files
    ) throws IOException {

        File folder = new File(uploadDir);

        // AUTO CREATE FOLDER
        if (!folder.exists()) {
            folder.mkdirs();
        }

        List<String> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {

            // MAX 15MB
            if (file.getSize() > 15 * 1024 * 1024) {
                throw new RuntimeException(
                        file.getOriginalFilename()
                                + " exceeds 15MB limit"
                );
            }

            String originalName =
                    file.getOriginalFilename();

            String extension = "";

            if (originalName != null &&
                    originalName.contains(".")) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }

            // TIMEMILLIS + UUID
            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + UUID.randomUUID()
                            + extension;

            File dest =
                    new File(uploadDir + fileName);

            file.transferTo(dest);

            savedFiles.add(fileName);
        }

        DownloadEntity entity =
                new DownloadEntity();

        entity.setDownloadFileName(downloadFileName);

        entity.setDownloadDescription(
                downloadDescription
        );

        // MULTIPLE FILES
        entity.setDownloadDocument(
                String.join(",", savedFiles)
        );

        entity.setCreatedOn(LocalDateTime.now());

        entity.setUpdatedOn(LocalDateTime.now());

        return repository.save(entity);
    }

    // ✅ GET ALL
    public List<DownloadEntity> getAll() {
        return repository.findAll();
    }

    // ✅ UPDATE
    public DownloadEntity updateDownload(
            Long id,
            String downloadFileName,
            String downloadDescription,
            MultipartFile[] files
    ) throws IOException {

        DownloadEntity entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Not Found"));

        entity.setDownloadFileName(downloadFileName);

        entity.setDownloadDescription(
                downloadDescription
        );

        if (files != null &&
                files.length > 0) {

            List<String> savedFiles =
                    new ArrayList<>();

            for (MultipartFile file : files) {

                if (file.getSize()
                        > 15 * 1024 * 1024) {

                    throw new RuntimeException(
                            file.getOriginalFilename()
                                    + " exceeds 15MB limit"
                    );
                }

                String originalName =
                        file.getOriginalFilename();

                String extension = "";

                if (originalName != null &&
                        originalName.contains(".")) {

                    extension =
                            originalName.substring(
                                    originalName.lastIndexOf(".")
                            );
                }

                String fileName =
                        System.currentTimeMillis()
                                + "_"
                                + UUID.randomUUID()
                                + extension;

                File dest =
                        new File(uploadDir + fileName);

                file.transferTo(dest);

                savedFiles.add(fileName);
            }

            entity.setDownloadDocument(
                    String.join(",", savedFiles)
            );
        }

        entity.setUpdatedOn(LocalDateTime.now());

        return repository.save(entity);
    }

    // ✅ DELETE
    public void deleteDownload(Long id) {

        DownloadEntity entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Not Found"));

        if (entity.getDownloadDocument() != null) {

            String[] files =
                    entity.getDownloadDocument()
                            .split(",");

            for (String f : files) {

                File file =
                        new File(uploadDir + f);

                if (file.exists()) {
                    file.delete();
                }
            }
        }

        repository.deleteById(id);
    }
}