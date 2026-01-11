package com.synthetic.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for Privacy Report Generation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacyReportDTO {

    private String reportId;
    private LocalDateTime generatedAt;

    // Dataset Information
    private DatasetInfo originalDataset;
    private DatasetInfo syntheticDataset;

    // Privacy Metrics
    private PrivacyMetrics privacyMetrics;

    // Statistical Comparison
    private StatisticalComparison statisticalComparison;

    // Distribution Analysis
    private List<DistributionAnalysis> distributions;

    // Correlation Analysis
    private CorrelationAnalysis correlationAnalysis;

    // Privacy Guarantees
    private PrivacyGuarantees privacyGuarantees;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatasetInfo {
        private String name;
        private Integer rowCount;
        private Integer columnCount;
        private Long sizeBytes;
        private List<ColumnInfo> columns;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColumnInfo {
        private String name;
        private String dataType;
        private Boolean sensitive;
        private String sensitivityReason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrivacyMetrics {
        private Double anonymizationScore; // 0-100
        private Double recordSimilarityScore; // 0-100 (lower is better)
        private Integer sensitiveFieldsDetected;
        private Integer sensitiveFieldsProtected;
        private Boolean zeroLeakageGuarantee;
        private String privacyLevel; // HIGH, MEDIUM, LOW
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatisticalComparison {
        private Double distributionSimilarity; // 0-100%
        private Double correlationPreservation; // 0-100%
        private Double meanAbsoluteError;
        private Double standardDeviationError;
        private String qualityScore; // EXCELLENT, GOOD, FAIR, POOR
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DistributionAnalysis {
        private String columnName;
        private String dataType;
        private Map<String, Double> originalDistribution;
        private Map<String, Double> syntheticDistribution;
        private Double klDivergence; // Kullback-Leibler divergence
        private Double jsDivergence; // Jensen-Shannon divergence
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CorrelationAnalysis {
        private Map<String, Map<String, Double>> originalCorrelations;
        private Map<String, Map<String, Double>> syntheticCorrelations;
        private Double overallCorrelationError;
        private List<CorrelationPair> topDifferences;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CorrelationPair {
        private String column1;
        private String column2;
        private Double originalCorrelation;
        private Double syntheticCorrelation;
        private Double difference;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrivacyGuarantees {
        private Boolean noPiiLeakage;
        private Boolean noFinancialDataLeakage;
        private Boolean noMedicalDataLeakage;
        private Boolean noLocationDataLeakage;
        private Boolean noOriginalRecordsCopied;
        private Double minimumRecordDistance; // Minimum distance from original records
        private String complianceLevel; // GDPR, HIPAA, CCPA
        private List<String> privacyTechniquesApplied;
    }
}
