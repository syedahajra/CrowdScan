// import "./global.css"
import "./globals.css";
export const metadata = {
  title: "Crowd Scan",
  description: "Facial recognition system for law enforcement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
