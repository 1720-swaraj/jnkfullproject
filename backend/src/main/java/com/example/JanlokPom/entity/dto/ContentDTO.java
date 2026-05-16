package com.example.JanlokPom.entity.dto;

import com.example.JanlokPom.entity.Content;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class ContentDTO {

    private Long contentId;
    private String sectionName;
    private String contentType;
    private String contentPersonName;
    private String contentPersonImage;
    private String contentRole;
    private String contentDescription;
    private LocalDateTime createdOn;

    public ContentDTO(Content c) {
        this.contentId = c.getContentId();
        this.sectionName = c.getSection().getSectionName();
        this.contentType = c.getContentType();
        this.contentPersonName = c.getContentPersonName();
        this.contentPersonImage = c.getContentPersonImage();
        this.contentRole = c.getContentRole();
        this.contentDescription = c.getContentDescription();
        this.createdOn = c.getCreatedOn();
    }
}