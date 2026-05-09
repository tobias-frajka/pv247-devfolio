'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { createExperience, deleteExperience, updateExperience } from '@/server-actions/experience';

type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
};

type Props = { experiences: Experience[] };

const formSchema = z
  .object({
    company: z.string().min(1, 'Required').max(120),
    role: z.string().min(1, 'Required').max(120),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string(),
    currentlyWorking: z.boolean(),
    description: z.string().max(2000).optional().or(z.literal(''))
  })
  .refine(v => v.currentlyWorking || !!v.endDate, {
    path: ['endDate'],
    message: 'End date is required'
  })
  .refine(v => v.currentlyWorking || !v.endDate || v.endDate >= v.startDate, {
    path: ['endDate'],
    message: 'End date must be after start date'
  });

type FormValues = z.infer<typeof formSchema>;

function toDateString(d: Date | null | undefined) {
  if (!d) return '';
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatRange(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(start)} — ${end ? fmt(end) : 'Present'}`;
}

function ExperienceDialogForm({
  initial,
  onSave,
  onCancel
}: {
  initial: Experience | null;
  onSave: (data: {
    company: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    description?: string;
  }) => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: initial?.company ?? '',
      role: initial?.role ?? '',
      startDate: toDateString(initial?.startDate),
      endDate: toDateString(initial?.endDate),
      currentlyWorking: !initial?.endDate,
      description: initial?.description ?? ''
    }
  });

  const {
    register,
    setValue,
    control,
    formState: { errors }
  } = form;
  const currentlyWorking = useWatch({ control, name: 'currentlyWorking' });

  const onSubmit = form.handleSubmit(async data => {
    setSaving(true);
    setSaveError(null);
    try {
      await onSave({
        company: data.company,
        role: data.role,
        startDate: fromDateString(data.startDate),
        endDate: data.currentlyWorking ? null : data.endDate ? fromDateString(data.endDate) : null,
        description: data.description
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-company">Company</Label>
          <Input id="exp-company" placeholder="Acme Corp" {...register('company')} />
          {errors.company && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              {errors.company.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-role">Role</Label>
          <Input id="exp-role" placeholder="Software Engineer" {...register('role')} />
          {errors.role && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              {errors.role.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-start">Start date</Label>
          <Input id="exp-start" type="date" {...register('startDate')} />
          {errors.startDate && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-end">End date</Label>
          <Input id="exp-end" type="date" disabled={currentlyWorking} {...register('endDate')} />
          {errors.endDate && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="border-input accent-primary h-4 w-4 rounded"
          {...register('currentlyWorking')}
          onChange={e => {
            if (e.target.checked) setValue('endDate', '');
          }}
        />
        Currently working here
      </label>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="exp-desc">Description</Label>
        <Textarea
          id="exp-desc"
          rows={3}
          placeholder="What did you work on? (optional)"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs" style={{ color: 'var(--danger)' }}>
            {errors.description.message}
          </p>
        )}
      </div>

      {saveError && (
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          {saveError}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Update' : 'Add experience'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ExperienceClient({ experiences }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => router.refresh()
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (e: Experience) => {
    setEditing(e);
    setDialogOpen(true);
  };

  const handleSave = async (data: Parameters<typeof createExperience>[0]) => {
    if (editing) {
      await updateExperience(editing.id, data);
    } else {
      await createExperience(data);
    }
    router.refresh();
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Experience
        </h1>
        <Button onClick={openAdd}>Add experience</Button>
      </div>

      {experiences.length === 0 ? (
        <div
          className="rounded-lg border border-dashed border-[var(--hairline)] p-10 text-center"
          style={{ color: 'var(--ink-3)' }}
        >
          <p className="m-0 text-sm">No experience yet. Add your first role.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {experiences.map(exp => (
            <li
              key={exp.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="m-0 text-sm font-medium">{exp.role}</p>
                <p className="m-0 text-sm" style={{ color: 'var(--ink-2)' }}>
                  {exp.company}
                </p>
                <p className="m-0 text-xs" style={{ color: 'var(--ink-3)' }}>
                  {formatRange(exp.startDate, exp.endDate)}
                </p>
                {exp.description && (
                  <p className="m-0 mt-1 line-clamp-2 text-xs" style={{ color: 'var(--ink-2)' }}>
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(exp)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={deleteMutation.isPending && deleteMutation.variables === exp.id}
                  onClick={() => deleteMutation.mutate(exp.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit experience' : 'Add experience'}</DialogTitle>
          </DialogHeader>
          <ExperienceDialogForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSave={handleSave}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
