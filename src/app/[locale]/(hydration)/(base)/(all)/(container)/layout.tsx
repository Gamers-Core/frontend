export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 w-full pt-20 pb-14 flex flex-col gap-4 md:container px-4">{children}</main>;
}
