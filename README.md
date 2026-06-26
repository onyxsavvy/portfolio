# OnyxSavvy — Premium Creative Agency Portfolio

OnyxSavvy is a high-end web development and design agency portfolio. This repository contains the source code for the agency's primary digital touchpoint—a high-performance, immersive landing page built to turn visitors into active clients.

🌐 **Live Website:** [https://savvyonyx.vercel.app](https://savvyonyx.vercel.app)

---

## 🎯 The Client Acquisition Funnel
This portfolio is engineered as an active lead generation pipeline:
1. **Immersive Hook**: Interactive 3D workspace (Three.js) and sleek layout design to establish immediate visual credibility.
2. **Value Demonstration**: High-performance interactive scroll effects (GSAP + ScrollTrigger) highlighting past agency projects and metrics.
3. **Low-Friction Contact**: In-app Calendly booking modal and Web3Forms email pipeline to capture leads instantly without external redirects.

---

## 💼 Core Agency Services
The website highlights OnyxSavvy's key agency offerings:
- **Website Development**: High-performance, tailored, and scalable brand websites.
- **Landing Pages**: Optimized high-conversion landing pages built for campaign success.
- **SaaS Products**: Scalable, custom software-as-a-service platforms.
- **Dashboards**: Sleek admin panels with complex data visualizations.
- **Full Stack Apps**: End-to-end applications powered by modern, secure architectures.
- **Maintenance & Support**: Ongoing speed tuning, security auditing, and updates.

---

## 🚀 Professional Tech Stack

- **Framework**: React 19 + TypeScript + Vite (optimized build pipelines)
- **Styling & UI**: Tailwind CSS (flexible, utility-first design tokens) + Radix UI (accessible, unstyled primitives)
- **Fluid Motion**: GSAP (GreenSock) for timelines & scroll-driven motion orchestration
- **3D Graphics**: Three.js WebGL rendering for the interactive developer desktop
- **Kinetic Scroll**: Lenis for modern, high-precision momentum scrolling
- **Backend Integrations**: Web3Forms for secure, serverless form processing

---

## 🛠️ Developer Setup & Deployment

### 1. Installation
Clone the repository and install the production dependencies:
```bash
npm install
```

### 2. Local Development
Spin up the dev server on port `3000`:
```bash
npm run dev
```
Access the project locally at [http://localhost:3000](http://localhost:3000).

### 3. Production Compilation
Generate the minified, asset-optimized static build (output to `/dist`):
```bash
npm run build
```

---

## ⚙️ Configuration Variables

To connect this portfolio to your active agency accounts, customize the following endpoints in the codebase:

- **Calendly Scheduler**: Add your agency's Calendly username and active event type slug to your `.env` file:
  ```env
  VITE_CALENDLY_USERNAME=YOUR_CALENDLY_USERNAME_HERE
  VITE_CALENDLY_EVENT_TYPE=30min
  ```
- **Contact Forms**: Add your Web3Forms access key to your `.env` file to route client messages directly to your inbox:
  ```env
  VITE_WEB3FORMS_ACCESS_KEY=YOUR_WEB3FORMS_ACCESS_KEY_HERE
  ```
