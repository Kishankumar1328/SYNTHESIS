package com.synthetic.platform.controller;

import com.synthetic.platform.model.AIModel;
import com.synthetic.platform.service.AIModelService;
import com.synthetic.platform.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
@CrossOrigin
public class AIModelController {
    private final AIModelService modelService;
    private final AIService aiService;

    @GetMapping("/dataset/{datasetId}")
    public List<AIModel> getByDataset(@PathVariable Long datasetId) {
        return modelService.findByDatasetId(datasetId);
    }

    @PostMapping("/train")
    public AIModel train(@RequestBody TrainRequest request) {
        return modelService.initiateTraining(
                request.getDatasetId(),
                request.getAlgorithm(),
                request.getHyperparameters());
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<Resource> generate(@PathVariable Long id, @RequestBody GenerateRequest request)
            throws Exception {
        AIModel model = modelService.findById(id);

        String fileName = "synthetic_" + UUID.randomUUID() + ".csv";
        String outputPath = Paths.get(System.getProperty("java.io.tmpdir"), fileName).toString();

        aiService.generateData(model, request.getCount(), outputPath, request.getAnomalyJson());

        File file = new File(outputPath);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/{id}/evaluate")
    public String evaluate(@PathVariable Long id, @RequestParam(defaultValue = "1000") int samples) throws Exception {
        AIModel model = modelService.findById(id);
        return aiService.evaluateModel(model, samples);
    }

    @lombok.Data
    public static class TrainRequest {
        private Long datasetId;
        private String algorithm;
        private HyperparametersDTO hyperparameters;
    }

    @lombok.Data
    public static class HyperparametersDTO {
        private Integer epochs = 5;
        private Integer batchSize = 50;
        private Double learningRate = 0.0002;
        private Integer discriminatorSteps = 1;
        private String generatorDim = "256,256";
        private String discriminatorDim = "256,256";
    }

    @lombok.Data
    public static class GenerateRequest {
        private int count;
        private String anomalyJson;
    }
}
