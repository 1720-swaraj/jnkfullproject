package com.example.JanlokPom.Controller;

import com.example.JanlokPom.entity.Section;
import com.example.JanlokPom.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section")
@CrossOrigin("*")
public class SectionController {

    @Autowired
    private SectionService service;

    @PostMapping("/add")
    public Section add(@RequestBody Section section) {
        return service.addSection(section);
    }

    @GetMapping("/all")
    public List<Section> all() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted Successfully";
    }
    @PutMapping("/update/{id}")
    public Section update(@PathVariable Long id, @RequestBody Section section) {
        return service.updateSection(id, section);
    }

}