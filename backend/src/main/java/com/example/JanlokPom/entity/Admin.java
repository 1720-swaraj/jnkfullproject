package com.example.JanlokPom.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admins_master")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    private String adminName;
    private String adminPhoneNo;
    private String adminAddress;

    @Column(unique = true)
    private String adminEmail;

    private String adminPassword;

    // ✅ Image filename
    private String adminImage;

    // Getters & Setters

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminPhoneNo() { return adminPhoneNo; }
    public void setAdminPhoneNo(String adminPhoneNo) { this.adminPhoneNo = adminPhoneNo; }

    public String getAdminAddress() { return adminAddress; }
    public void setAdminAddress(String adminAddress) { this.adminAddress = adminAddress; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }

    public String getAdminImage() { return adminImage; }
    public void setAdminImage(String adminImage) { this.adminImage = adminImage; }

    public Admin(Long adminId, String adminName, String adminPhoneNo, String adminAddress, String adminEmail, String adminPassword, String adminImage) {
        this.adminId = adminId;
        this.adminName = adminName;
        this.adminPhoneNo = adminPhoneNo;
        this.adminAddress = adminAddress;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminImage = adminImage;
    }

    public Admin() {
    }
}