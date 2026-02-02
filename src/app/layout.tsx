import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skillmetter - TryHackMe Profile Comparison',
  description: 'Compare TryHackMe profiles and discover who dominates the cyber arena. Analyze skills, compete, and claim your cyber title!',
  keywords: ['TryHackMe', 'cybersecurity', 'hacking', 'CTF', 'profile comparison', 'cyber skills'],
  authors: [{ name: 'Skillmetter' }],
  openGraph: {
    title: 'Skillmetter - TryHackMe Profile Comparison',
    description: 'Compare TryHackMe profiles and discover who dominates the cyber arena!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="cyber-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
