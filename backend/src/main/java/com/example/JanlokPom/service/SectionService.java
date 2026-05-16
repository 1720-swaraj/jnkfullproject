package com.example.JanlokPom.service;

import com.example.JanlokPom.entity.Section;
import com.example.JanlokPom.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {

    @Autowired
    private SectionRepository repo;

    public Section addSection(Section section) {
        if(repo.existsBySectionName(section.getSectionName())) {
            throw new RuntimeException("Section already exists");
        }
        return repo.save(section);
    }

    public List<Section> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // UPDATE SECTION (IMPORTANT PART)
    public Section updateSection(Long id, Section updatedSection) {

        Section existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + id));

        // check duplicate name (optional safety)
        if (!existing.getSectionName().equals(updatedSection.getSectionName())
                && repo.existsBySectionName(updatedSection.getSectionName())) {
            throw new RuntimeException("Section name already exists");
        }

        existing.setSectionName(updatedSection.getSectionName());

        return repo.save(existing);
    }
}