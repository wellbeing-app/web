# Wellbeing.

A premium, modern wellbeing platform landing page designed with an "Apple-style" aesthetics. This project features a unique Rolodex-style stacked card navigation, glassmorphism design elements, and a robust internationalization system.

## ✨ Features

- **Apple-Inspired UI**: Premium stacked card navigation with scroll-driven scale and blur effects.
- **Glassmorphism Design**: Sleek, semi-transparent UI elements with backdrop filters and smooth theme transitions.
- **Internationalization (i18n)**: Full support for English (`en`) and Czech (`cs`) routes with dictionary-based content management.
- **Strict Security**: Per-request CSP nonces, strict-dynamic script handling, and automated violation reporting.
- **Premium Aesthetics**: Tailwind 4 based design system with custom animations and harmonious color palettes.
- **Responsive & Accessible**: Optimized for all devices with a focus on semantic HTML and accessibility standards.

## 🚀 Tech Stack

- **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Playwright](https://playwright.dev/) (E2E), [Vitest](https://vitest.dev/) (Unit)
- **UI Docs**: [Storybook](https://storybook.js.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🔐 Environment Variables

The project is designed to be deployment-ready with minimal configuration. Currently, it uses standard environment variables:

- `NODE_ENV`: Set to `development` or `production` to toggle security policies (e.g., CSP `unsafe-inline` is only allowed in dev).

## 🧪 Testing

### E2E Testing (Playwright)
Run the end-to-end tests:
```bash
npm run test:e2e
```

### Unit Testing (Vitest)
Unit testing is supported via Vitest. To run tests:
```bash
npx vitest
```

### UI Testing (Storybook)
View component documentation:
```bash
npm run storybook
```

## 🌍 Language Support

Content is managed via localized dictionaries in `dictionaries/`.
- `en.json`: English content
- `cs.json`: Czech content

The routing is handled by a custom `proxy.ts` middleware that manages locale detection via headers and cookies.

## 📦 Deployment

The app is optimized for deployment on [Vercel](https://vercel.com/):

```bash
npm run build
```

The build process will generate a production-ready bundle with optimized images and a strict CSP.

---

Built with ❤️ for the future of wellbeing.
