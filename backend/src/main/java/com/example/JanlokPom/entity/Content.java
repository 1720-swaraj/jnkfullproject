package com.example.JanlokPom.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contentId;

    private String contentType;
    private String contentPersonName;
    private String contentPersonImage;
    private String contentRole;
    private String contentDescription;

    private LocalDateTime createdOn = LocalDateTime.now();

    // 🔥 MANY CONTENT → ONE SECTION
    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentPersonName() {
        return contentPersonName;
    }

    public void setContentPersonName(String contentPersonName) {
        this.contentPersonName = contentPersonName;
    }

    public String getContentPersonImage() {
        return contentPersonImage;
    }

    public void setContentPersonImage(String contentPersonImage) {
        this.contentPersonImage = contentPersonImage;
    }

    public String getContentRole() {
        return contentRole;
    }

    public void setContentRole(String contentRole) {
        this.contentRole = contentRole;
    }

    public String getContentDescription() {
        return contentDescription;
    }

    public void setContentDescription(String contentDescription) {
        this.contentDescription = contentDescription;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Content(Long contentId, String contentType, String contentPersonName, String contentPersonImage, String contentRole, String contentDescription, LocalDateTime createdOn, Section section) {
        this.contentId = contentId;
        this.contentType = contentType;
        this.contentPersonName = contentPersonName;
        this.contentPersonImage = contentPersonImage;
        this.contentRole = contentRole;
        this.contentDescription = contentDescription;
        this.createdOn = createdOn;
        this.section = section;
    }

    public Content() {
    }
}