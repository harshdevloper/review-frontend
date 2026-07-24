import type { AppDetails } from '@/types/app';
import type { Review } from '@/types/review';

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function baseFileName(app: AppDetails): string {
  return app.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '') || 'reviews';
}

const CSV_HEADERS = ['Username', 'Rating', 'Review', 'Date', 'Version', 'Helpful Count', 'Developer Reply', 'Language'];

function escapeCsvCell(value: string | number | null): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportCsv(app: AppDetails, reviews: Review[]): void {
  const rows = reviews.map((r) =>
    [r.userName, r.score, r.text, r.date, r.version ?? '', r.thumbsUp, r.replyText ?? '', r.language]
      .map(escapeCsvCell)
      .join(','),
  );
  const csv = [CSV_HEADERS.join(','), ...rows].join('\r\n');
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${baseFileName(app)}-reviews.csv`);
}

export function exportJson(app: AppDetails, reviews: Review[]): void {
  const payload = {
    app: {
      packageName: app.packageName,
      title: app.title,
      developer: app.developer,
      category: app.category,
      version: app.version,
      score: app.score,
      ratings: app.ratings,
    },
    exportedAt: new Date().toISOString(),
    reviewCount: reviews.length,
    reviews,
  };
  triggerDownload(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    `${baseFileName(app)}-reviews.json`,
  );
}

export async function exportPdf(app: AppDetails, reviews: Review[]): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(18);
  doc.text(`${app.title} — Review Report`, 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `Developer: ${app.developer}   ·   Category: ${app.category}   ·   Avg rating: ${app.score.toFixed(2)}   ·   Reviews: ${reviews.length}`,
    40,
    58,
  );
  doc.text(`Exported ${new Date().toLocaleString()}`, 40, 72);

  autoTable(doc, {
    startY: 88,
    head: [['User', 'Rating', 'Review', 'Date', 'Version', 'Helpful', 'Reply']],
    body: reviews.map((r) => [
      r.userName,
      `${r.score}★`,
      r.text,
      new Date(r.date).toLocaleDateString(),
      r.version ?? '—',
      String(r.thumbsUp),
      r.replyText ? 'Yes' : '—',
    ]),
    styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak', valign: 'top' },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 248, 252] },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 380 },
      3: { cellWidth: 70 },
      4: { cellWidth: 80 },
      5: { cellWidth: 45, halign: 'center' },
      6: { cellWidth: 40, halign: 'center' },
    },
  });

  doc.save(`${baseFileName(app)}-reviews.pdf`);
}
