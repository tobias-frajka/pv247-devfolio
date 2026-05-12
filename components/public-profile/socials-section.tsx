import { AtSign, Briefcase, Globe, Link as LinkIcon, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { SocialPlatform } from '@/db/schema';
import { safeHttpUrl, safeMailtoUrl } from '@/lib/safe-url';
import type { ProfileData } from '@/types/profile-data';

type Props = { socials: ProfileData['socials'] };

const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X',
  website: 'Website',
  email: 'Email'
};

function SocialIcon({ platform }: { platform: SocialPlatform }) {
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
  }
}

export function SocialsSection({ socials }: Props) {
  return (
    <section className="flex flex-col items-center gap-6 border-t border-[var(--hairline-soft)] pt-8">
      <div className="flex flex-wrap justify-center gap-2">
        {socials.map(s => {
          const isEmail = s.platform === 'email';
          const href = isEmail ? safeMailtoUrl(s.url) : safeHttpUrl(s.url);
          if (!href) return null;
          const linkProps = isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' };
          return (
            <Button
              key={s.platform}
              variant="secondary"
              size="sm"
              asChild
              className="text-[var(--ink-2)]"
            >
              <a href={href} title={s.platform} {...linkProps}>
                <SocialIcon platform={s.platform} />
                <span className="ml-1.5">{SOCIAL_LABEL[s.platform]}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
