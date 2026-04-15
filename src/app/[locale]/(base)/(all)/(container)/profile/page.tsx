import { Metadata } from 'next';

import { ProfileHeader } from '@/components';

export const metadata: Metadata = {
  title: 'Gamers Core | Profile',
  description: 'Access and manage your Gamers Core profile, view your order history, and update your account settings.',
};

export default async function Page() {
  return (
    <>
      <ProfileHeader />
    </>
  );
}
