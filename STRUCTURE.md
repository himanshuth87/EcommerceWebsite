# Project Structure - Priority Bags

## Overview
Priority Bags is a premium luggage e-commerce platform built with React for the frontend, Express/Node.js for the backend, and Supabase as the database. It is designed to be hosted on Vercel.

## Directory Structure

- `/src`: Frontend React application.
  - `/components`: Reusable UI components.
  - `/context`: React context for state management (e.g., Auth, Cart).
  - `/hooks`: Custom React hooks.
  - `/pages`: Page-level components.
  - `/styles`: Global and component-specific CSS.
  - `App.jsx`: Main application component and routing.
  - `main.jsx`: Entry point for React.
- `/server-src`: Backend logic and controllers.
# Priority Bags — Project Structure & Roadmap

## 🏗 Technology Stack
- **Frontend**: React (Vite), Framer Motion, Vanilla CSS (The Digital Atelier DS)
- **Backend**: Node.js, Express, Supabase (Database/Auth)
- **Payments**: Razorpay Integration
- **Deployment**: Vercel

## 🎨 Design System: "The Digital Atelier"
- **Aesthetic**: Cinematic Minimalism / Dark-Mode Foundation.
- **Typography**: Noto Serif (Headlines), Inter (Body).
- **Core Rules**:
  - No 1px solid borders; use tonal shifts (`surface-container-low` vs `background`).
  - 0px corner-radius (Absolute sharp corners).
  - Glassmorphism for overlays and floating components.
  - Asymmetrical grid layouts.

## 🚀 Production Readiness Roadmap

### Phase 1: Core Experience (In Progress)
- [x] Initial Codebase Analysis
- [x] Design System Definition via Stitch
- [x] Premium Homepage Rewrite (Framer Motion)
- [x] Global Layout Overhaul (Navbar/Footer/Skins)
- [x] SEO Optimization & Meta Tags

### Phase 2: Functional Excellence
- [ ] Skeleton Loading State implementation (Defined in globals.css)
- [ ] Error Boundary & Global Catch mechanism
- [ ] Cart Drawer & Checkout UX polishing
- [ ] Responsive refinement for ultra-wide & small mobile screens

### Phase 3: Deployment & Hardening
- [ ] API Quota & Rate Limit handling
- [ ] Final Razorpay flow validation
- [ ] Vercel Build Optimization
- [ ] Performance Audit (Lighthouse)

## 📁 Key Directories
- `/src/pages`: Main view components (Home, Products, etc.)
- `/src/components`: UI Atomic components (ProductCard, Navbar)
- `/src/styles`: Theme tokens and global base styles
- `/api`: Express backend endpoints
