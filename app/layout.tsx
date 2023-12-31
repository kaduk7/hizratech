"use client"
import { usePathname } from 'next/navigation'
import Template from './component/Template'
import Provider from './component/Provider'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <html lang="id">
      <body>
        <Provider>
          {pathname == "/login" ? <>{children}</> : <Template>{children}</Template>}
          <SpeedInsights />
        </Provider>
      </body>
    </html>
  )
}
