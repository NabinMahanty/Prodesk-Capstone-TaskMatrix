import './globals.css';
import AuthProvider from '@/components/AuthProvider';

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
