import { jsPDF } from 'jspdf';

/**
 * Downloads a formatted PDF report from the last test run.
 * @param {object} parsed   - Parsed diagnosis fields: { rootCause, severity, fix, risk }
 * @param {object} metrics  - Latest metrics: { p50, p95, p99, throughput, errorRate, activeUsers }
 * @param {string} target   - The URL that was tested (optional)
 */
export function useDownloadReport() {
    const download = ({ parsed, metrics, target }) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();
        const margin = 48;
        const contentWidth = W - margin * 2;
        let y = margin;

        // ── Helpers ─────────────────────────────────────────────────────────────

        const addText = (text, size, color = [220, 220, 220], isBold = false, indent = 0) => {
            doc.setFontSize(size);
            doc.setTextColor(...color);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, contentWidth - indent);
            doc.text(lines, margin + indent, y);
            y += lines.length * (size * 1.45);
        };

        const addSectionHeader = (label) => {
            y += 6;
            doc.setFillColor(45, 45, 55);
            doc.roundedRect(margin, y - 14, contentWidth, 22, 4, 4, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 220, 140);
            doc.text(label.toUpperCase(), margin + 10, y + 2);
            y += 18;
        };

        const addDivider = () => {
            doc.setDrawColor(60, 60, 75);
            doc.setLineWidth(0.5);
            doc.line(margin, y, W - margin, y);
            y += 14;
        };

        const checkPage = (needed = 60) => {
            if (y + needed > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // ── Header ───────────────────────────────────────────────────────────────
        doc.setFillColor(20, 20, 28);
        doc.rect(0, 0, W, 70, 'F');

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 197, 94);
        doc.text('BeatIT — Load Test Report', margin, 38);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(130, 130, 150);
        const stamp = new Date().toLocaleString();
        doc.text(`Generated: ${stamp}`, margin, 56);
        if (target) doc.text(`Target: ${target}`, margin + 280, 56);

        y = 90;

        // ── Metrics Summary ──────────────────────────────────────────────────────
        addSectionHeader('Metrics Summary');
        y += 4;

        const metricRows = [
            ['P50 Latency', metrics?.p50 != null ? `${metrics.p50} ms` : '—'],
            ['P95 Latency', metrics?.p95 != null ? `${metrics.p95} ms` : '—'],
            ['P99 Latency', metrics?.p99 != null ? `${metrics.p99} ms` : '—'],
            ['Throughput', metrics?.throughput != null ? `${metrics.throughput} req/s` : '—'],
            ['Error Rate', metrics?.errorRate != null ? `${metrics.errorRate} %` : '—'],
            ['Active Users', metrics?.activeUsers != null ? `${metrics.activeUsers}` : '—'],
        ];

        metricRows.forEach(([label, value], i) => {
            const rowY = y;
            if (i % 2 === 0) {
                doc.setFillColor(35, 35, 45);
                doc.rect(margin, rowY - 12, contentWidth, 22, 'F');
            }
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(160, 160, 180);
            doc.text(label, margin + 8, rowY + 2);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(220, 220, 220);
            doc.text(value, margin + contentWidth - 8, rowY + 2, { align: 'right' });
            y += 22;
        });

        y += 14;
        addDivider();

        // ── AI Diagnosis ─────────────────────────────────────────────────────────
        addSectionHeader('AI Diagnosis');
        y += 8;

        if (parsed) {
            // Root Cause
            checkPage(60);
            addText('Root Cause', 10, [100, 220, 140], true);
            addText(parsed.rootCause || '—', 10, [210, 210, 220], false, 8);
            y += 10;

            // Severity badge
            checkPage(40);
            addText('Severity', 10, [100, 220, 140], true);
            const sevColor =
                parsed.severity?.toLowerCase().includes('critical') || parsed.severity?.toLowerCase().includes('high')
                    ? [239, 68, 68]
                    : parsed.severity?.toLowerCase().includes('low')
                        ? [34, 197, 94]
                        : [234, 179, 8];
            doc.setFillColor(...sevColor);
            doc.roundedRect(margin + 8, y - 2, 80, 18, 4, 4, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text((parsed.severity || 'Unknown').toUpperCase(), margin + 48, y + 11, { align: 'center' });
            y += 28;

            // Fix
            checkPage(60);
            addText('Recommended Fix', 10, [100, 220, 140], true);
            (parsed.fix?.length ? parsed.fix : ['—']).forEach((item, i) => {
                checkPage(30);
                addText(`${i + 1}.  ${item}`, 10, [210, 210, 220], false, 8);
            });
            y += 10;

            // Risk
            checkPage(60);
            addText('Risk', 10, [100, 220, 140], true);
            addText(parsed.risk || '—', 10, [210, 210, 220], false, 8);
        } else {
            addText('No diagnosis available.', 10, [130, 130, 150]);
        }

        y += 20;
        addDivider();

        // ── Footer ───────────────────────────────────────────────────────────────
        const pageH = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('BeatIT · AI-Powered Load Testing', W / 2, pageH - 24, { align: 'center' });

        doc.save(`beatit-report-${Date.now()}.pdf`);
    };

    return { download };
}
