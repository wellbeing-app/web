import type { NextConfig } from "next";

// Suppress: Server does not contain a TLS configuration for cipher suite order
// This is a standard Next.js app with no custom server. TLS is handled by the
// deployment platform (Vercel) or a reverse proxy, not the Next.js server.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Removed 'unsafe-inline' and 'unsafe-eval' from script-src.
            // Removed 'unsafe-inline' from style-src.
            // These were only needed for development features (Storybook) and
            // inline styles in dev. Production uses Tailwind CSS classes.
            value:
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https: data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
