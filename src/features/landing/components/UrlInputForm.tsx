import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidPlayStoreInput } from '@/lib/parsePlayStoreUrl';

const formSchema = z.object({
  url: z
    .string()
    .min(1, 'Paste a Google Play Store URL to get started.')
    .refine(isValidPlayStoreInput, 'That doesn\'t look like a valid Play Store app URL.'),
});

type FormValues = z.infer<typeof formSchema>;

export function UrlInputForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (url: string) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      onSubmit={handleSubmit((values) => onSubmit(values.url))}
      className="mx-auto w-full max-w-2xl"
      noValidate
    >
      <div className="glass-strong flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <Search className="size-4.5 shrink-0 text-muted-foreground" />
          <Input
            {...register('url')}
            placeholder="https://play.google.com/store/apps/details?id=com.whatsapp"
            className="h-12 border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
            disabled={isSubmitting}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 shrink-0 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 px-6 font-medium text-white shadow-lg shadow-blue-500/25 hover:brightness-110"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Fetching...
            </>
          ) : (
            <>
              Fetch Reviews <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
      {errors.url ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 pl-2 text-sm text-destructive"
        >
          {errors.url.message}
        </motion.p>
      ) : (
        <p className="mt-2.5 pl-2 text-sm text-muted-foreground">
          Works with any public app on the Google Play Store.
        </p>
      )}
    </motion.form>
  );
}
