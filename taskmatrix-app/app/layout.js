import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'TaskMatrix – Smart Project Management Tool',
  description:
    'Experience the art of focused work. A digital sanctuary where complex workflows become elegant symphonies.',
  keywords: 'project management, tasks, team collaboration, TaskMatrix',
  openGraph: {
    title: 'TaskMatrix – Smart Project Management Tool',
    description: 'Your projects, perfectly orchestrated.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
