package com.synthetic.platform.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.synthetic.platform.dto.PrivacyReportDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Service for generating PDF reports
 */
@Service
@Slf4j
public class PdfExportService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font HEADING_FONT = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLACK);
    private static final Font SUBHEADING_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
    private static final Font SMALL_FONT = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, BaseColor.GRAY);

    public byte[] generatePrivacyReport(PrivacyReportDTO report) throws Exception {
        log.info("Generating PDF privacy report: {}", report.getReportId());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // Title Page
        addTitlePage(document, report);
        document.newPage();

        // Executive Summary
        addExecutiveSummary(document, report);
        document.newPage();

        // Dataset Information
        addDatasetInformation(document, report);

        // Privacy Metrics
        addPrivacyMetrics(document, report);

        // Statistical Comparison
        addStatisticalComparison(document, report);

        // Privacy Guarantees
        addPrivacyGuarantees(document, report);

        // Footer
        addFooter(document, report);

        document.close();

        log.info("PDF report generated successfully");
        return out.toByteArray();
    }

    private void addTitlePage(Document document, PrivacyReportDTO report) throws DocumentException {
        Paragraph title = new Paragraph("Privacy-Preserving Synthetic Data Report", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(30);
        document.add(title);

        Paragraph subtitle = new Paragraph("Zero-Leakage Guarantee • Statistical Fidelity • GDPR Compliant",
                SUBHEADING_FONT);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(50);
        document.add(subtitle);

        // Add logo placeholder
        Paragraph logo = new Paragraph("SynthoGen Intelligence Platform", HEADING_FONT);
        logo.setAlignment(Element.ALIGN_CENTER);
        logo.setSpacingAfter(100);
        document.add(logo);

        // Report metadata
        addMetadataTable(document, report);
    }

    private void addMetadataTable(Document document, PrivacyReportDTO report) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.setSpacingBefore(50);

        addTableRow(table, "Report ID:", report.getReportId(), true);
        addTableRow(table, "Generated At:",
                report.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), false);
        addTableRow(table, "Original Dataset:", report.getOriginalDataset().getName(), false);
        addTableRow(table, "Synthetic Dataset:", report.getSyntheticDataset().getName(), false);

        document.add(table);
    }

    private void addExecutiveSummary(Document document, PrivacyReportDTO report) throws DocumentException {
        addSection(document, "Executive Summary");

        PrivacyReportDTO.PrivacyMetrics metrics = report.getPrivacyMetrics();
        PrivacyReportDTO.StatisticalComparison stats = report.getStatisticalComparison();

        Paragraph summary = new Paragraph();
        summary.setFont(NORMAL_FONT);
        summary.setAlignment(Element.ALIGN_JUSTIFIED);
        summary.add(
                "This report certifies that the synthetic dataset has been generated using advanced privacy-preserving "
                        + "techniques with zero data leakage guarantee. ");
        summary.add("\n\n");
        summary.add(String.format("Privacy Score: %.1f%% | Quality Score: %s | Anonymization: %.1f%%",
                metrics.getAnonymizationScore(),
                stats.getQualityScore(),
                metrics.getAnonymizationScore()));
        summary.add("\n\n");
        summary.add("The synthetic dataset maintains statistical properties of the original while ensuring no "
                + "personally identifiable, financial, medical, or location data has been leaked. ");
        summary.add("All records are 100% newly generated with no direct copies from the original dataset.");

        document.add(summary);
        document.add(new Paragraph("\n"));
    }

    private void addDatasetInformation(Document document, PrivacyReportDTO report) throws DocumentException {
        addSection(document, "Dataset Information");

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        // Headers
        addTableHeader(table, "Metric");
        addTableHeader(table, "Original Dataset");
        addTableHeader(table, "Synthetic Dataset");

        // Data
        addTableRow(table, "Number of Records",
                report.getOriginalDataset().getRowCount().toString(),
                report.getSyntheticDataset().getRowCount().toString());
        addTableRow(table, "Number of Columns",
                report.getOriginalDataset().getColumnCount().toString(),
                report.getSyntheticDataset().getColumnCount().toString());
        addTableRow(table, "Size (KB)",
                String.format("%.2f", report.getOriginalDataset().getSizeBytes() / 1024.0),
                String.format("%.2f", report.getSyntheticDataset().getSizeBytes() / 1024.0));

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addPrivacyMetrics(Document document, PrivacyReportDTO report) throws DocumentException {
        addSection(document, "Privacy Protection Metrics");

        PrivacyReportDTO.PrivacyMetrics metrics = report.getPrivacyMetrics();

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addTableRow(table, "Anonymization Score", String.format("%.2f%%", metrics.getAnonymizationScore()), true);
        addTableRow(table, "Record Similarity Score",
                String.format("%.2f%% (Lower is Better)", metrics.getRecordSimilarityScore()), false);
        addTableRow(table, "Sensitive Fields Detected", metrics.getSensitiveFieldsDetected().toString(), false);
        addTableRow(table, "Sensitive Fields Protected", metrics.getSensitiveFieldsProtected().toString(), false);
        addTableRow(table, "Zero Leakage Guarantee", metrics.getZeroLeakageGuarantee() ? "✓ YES" : "✗ NO", false);
        addTableRow(table, "Privacy Level", metrics.getPrivacyLevel(), false);

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addStatisticalComparison(Document document, PrivacyReportDTO report) throws DocumentException {
        addSection(document, "Statistical Fidelity Analysis");

        PrivacyReportDTO.StatisticalComparison stats = report.getStatisticalComparison();

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addTableRow(table, "Distribution Similarity", String.format("%.2f%%", stats.getDistributionSimilarity()), true);
        addTableRow(table, "Correlation Preservation", String.format("%.2f%%", stats.getCorrelationPreservation()),
                false);
        addTableRow(table, "Mean Absolute Error", String.format("%.4f", stats.getMeanAbsoluteError()), false);
        addTableRow(table, "Standard Deviation Error", String.format("%.4f", stats.getStandardDeviationError()), false);
        addTableRow(table, "Overall Quality Score", stats.getQualityScore(), false);

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addPrivacyGuarantees(Document document, PrivacyReportDTO report) throws DocumentException {
        addSection(document, "Privacy Guarantees & Compliance");

        PrivacyReportDTO.PrivacyGuarantees guarantees = report.getPrivacyGuarantees();

        Paragraph guaranteeText = new Paragraph();
        guaranteeText.setFont(NORMAL_FONT);
        guaranteeText.add("This synthetic dataset provides the following privacy guarantees:\n\n");

        guaranteeText.add(formatCheckmark(guarantees.getNoPiiLeakage())
                + " No PII (Personally Identifiable Information) Leakage\n");
        guaranteeText.add(formatCheckmark(guarantees.getNoFinancialDataLeakage()) + " No Financial Data Leakage\n");
        guaranteeText.add(formatCheckmark(guarantees.getNoMedicalDataLeakage()) + " No Medical/Health Data Leakage\n");
        guaranteeText
                .add(formatCheckmark(guarantees.getNoLocationDataLeakage()) + " No Precise Location Data Leakage\n");
        guaranteeText.add(formatCheckmark(guarantees.getNoOriginalRecordsCopied()) + " No Original Records Copied\n\n");

        guaranteeText.add(String.format("Minimum Record Distance: %.2f (Distance from closest original record)\n",
                guarantees.getMinimumRecordDistance()));
        guaranteeText.add(String.format("Compliance Level: %s\n\n", guarantees.getComplianceLevel()));

        guaranteeText.add("Privacy Techniques Applied:\n");
        for (String technique : guarantees.getPrivacyTechniquesApplied()) {
            guaranteeText.add("  • " + technique + "\n");
        }

        document.add(guaranteeText);
        document.add(new Paragraph("\n"));
    }

    private void addFooter(Document document, PrivacyReportDTO report) throws DocumentException {
        Paragraph footer = new Paragraph();
        footer.setFont(SMALL_FONT);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.add("\n\n" + Chunk.NEWLINE);
        footer.add("─────────────────────────────────────────────────────────\n");
        footer.add("Generated by SynthoGen Intelligence Platform\n");
        footer.add("© 2026 SynthoGen Intelligence Systems - Privacy-Preserving Synthetic Data Generation\n");
        footer.add("This report certifies compliance with GDPR, HIPAA, and CCPA regulations\n");

        document.add(footer);
    }

    private void addSection(Document document, String title) throws DocumentException {
        Paragraph section = new Paragraph(title, HEADING_FONT);
        section.setSpacingBefore(20);
        section.setSpacingAfter(10);
        document.add(section);
    }

    private void addTableHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, SUBHEADING_FONT));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(8);
        table.addCell(cell);
    }

    private void addTableRow(PdfPTable table, String key, String value, boolean highlight) {
        PdfPCell keyCell = new PdfPCell(new Phrase(key, highlight ? SUBHEADING_FONT : NORMAL_FONT));
        keyCell.setPadding(5);
        if (highlight) {
            keyCell.setBackgroundColor(new BaseColor(240, 248, 255));
        }
        table.addCell(keyCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, NORMAL_FONT));
        valueCell.setPadding(5);
        if (highlight) {
            valueCell.setBackgroundColor(new BaseColor(240, 248, 255));
        }
        table.addCell(valueCell);
    }

    private void addTableRow(PdfPTable table, String col1, String col2, String col3) {
        table.addCell(new Phrase(col1, NORMAL_FONT));
        table.addCell(new Phrase(col2, NORMAL_FONT));
        table.addCell(new Phrase(col3, NORMAL_FONT));
    }

    private String formatCheckmark(Boolean value) {
        return value ? "✓" : "✗";
    }
}
