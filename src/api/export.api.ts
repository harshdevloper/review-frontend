import { apiPostBlob } from './client';
import type { AppDetails } from '@/types/app';
import type { Review } from '@/types/review';

// Sends the reviews the client already holds so the export is stateless — it
// never depends on the server cache and always matches the on-screen data.
export async function downloadExcelExport(app: AppDetails, reviews: Review[]): Promise<void> {
  const payload = {
    app: {
      title: app.title,
      developer: app.developer,
      category: app.category,
      version: app.version,
      installs: app.installs,
      score: app.score,
      ratings: app.ratings,
    },
    reviews: reviews.map((r) => ({
      userName: r.userName,
      score: r.score,
      text: r.text,
      date: r.date,
      version: r.version,
      thumbsUp: r.thumbsUp,
      replyText: r.replyText,
      language: r.language,
    })),
  };

  const { blob, fileName } = await apiPostBlob('/export/excel', payload);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
