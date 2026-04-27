export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      <main className="w-full h-full min-h-full">
        {children}
      </main>
    </div>
  )
}