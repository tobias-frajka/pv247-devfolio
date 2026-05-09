import { requireUsername } from '@/lib/dal';

import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const session = await requireUsername();
  return <SettingsClient currentUsername={session.user.username} email={session.user.email} />;
}
