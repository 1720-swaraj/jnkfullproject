package com.example.JanlokPom.repository;

import com.example.JanlokPom.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    boolean existsBySectionName(String sectionName);
}