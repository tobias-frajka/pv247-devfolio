'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { FormError } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usernameSchema } from '@/schemas/username';
import { deleteAccount, signOutAction } from '@/server-actions/account';
import { changeUsername } from '@/server-actions/username';

type Props = {
  currentUsername: string;
  email: string;
};

export function SettingsClient({ currentUsername, email }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Settings
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
          Manage your account.
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <AccountSection currentUsername={currentUsername} />
        <SessionSection email={email} />
        <DangerSection currentUsername={currentUsername} />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  tone = 'default',
  children
}: {
  title: string;
  tone?: 'default' | 'danger';
  children: React.ReactNode;
}) {
  const borderClass =
    tone === 'danger' ? 'border-[var(--danger)]/40' : 'border-[var(--hairline-soft)]';
  return (
    <section className={`rounded-lg border ${borderClass} bg-[var(--paper-2)] p-5`}>
      <h2
        className="m-0 mb-3"
        style={{ fontSize: 'var(--t-xl)', fontWeight: 500, letterSpacing: '-0.012em' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// account section

const accountFormSchema = z.object({ username: usernameSchema });
type AccountFormValues = z.infer<typeof accountFormSchema>;

type ChangeStatus =
  | { kind: 'idle' }
  | { kind: 'confirming'; from: string; to: string }
  | { kind: 'submitting'; from: string; to: string }
  | { kind: 'saved' }
  | { kind: 'no-change' }
  | { kind: 'error'; code: 'taken' | 'invalid' | 'unknown' };

type ChangeErrorCode = Extract<ChangeStatus, { kind: 'error' }>['code'];

const changeErrorCopy: Record<ChangeErrorCode, string> = {
  taken: 'That username is taken — pick another.',
  invalid: "That username isn't valid.",
  unknown: 'Something went wrong — try again.'
};

function AccountSection({ currentUsername }: { currentUsername: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<ChangeStatus>({ kind: 'idle' });
  const [isPending, startTransition] = useTransition();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { username: currentUsername }
  });

  const {
    register,
    formState: { errors }
  } = form;

  // auto-clear transient confirmations after 2s
  useEffect(() => {
    if (status.kind !== 'saved' && status.kind !== 'no-change') return;
    const t = setTimeout(() => setStatus({ kind: 'idle' }), 2000);
    return () => clearTimeout(t);
  }, [status.kind]);

  const onSubmit = form.handleSubmit(({ username }) => {
    if (username === currentUsername) {
      setStatus({ kind: 'no-change' });
      return;
    }
    setStatus({ kind: 'confirming', from: currentUsername, to: username });
  });

  const handleConfirm = () => {
    if (status.kind !== 'confirming') return;
    const { from, to } = status;
    setStatus({ kind: 'submitting', from, to });
    startTransition(async () => {
      const result = await changeUsername(to);
      if (result.ok) {
        setStatus({ kind: 'saved' });
        form.reset({ username: to });
        router.refresh();
        return;
      }
      setStatus({ kind: 'error', code: result.code });
    });
  };

  const closeDialog = () => {
    if (status.kind === 'submitting') return;
    setStatus({ kind: 'idle' });
  };

  const dialogOpen = status.kind === 'confirming' || status.kind === 'submitting';

  return (
    <SectionCard title="Account">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="off" spellCheck={false} {...register('username')} />
          <p className="m-0 text-xs" style={{ color: 'var(--ink-3)' }}>
            3–20 chars, lowercase letters, digits, hyphens. Must start with a letter.
          </p>
          <p className="m-0 text-xs" style={{ color: 'var(--warn)' }}>
            Changing your username breaks any existing links to{' '}
            <span className="font-mono">/{currentUsername}</span>.
          </p>
          <FormError>{errors.username?.message}</FormError>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            Save username
          </Button>
          {status.kind === 'saved' && (
            <span className="text-sm" style={{ color: 'var(--accent)' }}>
              Saved
            </span>
          )}
          {status.kind === 'no-change' && (
            <span className="text-sm" style={{ color: 'var(--ink-2)' }}>
              No changes
            </span>
          )}
          {status.kind === 'error' && (
            <FormError className="text-sm">{changeErrorCopy[status.code]}</FormError>
          )}
        </div>
      </form>

      <DialogRoot open={dialogOpen} onOpenChange={open => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm username change</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm" style={{ color: 'var(--ink-2)' }}>
              You&apos;re changing:
            </p>
            {(status.kind === 'confirming' || status.kind === 'submitting') && (
              <p className="m-0 font-mono text-sm">
                /{status.from} → /{status.to}
              </p>
            )}
            <p className="m-0 text-sm" style={{ color: 'var(--warn)' }}>
              Old links to{' '}
              <span className="font-mono">
                /{status.kind === 'confirming' || status.kind === 'submitting' ? status.from : ''}
              </span>{' '}
              will stop working.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={closeDialog}
              disabled={status.kind === 'submitting'}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={status.kind === 'submitting'}>
              {status.kind === 'submitting' ? 'Changing…' : 'Yes, change it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </SectionCard>
  );
}

// session section

function SessionSection({ email }: { email: string }) {
  return (
    <SectionCard title="Session">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm" style={{ color: 'var(--ink-2)' }}>
          Signed in as <span className="font-mono">{email}</span>
        </p>
        <form action={signOutAction}>
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </div>
    </SectionCard>
  );
}

// danger zone section

type DeleteStatus =
  | { kind: 'idle' }
  | { kind: 'open' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string };

function DangerSection({ currentUsername }: { currentUsername: string }) {
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<DeleteStatus>({ kind: 'idle' });
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // autofocus the type-to-confirm input when the dialog opens
  useEffect(() => {
    if (status.kind === 'open') {
      // defer to next frame so the dialog has mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [status.kind]);

  const open = () => {
    setTyped('');
    setStatus({ kind: 'open' });
  };

  const close = () => {
    if (status.kind === 'submitting') return;
    setStatus({ kind: 'idle' });
  };

  const handleDelete = () => {
    if (typed !== currentUsername) return;
    setStatus({ kind: 'submitting' });
    startTransition(async () => {
      try {
        await deleteAccount();
        // deleteAccount() calls redirect('/') — control should not return here
      } catch (e) {
        if (e instanceof Error && 'digest' in e && String(e.digest).startsWith('NEXT_')) {
          throw e;
        }
        setStatus({
          kind: 'error',
          message: "Couldn't delete the account — try again in a moment."
        });
      }
    });
  };

  const dialogOpen =
    status.kind === 'open' || status.kind === 'submitting' || status.kind === 'error';
  const destructiveDisabled =
    typed !== currentUsername || status.kind === 'submitting' || isPending;

  return (
    <SectionCard title="Danger zone" tone="danger">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm" style={{ color: 'var(--ink-2)' }}>
          Permanently deletes your portfolio and frees{' '}
          <span className="font-mono">/{currentUsername}</span> for someone else to claim. This
          can&apos;t be undone.
        </p>
        <Button type="button" variant="destructive" onClick={open} className="self-start">
          Delete account
        </Button>
      </div>

      <DialogRoot open={dialogOpen} onOpenChange={o => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm" style={{ color: 'var(--ink-2)' }}>
              This permanently removes:
            </p>
            <ul
              className="m-0 flex list-disc flex-col gap-1 pl-5 text-sm"
              style={{ color: 'var(--ink-2)' }}
            >
              <li>your profile (name, headline, bio, avatar)</li>
              <li>your projects, skills, experience, socials</li>
              <li>
                your <span className="font-mono">/{currentUsername}</span> URL (becomes available to
                others)
              </li>
            </ul>
            <p className="m-0 text-sm" style={{ color: 'var(--danger)' }}>
              This can&apos;t be undone.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delete-confirm">
                Type <span className="font-mono">{currentUsername}</span> to confirm:
              </Label>
              <Input
                id="delete-confirm"
                ref={inputRef}
                value={typed}
                onChange={e => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                disabled={status.kind === 'submitting'}
              />
            </div>
            {status.kind === 'error' && <FormError>{status.message}</FormError>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={close}
              disabled={status.kind === 'submitting'}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={destructiveDisabled}
            >
              {status.kind === 'submitting' ? 'Deleting…' : 'Delete account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </SectionCard>
  );
}
