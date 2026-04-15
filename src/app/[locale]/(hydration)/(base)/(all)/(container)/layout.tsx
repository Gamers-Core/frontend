export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 w-full py-20 flex flex-col gap-4 md:container px-4">{children}</main>;
}
