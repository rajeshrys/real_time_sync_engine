package com.rajesh.repository;

import com.rajesh.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository <Document,Long> {

}
