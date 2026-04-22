export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 w-full py-14 lg:pt-20 flex flex-col gap-4">{children}</main>;
}
