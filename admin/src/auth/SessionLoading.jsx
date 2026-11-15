import { LoaderCircle } from 'lucide-react';

export default function SessionLoading() {
  return <div className="flex min-h-dvh items-center justify-center gap-3 bg-dark-900 text-sm text-gray-400" role="status"><LoaderCircle size={19} className="animate-spin text-primary-400" aria-hidden="true" />Checking your session…</div>;
}
