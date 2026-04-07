import { TopBar } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopBar />

      <main className="flex-1 w-full pt-14">{children}</main>
    </>
  );
}
