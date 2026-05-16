package com.example.JanlokPom.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionId;

    @Column(unique = true)
    private String sectionName;

    private LocalDateTime createdOn;

    @PrePersist
    public void onCreate() {
        this.createdOn = LocalDateTime.now();
    }

    // getters setters

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public Section(Long sectionId, String sectionName, LocalDateTime createdOn) {
        this.sectionId = sectionId;
        this.sectionName = sectionName;
        this.createdOn = createdOn;
    }

    public Section() {
    }
}