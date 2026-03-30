import { Metadata } from 'next';

import { Hero } from '@/components';

export const metadata: Metadata = {
  title: 'Gamers Core',
  description: 'Get your gaming Gear at the best price',
};

export default async function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
