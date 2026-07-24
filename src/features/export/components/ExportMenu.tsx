import { useState } from 'react';
import { toast } from 'sonner';
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadExcelExport } from '@/api/export.api';
import { exportCsv, exportJson, exportPdf } from '../utils/exporters';
import { ApiError } from '@/api/client';
import type { AppDetails } from '@/types/app';
import type { Review } from '@/types/review';

export function ExportMenu({
  app,
  reviews,
  filteredCount,
}: {
  app: AppDetails;
  reviews: Review[];
  filteredCount: number;
}) {
  const [busy, setBusy] = useState<null | string>(null);

  const run = async (format: string, count: number, action: () => Promise<void> | void) => {
    setBusy(format);
    try {
      await action();
      toast.success(`Exported ${count.toLocaleString()} reviews to ${format}`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : `Failed to export ${format}.`;
      toast.error(message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5 rounded-xl" disabled={busy !== null}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Export your {filteredCount.toLocaleString()} filtered reviews
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => run('Excel', filteredCount, () => downloadExcelExport(app, reviews))}>
          <FileSpreadsheet className="size-4 text-emerald-400" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run('CSV', filteredCount, () => exportCsv(app, reviews))}>
          <Table2 className="size-4 text-sky-400" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run('JSON', filteredCount, () => exportJson(app, reviews))}>
          <FileJson className="size-4 text-amber-400" />
          JSON (.json)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run('PDF', filteredCount, () => exportPdf(app, reviews))}>
          <FileText className="size-4 text-rose-400" />
          PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
