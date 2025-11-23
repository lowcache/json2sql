# JSON to SQL/CSV Converter

## Project Overview
A professional web application for converting JSON files to SQL or CSV formats with smart handling of nested objects and arrays. Features a trial mode with 50-line limit and Stripe payment integration for full access.

## Recent Changes
- **2025-01-22**: Initial project setup
- Defined data schemas for conversions and purchases
- Built complete frontend with Material Design system
- Configured Inter and JetBrains Mono fonts
- Implemented all UI components following design guidelines

## Stripe Integration Status
**⚠️ Pending Configuration**
- User dismissed the Stripe connector integration
- Stripe API keys not yet provided
- Payment modal UI is built but needs backend integration
- Required secrets: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- Note: When keys are provided, implement Stripe Payment Intents API in backend

## Project Architecture

### Frontend Components
- **Home Page**: Main converter interface with tabbed input (upload/paste)
- **FileUpload**: Drag-and-drop JSON file upload with visual feedback
- **TextPaste**: Code editor for pasting JSON with formatting
- **ConversionControls**: Format selector (SQL/CSV) with advanced options
- **TrialBadge**: Progress indicator for 50-line trial limit
- **OutputPreview**: Syntax-highlighted preview with download/copy
- **UpgradeModal**: Payment modal for purchasing full access
- **AppHeader**: Top navigation with upgrade button
- **AppFooter**: Footer with documentation links

### Backend (To be implemented)
- Conversion API endpoint: `/api/convert`
- JSON parser with nested object flattening
- SQL generation (MySQL, PostgreSQL, SQLite)
- CSV generation with custom delimiters
- Trial validation (50-line limit)
- Stripe payment webhook handler

### Design System
- Primary Font: Inter (sans-serif)
- Monospace Font: JetBrains Mono (code display)
- Color Scheme: Material Design with blue primary color
- Spacing: Tailwind units (2, 4, 6, 8, 12, 16)
- Components: Shadcn UI with custom styling

## Key Features
1. ✅ File upload with drag-and-drop
2. ✅ Text paste with JSON formatting
3. ⏳ Smart JSON parsing (pending backend)
4. ⏳ SQL generation with dialect support (pending backend)
5. ⏳ CSV export with custom delimiters (pending backend)
6. ✅ Trial limitation UI (50 lines)
7. ⏳ Stripe payment integration (needs API keys)
8. ✅ Download and copy functionality

## Next Steps
1. Implement backend conversion API
2. Add Stripe payment processing
3. Test nested object handling
4. Validate SQL output quality
5. Test CSV generation
