import AppNavbar from "@/components/app-navbar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return ( 
    <div className="flex flex-col w-full h-full min-h-screen">
      <Toaster />
      <AppNavbar />
      <main className="w-full h-full min-h-full">
        {children}
      </main>
    </div>
  )
}
