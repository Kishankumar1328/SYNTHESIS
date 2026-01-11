package com.synthetic.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Export Request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportRequestDTO {

    private Long datasetId;
    private Long syntheticDatasetId;
    private ExportFormat format;
    private Boolean includePrivacyReport;
    private Integer numberOfRecords;

    public enum ExportFormat {
        PDF,
        EXCEL,
        JSON,
        CSV
    }
}
