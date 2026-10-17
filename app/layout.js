export const metadata = {
  title: 'Portal AD Madureira - Campo Goiatuba',
  description: 'Portal Oficial da Igreja Assembleia de Deus Ministério de Madureira - Campo de Goiatuba',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        {children}
      </body>
    </html>
  )
}
