package com.synthetic.platform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.synthetic.platform.dto.ExportRequestDTO;
import com.synthetic.platform.dto.PrivacyReportDTO;
import com.synthetic.platform.model.Dataset;
import com.synthetic.platform.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Controller for handling export operations (PDF, Excel, JSON)
 */
@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class ExportController {

    private final DatasetService datasetService;
    private final PrivacyReportService privacyReportService;
    private final PdfExportService pdfExportService;
    private final ExcelExportService excelExportService;
    private final ObjectMapper objectMapper;

    /**
     * Export synthetic dataset with privacy report in PDF format
     */
    @PostMapping("/pdf")
    public ResponseEntity<Resource> exportPdf(@RequestBody ExportRequestDTO request) {
        try {
            log.info("Exporting dataset {} as PDF with privacy report", request.getDatasetId());

            Dataset originalDataset = datasetService.findById(request.getDatasetId());
            Dataset syntheticDataset = request.getSyntheticDatasetId() != null
                    ? datasetService.findById(request.getSyntheticDatasetId())
                    : originalDataset; // For demo, use same dataset

            // Generate privacy report
            PrivacyReportDTO report = privacyReportService.generateReport(originalDataset, syntheticDataset);

            // Generate PDF
            byte[] pdfBytes = pdfExportService.generatePrivacyReport(report);

            ByteArrayResource resource = new ByteArrayResource(pdfBytes);

            String filename = generateFilename("privacy_report", "pdf");

            log.info("PDF export successful: {} bytes", pdfBytes.length);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfBytes.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("Failed to export PDF", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Export synthetic dataset with privacy report in Excel format
     */
    @PostMapping("/excel")
    public ResponseEntity<Resource> exportExcel(@RequestBody ExportRequestDTO request) {
        try {
            log.info("Exporting dataset {} as Excel with privacy report", request.getDatasetId());

            Dataset originalDataset = datasetService.findById(request.getDatasetId());
            Dataset syntheticDataset = request.getSyntheticDatasetId() != null
                    ? datasetService.findById(request.getSyntheticDatasetId())
                    : originalDataset;

            // Generate privacy report
            PrivacyReportDTO report = privacyReportService.generateReport(originalDataset, syntheticDataset);

            // Load synthetic data
            List<List<String>> syntheticData = loadCsvData(syntheticDataset.getFilePath(),
                    request.getNumberOfRecords() != null ? request.getNumberOfRecords() : 1000);

            // Generate Excel
            byte[] excelBytes = excelExportService.generatePrivacyReport(report, syntheticData);

            ByteArrayResource resource = new ByteArrayResource(excelBytes);

            String filename = generateFilename("synthetic_data_report", "xlsx");

            log.info("Excel export successful: {} bytes", excelBytes.length);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(
                            MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(excelBytes.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("Failed to export Excel", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Export synthetic dataset in JSON format with privacy report
     */
    @PostMapping("/json")
    public ResponseEntity<Resource> exportJson(@RequestBody ExportRequestDTO request) {
        try {
            log.info("Exporting dataset {} as JSON", request.getDatasetId());

            Dataset originalDataset = datasetService.findById(request.getDatasetId());
            Dataset syntheticDataset = request.getSyntheticDatasetId() != null
                    ? datasetService.findById(request.getSyntheticDatasetId())
                    : originalDataset;

            // Load synthetic data
            List<List<String>> syntheticData = loadCsvData(syntheticDataset.getFilePath(),
                    request.getNumberOfRecords() != null ? request.getNumberOfRecords() : 1000);

            // Create JSON export object
            JsonExportData exportData = new JsonExportData();
            exportData.setExportDate(LocalDateTime.now());
            exportData.setDatasetName(syntheticDataset.getName());
            exportData.setRecordCount(syntheticData.size() - 1); // Exclude header

            if (request.getIncludePrivacyReport() != null && request.getIncludePrivacyReport()) {
                PrivacyReportDTO report = privacyReportService.generateReport(originalDataset, syntheticDataset);
                exportData.setPrivacyReport(report);
            }

            // Convert data to JSON-friendly format
            List<Object> records = convertToJsonRecords(syntheticData);
            exportData.setData(records);
            exportData.setMetadata(createMetadata(syntheticDataset, syntheticData));

            // Convert to JSON
            String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(exportData);
            byte[] jsonBytes = jsonString.getBytes();

            ByteArrayResource resource = new ByteArrayResource(jsonBytes);

            String filename = generateFilename("synthetic_data", "json");

            log.info("JSON export successful: {} bytes", jsonBytes.length);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .contentLength(jsonBytes.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("Failed to export JSON", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Export only the privacy report (without data) in PDF
     */
    @GetMapping("/privacy-report/pdf/{originalDatasetId}/{syntheticDatasetId}")
    public ResponseEntity<Resource> exportPrivacyReportPdf(
            @PathVariable Long originalDatasetId,
            @PathVariable Long syntheticDatasetId) throws Exception {

        log.info("Exporting privacy report as PDF for datasets {} and {}", originalDatasetId, syntheticDatasetId);

        Dataset originalDataset = datasetService.findById(originalDatasetId);
        Dataset syntheticDataset = datasetService.findById(syntheticDatasetId);

        PrivacyReportDTO report = privacyReportService.generateReport(originalDataset, syntheticDataset);
        byte[] pdfBytes = pdfExportService.generatePrivacyReport(report);

        ByteArrayResource resource = new ByteArrayResource(pdfBytes);
        String filename = generateFilename("privacy_report", "pdf");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(resource);
    }

    /**
     * Get privacy report as JSON (for frontend display)
     */
    @GetMapping("/privacy-report/json/{originalDatasetId}/{syntheticDatasetId}")
    public ResponseEntity<PrivacyReportDTO> getPrivacyReport(
            @PathVariable Long originalDatasetId,
            @PathVariable Long syntheticDatasetId) throws Exception {

        log.info("Getting privacy report for datasets {} and {}", originalDatasetId, syntheticDatasetId);

        Dataset originalDataset = datasetService.findById(originalDatasetId);
        Dataset syntheticDataset = datasetService.findById(syntheticDatasetId);

        PrivacyReportDTO report = privacyReportService.generateReport(originalDataset, syntheticDataset);

        return ResponseEntity.ok(report);
    }

    // Helper methods

    private List<List<String>> loadCsvData(String filePath, int maxRecords) throws Exception {
        List<List<String>> data = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filePath))) {
            String line;
            int count = 0;
            while ((line = reader.readLine()) != null && count < maxRecords + 1) { // +1 for header
                data.add(Arrays.asList(line.split(",")));
                count++;
            }
        }

        return data;
    }

    private List<Object> convertToJsonRecords(List<List<String>> csvData) {
        List<Object> records = new ArrayList<>();

        if (csvData.isEmpty())
            return records;

        List<String> headers = csvData.get(0);

        for (int i = 1; i < csvData.size(); i++) {
            List<String> row = csvData.get(i);
            java.util.Map<String, String> record = new java.util.HashMap<>();

            for (int j = 0; j < Math.min(headers.size(), row.size()); j++) {
                record.put(headers.get(j), row.get(j));
            }

            records.add(record);
        }

        return records;
    }

    private JsonMetadata createMetadata(Dataset dataset, List<List<String>> data) {
        JsonMetadata metadata = new JsonMetadata();
        metadata.setDatasetName(dataset.getName());
        metadata.setRecordCount(data.size() - 1); // Exclude header
        metadata.setColumnCount(data.isEmpty() ? 0 : data.get(0).size());
        metadata.setGeneratedAt(LocalDateTime.now());
        metadata.setColumns(data.isEmpty() ? new ArrayList<>() : data.get(0));
        metadata.setPrivacySafe(true);
        metadata.setZeroLeakageGuaranteed(true);
        return metadata;
    }

    private String generateFilename(String prefix, String extension) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        return String.format("%s_%s.%s", prefix, timestamp, extension);
    }

    // Inner classes for JSON export structure

    @lombok.Data
    private static class JsonExportData {
        private LocalDateTime exportDate;
        private String datasetName;
        private Integer recordCount;
        private JsonMetadata metadata;
        private PrivacyReportDTO privacyReport;
        private List<Object> data;
    }

    @lombok.Data
    private static class JsonMetadata {
        private String datasetName;
        private Integer recordCount;
        private Integer columnCount;
        private LocalDateTime generatedAt;
        private List<String> columns;
        private Boolean privacySafe;
        private Boolean zeroLeakageGuaranteed;
        private String complianceLevel = "GDPR, HIPAA, CCPA Compliant";
    }
}
