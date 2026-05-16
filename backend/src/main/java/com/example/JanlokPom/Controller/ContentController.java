package com.example.JanlokPom.Controller;

import com.example.JanlokPom.entity.Content;
import com.example.JanlokPom.entity.dto.ContentDTO;
import com.example.JanlokPom.service.ContentService;
import com.example.JanlokPom.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;


@RestController
@RequestMapping("/api/content")
@CrossOrigin("*")
public class ContentController {

    @Autowired
    private ContentService service;
    @Autowired
    private ImageService imageService;
    // ADD WITH IMAGE
    @PostMapping("/add")
    public Content add(
            @RequestParam("sectionId") Long sectionId,
            @RequestParam("contentType") String contentType,
            @RequestParam("contentPersonName") String name,
            @RequestParam("contentRole") String role,
            @RequestParam("contentDescription") String desc,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) throws IOException {

        String fileName = null;

        if (file != null && !file.isEmpty()) {
            fileName = imageService.saveImage(file); // ✅ SAME AS USER
        }

        Content c = new Content();
        c.setContentType(contentType);
        c.setContentPersonName(name);
        c.setContentRole(role);
        c.setContentDescription(desc);
        c.setContentPersonImage(fileName);

        return service.addContent(c, sectionId);
    }
    @GetMapping("/all")
    public List<ContentDTO> all() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted";
    }
    @PutMapping("/update")
    public Content update(
            @RequestParam("contentId") Long id,
            @RequestParam("sectionId") Long sectionId,
            @RequestParam("contentType") String type,
            @RequestParam("contentPersonName") String name,
            @RequestParam("contentRole") String role,
            @RequestParam("contentDescription") String desc,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) throws IOException {

        Content c = service.getById(id);

        c.setContentType(type);
        c.setContentPersonName(name);
        c.setContentRole(role);
        c.setContentDescription(desc);

        if (file != null && !file.isEmpty()) {
            String fileName = imageService.saveImage(file); // ✅ SAME
            c.setContentPersonImage(fileName);
        }

        return service.update(c, sectionId);
    }

    // ✅ ADD THIS METHOD
    @GetMapping("/section/{id}")
    public List<Content> getBySection(@PathVariable Long id) {
        return service.getBySectionId(id);
    }
}