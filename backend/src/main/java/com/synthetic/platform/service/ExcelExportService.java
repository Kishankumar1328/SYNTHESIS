package com.synthetic.platform.service;

import com.synthetic.platform.dto.PrivacyReportDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service for generating Excel reports
 */
@Service
@Slf4j
public class ExcelExportService {

    public byte[] generatePrivacyReport(PrivacyReportDTO report, List<List<String>> syntheticData) throws Exception {
        log.info("Generating Excel privacy report: {}", report.getReportId());

        try (Workbook workbook = new XSSFWorkbook()) {
            // Create sheets
            createSummarySheet(workbook, report);
            createDatasetInfoSheet(workbook, report);
            createPrivacyMetricsSheet(workbook, report);
            createStatisticalAnalysisSheet(workbook, report);
            createPrivacyGuaranteesSheet(workbook, report);

            // Add synthetic data if provided
            if (syntheticData != null && !syntheticData.isEmpty()) {
                createSyntheticDataSheet(workbook, syntheticData);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            log.info("Excel report generated successfully");
            return out.toByteArray();
        }
    }

    private void createSummarySheet(Workbook workbook, PrivacyReportDTO report) {
        Sheet sheet = workbook.createSheet("Summary");

        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        int rowNum = 0;

        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Privacy-Preserving Synthetic Data Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));
        rowNum++;

        // Report metadata
        addRow(sheet, rowNum++, "Report ID:", report.getReportId(), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Generated At:",
                report.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                headerStyle, dataStyle);
        rowNum++;

        // Dataset info
        addRow(sheet, rowNum++, "Original Dataset:", report.getOriginalDataset().getName(), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Original Records:", report.getOriginalDataset().getRowCount().toString(), headerStyle,
                dataStyle);
        addRow(sheet, rowNum++, "Synthetic Dataset:", report.getSyntheticDataset().getName(), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Synthetic Records:", report.getSyntheticDataset().getRowCount().toString(),
                headerStyle, dataStyle);
        rowNum++;

        // Key metrics
        PrivacyReportDTO.PrivacyMetrics metrics = report.getPrivacyMetrics();
        PrivacyReportDTO.StatisticalComparison stats = report.getStatisticalComparison();

        addRow(sheet, rowNum++, "Anonymization Score:", String.format("%.2f%%", metrics.getAnonymizationScore()),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Quality Score:", stats.getQualityScore(), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Privacy Level:", metrics.getPrivacyLevel(), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Zero Leakage:", metrics.getZeroLeakageGuarantee() ? "YES ✓" : "NO ✗", headerStyle,
                dataStyle);

