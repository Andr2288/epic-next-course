type TStrapiError = {
  status: number;
  name: string;
  message: string;
  details?: Record<string, string[]>;
};

interface IStrapiErrorsProps {
  error?: TStrapiError | null;
}

export function StrapiErrors({ error }: IStrapiErrorsProps) {
  if (!error?.message) return null;
  return (
    <div className="py-2 text-md italic text-pink-500">{error.message}</div>
  );
}
