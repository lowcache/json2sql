# JSON to SQL/CSV Converter - Design Guidelines

## Design Approach: Material Design System
**Rationale**: Utility-focused productivity tool requiring clear visual feedback, strong interaction patterns, and professional trustworthiness for monetization. Material Design provides robust components for file handling, data display, and transaction flows.

## Core Design Principles
1. **Conversion Workflow Clarity**: Linear left-to-right or top-to-bottom flow from input → processing → output
2. **Trust & Professionalism**: Clean, sophisticated interface that justifies paid conversion
3. **Visual Feedback**: Strong state indicators for upload, processing, validation, and download stages
4. **Limitation Transparency**: Clear, non-aggressive trial boundaries with upgrade path

---

## Typography System
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent for technical content
- **Monospace Font**: JetBrains Mono - for JSON/SQL/CSV code display
- **Hierarchy**:
  - H1: 2.5rem (40px), font-weight 700 - main tool title
  - H2: 1.75rem (28px), font-weight 600 - section headers
  - Body: 1rem (16px), font-weight 400 - standard text
  - Code: 0.875rem (14px), monospace - data preview/output
  - Small: 0.875rem (14px), font-weight 500 - labels, metadata

---

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing (2, 4): Form elements, inline components
- Medium spacing (6, 8): Section padding, card gaps
- Generous spacing (12, 16): Major section separators

**Container Strategy**:
- Max width: `max-w-7xl` for main workspace
- Input/Output sections: `max-w-4xl` each with balanced width
- Side-by-side layout on desktop (`lg:grid-cols-2`), stacked on mobile

---

## Component Library

### Input Section
**File Upload Area**:
- Large dropzone (min-height: 300px) with dashed border, hover state enhancement
- Drag-and-drop visual feedback (border highlight, background tint on dragover)
- File icon, "Drop JSON file or click to browse" text
- Selected file display: filename, size, line count preview
- Clear/remove file action

**Text Input Alternative**:
- Tabbed interface switching between "Upload File" and "Paste JSON"
- Textarea with syntax highlighting for pasted JSON (use CodeMirror or Monaco via CDN)
- Line counter visible, real-time validation feedback
- Format/beautify button for pasted JSON

### Conversion Controls
**Central Control Bar** (between input/output):
- Primary action: Large "Convert" button with loading spinner state
- Output format selector: Radio buttons or segmented control (SQL / CSV)
- Options panel (expandable accordion):
  - Nested object handling: Flatten vs. Separate tables
  - CSV delimiter choice
  - SQL dialect (MySQL, PostgreSQL, SQLite)

### Trial Limitation System
**Non-intrusive Badge**: 
- Persistent indicator: "Free Trial: X/50 lines used"
- Progress bar visualization
- When approaching limit (40+ lines): Warning badge appears
- At limit exceeded: Gentle overlay with upgrade prompt, conversion disabled
- "Unlock Full Access" CTA prominently placed but not blocking preview

### Output Section
**Preview Display**:
- Code editor with read-only SQL/CSV output (syntax highlighted)
- Split view option: Original JSON + Generated output side-by-side
- Validation indicators: Success checkmarks, error warnings with line numbers
- Statistics: Lines converted, tables created, headers detected

**Download Actions**:
- Primary download button: "Download SQL/CSV" with file format icon
- Secondary: "Copy to Clipboard" with confirmation toast
- File naming: Auto-generated with timestamp or custom name input

### Payment Integration (Stripe)
**Upgrade Modal**:
- Triggered from trial limit or "Upgrade" button in header
- Clear value proposition: "Unlimited conversions, advanced features"
- Pricing card: One-time purchase amount, feature list comparison
- Stripe Elements embedded payment form
- Security badges, money-back guarantee if applicable
- Post-purchase: Thank you state, immediate access unlock

### Navigation Header
**Top Bar**:
- Logo/tool name left-aligned
- Trial status indicator center
- Account menu right-aligned (Login/Account for paid users)
- "Upgrade" button (prominent, but not aggressive) for trial users

### Footer
- Documentation link, sample JSON files download
- FAQ, contact support
- Trust indicators: Payment security, data privacy note

---

## Visual Patterns
- **Cards**: Elevated surfaces (shadow-md) for input/output sections with rounded corners (rounded-lg)
- **Buttons**: Filled primary (conversion, download), outlined secondary (options, copy)
- **States**: Clear disabled, loading, success, error states with icons + text
- **Dividers**: Subtle vertical/horizontal separators between sections
- **Toasts**: Non-blocking success/error notifications (top-right position)

---

## Animations
**Minimal & Purposeful**:
- File upload: Smooth fade-in of file details
- Conversion: Progress indicator during processing
- Modal appearance: Gentle scale + fade entrance
- Button loading: Spinner rotation only
- Success states: Single checkmark animation

**Avoid**: Page transitions, scroll effects, decorative animations

---

## Accessibility
- All interactive elements keyboard navigable
- ARIA labels for file upload, conversion status
- Error messages programmatically associated with inputs
- Sufficient contrast ratios (WCAG AA minimum)
- Focus indicators visible on all controls

---

## Images
**No hero image required** - This is a utility tool, not marketing page. Focus on functional interface clarity.