        // Auto-size columns
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createDatasetInfoSheet(Workbook workbook, PrivacyReportDTO report) {
        Sheet sheet = workbook.createSheet("Dataset Information");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        int rowNum = 0;

        // Headers
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = { "Metric", "Original Dataset", "Synthetic Dataset" };
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Data rows
        addDataRow(sheet, rowNum++, "Dataset Name",
                report.getOriginalDataset().getName(),
                report.getSyntheticDataset().getName(), dataStyle);
        addDataRow(sheet, rowNum++, "Number of Records",
                report.getOriginalDataset().getRowCount().toString(),
                report.getSyntheticDataset().getRowCount().toString(), dataStyle);
        addDataRow(sheet, rowNum++, "Number of Columns",
                report.getOriginalDataset().getColumnCount().toString(),
                report.getSyntheticDataset().getColumnCount().toString(), dataStyle);
        addDataRow(sheet, rowNum++, "Size (KB)",
                String.format("%.2f", report.getOriginalDataset().getSizeBytes() / 1024.0),
                String.format("%.2f", report.getSyntheticDataset().getSizeBytes() / 1024.0), dataStyle);

        rowNum += 2;

        // Column details
        Row columnHeaderRow = sheet.createRow(rowNum++);
        String[] colHeaders = { "Column Name", "Data Type", "Sensitive", "Reason" };
        for (int i = 0; i < colHeaders.length; i++) {
            Cell cell = columnHeaderRow.createCell(i);
            cell.setCellValue(colHeaders[i]);
            cell.setCellStyle(headerStyle);
        }

        for (PrivacyReportDTO.ColumnInfo column : report.getOriginalDataset().getColumns()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(column.getName());
            row.createCell(1).setCellValue(column.getDataType());
            row.createCell(2).setCellValue(column.getSensitive() ? "YES" : "NO");
            row.createCell(3)
                    .setCellValue(column.getSensitivityReason() != null ? column.getSensitivityReason() : "N/A");
        }

        // Auto-size columns
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createPrivacyMetricsSheet(Workbook workbook, PrivacyReportDTO report) {
        Sheet sheet = workbook.createSheet("Privacy Metrics");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle highlightStyle = createHighlightStyle(workbook);

        PrivacyReportDTO.PrivacyMetrics metrics = report.getPrivacyMetrics();

        int rowNum = 0;

        // Headers
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("Privacy Metric");
        headerRow.createCell(1).setCellValue("Value");
        headerRow.getCell(0).setCellStyle(headerStyle);
        headerRow.getCell(1).setCellStyle(headerStyle);

        // Data
        addRow(sheet, rowNum++, "Anonymization Score", String.format("%.2f%%", metrics.getAnonymizationScore()),
                headerStyle, highlightStyle);
        addRow(sheet, rowNum++, "Record Similarity Score",
                String.format("%.2f%% (lower is better)", metrics.getRecordSimilarityScore()), headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Sensitive Fields Detected", metrics.getSensitiveFieldsDetected().toString(),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Sensitive Fields Protected", metrics.getSensitiveFieldsProtected().toString(),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Zero Leakage Guarantee", metrics.getZeroLeakageGuarantee() ? "YES ✓" : "NO ✗",
                headerStyle, highlightStyle);
        addRow(sheet, rowNum++, "Privacy Level", metrics.getPrivacyLevel(), headerStyle, dataStyle);

        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createStatisticalAnalysisSheet(Workbook workbook, PrivacyReportDTO report) {
        Sheet sheet = workbook.createSheet("Statistical Analysis");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        PrivacyReportDTO.StatisticalComparison stats = report.getStatisticalComparison();

        int rowNum = 0;

        // Headers
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("Statistical Metric");
        headerRow.createCell(1).setCellValue("Value");
        headerRow.getCell(0).setCellStyle(headerStyle);
        headerRow.getCell(1).setCellStyle(headerStyle);

        // Data
        addRow(sheet, rowNum++, "Distribution Similarity", String.format("%.2f%%", stats.getDistributionSimilarity()),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Correlation Preservation", String.format("%.2f%%", stats.getCorrelationPreservation()),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Mean Absolute Error", String.format("%.4f", stats.getMeanAbsoluteError()), headerStyle,
                dataStyle);
        addRow(sheet, rowNum++, "Standard Deviation Error", String.format("%.4f", stats.getStandardDeviationError()),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Overall Quality Score", stats.getQualityScore(), headerStyle, dataStyle);

        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createPrivacyGuaranteesSheet(Workbook workbook, PrivacyReportDTO report) {
        Sheet sheet = workbook.createSheet("Privacy Guarantees");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        PrivacyReportDTO.PrivacyGuarantees guarantees = report.getPrivacyGuarantees();

        int rowNum = 0;

        // Headers
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("Guarantee");
        headerRow.createCell(1).setCellValue("Status");
        headerRow.getCell(0).setCellStyle(headerStyle);
        headerRow.getCell(1).setCellStyle(headerStyle);

        // Data
        addRow(sheet, rowNum++, "No PII Leakage", guarantees.getNoPiiLeakage() ? "✓ PASS" : "✗ FAIL", headerStyle,
                dataStyle);
        addRow(sheet, rowNum++, "No Financial Data Leakage",
                guarantees.getNoFinancialDataLeakage() ? "✓ PASS" : "✗ FAIL", headerStyle, dataStyle);
        addRow(sheet, rowNum++, "No Medical Data Leakage", guarantees.getNoMedicalDataLeakage() ? "✓ PASS" : "✗ FAIL",
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "No Location Data Leakage", guarantees.getNoLocationDataLeakage() ? "✓ PASS" : "✗ FAIL",
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "No Original Records Copied",
                guarantees.getNoOriginalRecordsCopied() ? "✓ PASS" : "✗ FAIL", headerStyle, dataStyle);
        rowNum++;
        addRow(sheet, rowNum++, "Minimum Record Distance", String.format("%.2f", guarantees.getMinimumRecordDistance()),
                headerStyle, dataStyle);
        addRow(sheet, rowNum++, "Compliance Level", guarantees.getComplianceLevel(), headerStyle, dataStyle);

        rowNum += 2;

        // Privacy techniques
        Row techHeaderRow = sheet.createRow(rowNum++);
        techHeaderRow.createCell(0).setCellValue("Privacy Techniques Applied");
        techHeaderRow.getCell(0).setCellStyle(headerStyle);

        for (String technique : guarantees.getPrivacyTechniquesApplied()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue("• " + technique);
        }

        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createSyntheticDataSheet(Workbook workbook, List<List<String>> data) {
        Sheet sheet = workbook.createSheet("Synthetic Data");

        CellStyle headerStyle = createHeaderStyle(workbook);

        int rowNum = 0;

        // Add headers (first row of data)
        if (!data.isEmpty()) {
            Row headerRow = sheet.createRow(rowNum++);
            List<String> headers = data.get(0);
            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
                cell.setCellStyle(headerStyle);
            }

            // Add data rows
            for (int i = 1; i < data.size(); i++) {
                Row row = sheet.createRow(rowNum++);
                List<String> rowData = data.get(i);
                for (int j = 0; j < rowData.size(); j++) {
                    row.createCell(j).setCellValue(rowData.get(j));
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }
        }
    }

    // Helper methods for styling
    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createHighlightStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private void addRow(Sheet sheet, int rowNum, String key, String value, CellStyle keyStyle, CellStyle valueStyle) {
        Row row = sheet.createRow(rowNum);
        Cell keyCell = row.createCell(0);
        keyCell.setCellValue(key);
        keyCell.setCellStyle(keyStyle);

        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
        valueCell.setCellStyle(valueStyle);
    }

    private void addDataRow(Sheet sheet, int rowNum, String col1, String col2, String col3, CellStyle style) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(col1);
        row.createCell(1).setCellValue(col2);
        row.createCell(2).setCellValue(col3);

        for (int i = 0; i < 3; i++) {
            row.getCell(i).setCellStyle(style);
        }
    }
}
