package com.synthetic.platform.service;

import com.synthetic.platform.model.Project;
import com.synthetic.platform.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Project ID cannot be null");
        }
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project create(Project project) {
        if (project == null) {
            throw new IllegalArgumentException("Project cannot be null");
        }
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be empty");
        }
        return projectRepository.save(project);
    }
}
