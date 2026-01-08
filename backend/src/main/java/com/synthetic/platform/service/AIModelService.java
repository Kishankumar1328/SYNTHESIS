package com.synthetic.platform.service;

import com.synthetic.platform.model.AIModel;
import com.synthetic.platform.model.Dataset;
import com.synthetic.platform.repository.AIModelRepository;
import com.synthetic.platform.controller.AIModelController.HyperparametersDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIModelService {
    private final AIModelRepository modelRepository;
    private final DatasetService datasetService;
    private final AIService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<AIModel> findByDatasetId(Long datasetId) {
        return modelRepository.findByDatasetId(datasetId);
    }

    public AIModel findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Model ID cannot be null");
        }
        return modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found with id: " + id));
    }

    public AIModel save(AIModel model) {
        if (model == null) {
            throw new IllegalArgumentException("Model cannot be null");
        }
        return modelRepository.save(model);
    }

    @Transactional
    public AIModel initiateTraining(Long datasetId, String algorithm, HyperparametersDTO hyperparameters) {
        if (datasetId == null) {
            throw new IllegalArgumentException("Dataset ID cannot be null");
        }
        if (algorithm == null || algorithm.trim().isEmpty()) {
            throw new IllegalArgumentException("Algorithm cannot be null or empty");
        }

        Dataset dataset = datasetService.findById(datasetId);

        AIModel model = new AIModel();
        model.setDataset(dataset);
        model.setAlgorithm(algorithm);
        model.setStatus("PENDING");
        model.setCreatedAt(LocalDateTime.now());

        // Store hyperparameters as JSON in training_metrics field
        if (hyperparameters != null) {
            try {
                String hyperparamsJson = objectMapper.writeValueAsString(hyperparameters);
                model.setTrainingMetrics(hyperparamsJson);
            } catch (Exception e) {
                // Use defaults if serialization fails
                model.setTrainingMetrics("{}");
            }
        }

        AIModel savedModel = modelRepository.save(model);
        aiService.trainModel(savedModel);
        return savedModel;
    }
}
