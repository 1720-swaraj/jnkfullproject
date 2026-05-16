package com.example.JanlokPom.repository;

import com.example.JanlokPom.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findBySection_SectionId(Long id);
}