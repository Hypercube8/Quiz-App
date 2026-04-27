import AppNavbar from "@/components/app-navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return ( 
    <div className="flex flex-col w-full h-full min-h-screen">
      <AppNavbar />
      <main className="w-full h-full min-h-full">
        {children}
      </main>
    </div>
  )
}
