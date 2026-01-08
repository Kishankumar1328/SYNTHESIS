package com.synthetic.platform.repository;

import com.synthetic.platform.model.AIModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIModelRepository extends JpaRepository<AIModel, Long> {
    List<AIModel> findByDatasetId(Long datasetId);
}
