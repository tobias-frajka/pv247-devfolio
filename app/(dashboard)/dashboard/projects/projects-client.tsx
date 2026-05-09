'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { projectSchema } from '@/schemas/project';
import { improveDescription } from '@/server-actions/ai';
import { createProject, deleteProject, updateProject } from '@/server-actions/project';

// Strip .default([]) from techStack so the form type has techStack: string[] (not optional)
const projectFormSchema = projectSchema.extend({
  techStack: z.array(z.string().trim().min(1).max(40)).max(20)
});
type ProjectFormValues = z.infer<typeof projectFormSchema>;

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
};

type Props = { projects: Project[] };

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');

  const add = () => {
    const tag = input.trim();
    if (tag && !value.some(t => t.toLowerCase() === tag.toLowerCase()) && value.length < 20) {
      onChange([...value, tag]);
      setInput('');
    }
  };

  return (
    <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-[38px] flex-wrap gap-1.5 rounded-md border bg-transparent px-3 py-2 text-sm focus-within:ring-[3px]">
      {value.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded bg-[var(--paper-3)] px-2 py-0.5 text-xs"
        >
          {tag}
          <button
            type="button"
            className="text-[var(--ink-3)] hover:text-[var(--ink)]"
            onClick={() => onChange(value.filter(t => t !== tag))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
          if (e.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        placeholder={value.length === 0 ? 'React, TypeScript… (Enter to add)' : 'Add more…'}
        disabled={value.length >= 20}
        className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent outline-none"
      />
    </div>
  );
}

function ProjectDialogForm({
  initial,
  onSave,
  onCancel,
  isPending,
  error
}: {
  initial: Project | null;
  onSave: (data: ProjectFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  error: Error | null;
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      techStack: initial?.techStack ?? [],
      githubUrl: initial?.githubUrl ?? '',
      liveUrl: initial?.liveUrl ?? ''
    }
  });

  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors }
  } = form;

  const techStack = useWatch({ control, name: 'techStack' });

  const improveMutation = useMutation({
    mutationFn: improveDescription,
    onSuccess: result => setValue('description', result ?? '')
  });

  const onSubmit = form.handleSubmit(data => onSave(data));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proj-title">Title</Label>
        <Input id="proj-title" placeholder="My Project" {...register('title')} />
        <FormError>{errors.title?.message}</FormError>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="proj-description">Description</Label>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={improveMutation.isPending}
            onClick={() =>
              improveMutation.mutate({
                title: getValues('title') || 'Project',
                techStack: getValues('techStack') ?? [],
                description: getValues('description') || ''
              })
            }
          >
            {improveMutation.isPending ? 'Improving…' : 'Improve with AI'}
          </Button>
        </div>
        <Textarea
          id="proj-description"
          rows={4}
          placeholder="What does this project do?"
          className={improveMutation.isPending ? 'opacity-60' : ''}
          {...register('description')}
        />
        {improveMutation.isError && <FormError>AI unavailable — try again in a moment</FormError>}
        <FormError>{errors.description?.message}</FormError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tech stack</Label>
        <TagInput value={techStack ?? []} onChange={v => setValue('techStack', v)} />
        <FormError>{errors.techStack?.message}</FormError>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proj-github">GitHub URL</Label>
          <Input
            id="proj-github"
            type="url"
            placeholder="https://github.com/…"
            {...register('githubUrl')}
          />
          <FormError>{errors.githubUrl?.message}</FormError>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proj-live">Live URL</Label>
          <Input id="proj-live" type="url" placeholder="https://…" {...register('liveUrl')} />
          <FormError>{errors.liveUrl?.message}</FormError>
        </div>
      </div>

      <FormError className="text-sm">{error?.message}</FormError>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : initial ? 'Update project' : 'Add project'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProjectsClient({ projects }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => router.refresh()
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      editingId,
      data
    }: {
      editingId: string | null;
      data: ProjectFormValues;
    }) => {
      if (editingId) {
        await updateProject(editingId, data);
      } else {
        await createProject(data);
      }
    },
    onSuccess: () => {
      router.refresh();
      setDialogOpen(false);
    }
  });

  const openAdd = () => {
    saveMutation.reset();
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    saveMutation.reset();
    setEditing(p);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) saveMutation.reset();
    setDialogOpen(open);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Projects
        </h1>
        <Button onClick={openAdd}>Add project</Button>
      </div>

      {projects.length === 0 ? (
        <div
          className="rounded-lg border border-dashed border-[var(--hairline)] p-10 text-center"
          style={{ color: 'var(--ink-3)' }}
        >
          <p className="m-0 text-sm">No projects yet. Add your first one.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {projects.map(p => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <p className="m-0 text-sm font-medium">{p.title}</p>
                <p className="m-0 line-clamp-2 text-xs" style={{ color: 'var(--ink-2)' }}>
                  {p.description}
                </p>
                {p.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map(tag => (
                      <span
                        key={tag}
                        className="rounded bg-[var(--paper-3)] px-2 py-0.5 text-xs"
                        style={{ color: 'var(--ink-2)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: 'var(--ink-3)' }}
                    >
                      <LinkIcon size={12} /> GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: 'var(--ink-3)' }}
                    >
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={deleteMutation.isPending && deleteMutation.variables === p.id}
                  onClick={() => deleteMutation.mutate(p.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DialogRoot open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit project' : 'Add project'}</DialogTitle>
          </DialogHeader>
          <ProjectDialogForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSave={data => saveMutation.mutate({ editingId: editing?.id ?? null, data })}
            onCancel={() => handleDialogOpenChange(false)}
            isPending={saveMutation.isPending}
            error={saveMutation.error}
          />
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
