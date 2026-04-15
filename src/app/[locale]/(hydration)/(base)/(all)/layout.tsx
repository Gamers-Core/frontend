import { TopBar } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopBar />

      {children}
    </>
  );
}
