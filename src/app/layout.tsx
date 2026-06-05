import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../index.css';
import AuthProvider from '../components/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mohikontok Sound Lab | Recording Studio, Rehearsal Space & Audio Services | Bronx, NY',
  description: 'Mohikontok Sound Lab in Bronx, NY offers professional audio recording, high-fidelity mixing & mastering, global music distribution (ISRC/UPC codes), and premium sound equipment rentals.',
  icons: {
    icon: '/pics/LOGO WHITE.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
