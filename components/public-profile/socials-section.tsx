import { AtSign, Briefcase, ExternalLink, Globe, Link as LinkIcon, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ProfileData } from '@/types/profile-data';

type Props = { socials: ProfileData['socials'] };

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'github':
      return <LinkIcon size={16} />;
    case 'x':
      return <AtSign size={16} />;
    case 'linkedin':
      return <Briefcase size={16} />;
    case 'email':
      return <Mail size={16} />;
    case 'website':
      return <Globe size={16} />;
    default:
      return <ExternalLink size={16} />;
  }
}

export function SocialsSection({ socials }: Props) {
  return (
    <section className="flex flex-col items-center gap-6 border-t border-[var(--hairline-soft)] pt-8">
      <div className="flex flex-wrap justify-center gap-2">
        {socials.map(s => (
          <Button
            key={s.platform}
            variant="secondary"
            size="sm"
            asChild
            className="text-[var(--ink-2)]"
          >
            <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.platform}>
              <SocialIcon platform={s.platform} />
              <span className="ml-1.5 capitalize">{s.platform === 'x' ? 'X' : s.platform}</span>
            </a>
          </Button>
        ))}
      </div>
    </section>
  );
}
