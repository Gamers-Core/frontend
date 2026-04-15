export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 w-full py-16 flex flex-col gap-4 md:container">{children}</main>;
}
