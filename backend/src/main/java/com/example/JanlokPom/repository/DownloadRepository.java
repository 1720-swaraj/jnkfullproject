package com.example.JanlokPom.repository;

import com.example.JanlokPom.entity.DownloadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DownloadRepository extends JpaRepository<DownloadEntity, Long> {
}