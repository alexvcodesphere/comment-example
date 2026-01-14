"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Acme Corp - Enterprise Solutions</title>
      </head>
      <body>
        {/* Navigation */}
        <nav id="main-nav" className="navbar">
          <div className="nav-container">
            <Link href="/" className="logo">
              Acme<span>Corp</span>
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/" className={pathname === "/" ? "active" : ""}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={pathname === "/pricing" ? "active" : ""}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className={pathname === "/testimonials" ? "active" : ""}>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about" className={pathname === "/about" ? "active" : ""}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/demo" className={pathname === "/demo" ? "active" : ""}>
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="nav-cta">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Page Content */}
        <main className="page-container">
          {children}
        </main>

        {/* Footer */}
        <footer id="site-footer" className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="logo">
                Acme<span>Corp</span>
              </Link>
              <p>Building the infrastructure for tomorrow&apos;s applications.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <ul>
                <li><Link href="/">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 AcmeCorp. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
