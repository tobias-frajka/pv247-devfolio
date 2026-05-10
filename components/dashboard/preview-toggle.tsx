'use client';

import { Eye, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';

export type PreviewMode = 'edit' | 'preview';

type Props = {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
};

export function PreviewToggle({ mode, onChange }: Props) {
  const next: PreviewMode = mode === 'edit' ? 'preview' : 'edit';
  const Icon = mode === 'edit' ? Eye : Pencil;
  const label = mode === 'edit' ? 'Preview' : 'Back to edit';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onChange(next)}
      aria-pressed={mode === 'preview'}
    >
      <Icon size={14} />
      <span className="ml-1.5">{label}</span>
    </Button>
  );
}
