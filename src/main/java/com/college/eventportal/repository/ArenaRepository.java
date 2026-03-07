package com.college.eventportal.repository;

import com.college.eventportal.entity.ArenaRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArenaRepository extends JpaRepository<ArenaRegistration, Long> {
}