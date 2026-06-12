export const metadata = {
  title: "Memória Viva — Preview",
  description: "Projeto standalone para preview visual do redesign.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
