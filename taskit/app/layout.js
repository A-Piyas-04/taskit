import './globals.css';

export const metadata = {
  title: 'TaskIt',
  description: 'Cyberpunk Task Manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
