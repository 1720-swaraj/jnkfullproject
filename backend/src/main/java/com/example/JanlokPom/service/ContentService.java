package com.example.JanlokPom.service;

import com.example.JanlokPom.entity.Content;
import com.example.JanlokPom.entity.Section;
import com.example.JanlokPom.entity.dto.ContentDTO;
import com.example.JanlokPom.repository.ContentRepository;
import com.example.JanlokPom.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    @Autowired
    private ContentRepository repo;

    @Autowired
    private SectionRepository sectionRepo;

    // ✅ ADD CONTENT
    public Content addContent(Content content, Long sectionId) {

        Section section = sectionRepo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        content.setSection(section);

        return repo.save(content);
    }

    // ✅ GET ALL CONTENT (DTO)
    public List<ContentDTO> getAll() {
        return repo.findAll()
                .stream()
                .map(ContentDTO::new)
                .toList();
    }

    // ✅ GET BY ID (VERY IMPORTANT FOR UPDATE)
    public Content getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));
    }

    // ✅ UPDATE CONTENT
    public Content update(Content content, Long sectionId) {

        Section section = sectionRepo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        content.setSection(section);

        return repo.save(content);
    }

    // ✅ DELETE CONTENT
    public void delete(Long id) {
        repo.deleteById(id);
    }
    public List<Content> getBySectionId(Long id) {
        return repo.findBySection_SectionId(id);
    }
}