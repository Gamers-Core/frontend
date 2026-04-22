export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 w-full pt-14 pb-8 flex flex-col gap-4">{children}</main>;
}
