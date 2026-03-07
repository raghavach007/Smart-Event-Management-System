package com.college.eventportal.controller;

import com.college.eventportal.entity.ArenaRegistration;
import com.college.eventportal.repository.ArenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/arena")
@CrossOrigin
public class ArenaController {

    @Autowired
    private ArenaRepository arenaRepository;

    @PostMapping("/register")
    public ArenaRegistration register(@RequestBody ArenaRegistration reg) {
        return arenaRepository.save(reg);
    }
}