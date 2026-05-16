package com.example.JanlokPom.Controller;

import com.example.JanlokPom.entity.DownloadEntity;
import com.example.JanlokPom.service.DownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/download")
@CrossOrigin("*")
public class DownloadController {

    @Autowired
    private DownloadService service;

    // ADD
    @PostMapping(
            value = "/add",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public DownloadEntity upload(

            @RequestParam String downloadFileName,
                @RequestParam String downloadDescription,

            @RequestParam("files")
            MultipartFile[] files

    ) throws IOException {

        return service.uploadFiles(
                downloadFileName,
                downloadDescription,
                files
        );
    }

    // GET ALL
    @GetMapping("/all")
    public List<DownloadEntity> getAll() {
        return service.getAll();
    }

    // UPDATE
    @PutMapping(
            value = "/update/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public DownloadEntity update(

            @PathVariable Long id,

            @RequestParam String downloadFileName,

            @RequestParam String downloadDescription,

            @RequestParam(value = "files", required = false)
            MultipartFile[] files

    ) throws IOException {

        return service.updateDownload(
                id,
                downloadFileName,
                downloadDescription,
                files
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        service.deleteDownload(id);

        return "Deleted Successfully";
    }
}