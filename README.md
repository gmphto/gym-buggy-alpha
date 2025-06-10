# Gym Buddy MVP

A Next.js application for finding workout partners at local gyms. Built with TypeScript, React Hook Form, Zod validation, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks
- **UI Components**: shadcn/ui + Radix UI primitives

## Architecture

This project follows a strict domain-driven architecture with lens-based organization:

### Domain Structure

```
src/
├── features/
│   ├── users/          # User management domain
│   │   ├── api/        # Zod schemas and validation
│   │   ├── components/ # UI components organized by lens
│   │   │   ├── dashboard/  # Authentication, user dashboard
│   │   │   └── profile/    # Profile management
│   │   └── state/      # State management
│   ├── gyms/           # Gym discovery domain
│   └── matches/        # Partner matching domain
├── components/ui/      # Reusable UI primitives
├── lib/               # Utility functions
└── app/               # Next.js app router pages
```

### Key Architectural Rules

1. **Zod-First Validation**: All domain data types use `z.infer<typeof Schema>`
2. **Lens-Based Components**: Components organized by business lens (dashboard, profile, etc.)
3. **Pure Functions**: Data transformation functions are pure and Zod-validated
4. **No Cross-Lens Imports**: Components stay within their domain boundaries
5. **Props Schema Validation**: All components define Zod schemas for props

## Features

- **User Authentication**: Login/Register with form validation
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **Type Safety**: Full TypeScript coverage with Zod runtime validation
- **Modern UI**: shadcn/ui components with consistent design system

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

This project enforces strict architectural rules:

- Domain schemas must be in `api/` or `state/` folders
- Components must follow lens-based naming
- All forms use React Hook Form + Zod validation
- UI components follow shadcn/ui patterns

## Project Status

This is an MVP (Minimum Viable Product) with the following implemented features:

✅ **Completed**:

- Project setup with Next.js, TypeScript, Tailwind
- User authentication UI with form validation
- Domain-driven architecture with Zod schemas
- Responsive design with shadcn/ui components

🚧 **Next Steps**:

- Backend API integration
- Gym discovery and search
- User matching algorithm
- Real-time messaging
- Location-based features

## Contributing

When contributing to this project, please follow the established architectural patterns:

1. Use Zod schemas for all data validation
2. Follow the lens-based component organization
3. Implement proper TypeScript typing
4. Use React Hook Form for all forms
5. Follow the existing UI component patterns

## License

ISC
