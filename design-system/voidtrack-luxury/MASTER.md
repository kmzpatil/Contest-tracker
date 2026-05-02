# Design System Master File: VoidTrack Luxury

## Global Strategy
Transition from a high-contrast Neon/HUD look to a refined, "Modern Luxury" aesthetic. Focus on clarity, intentional whitespace, and sophisticated simplicity.

---

## Global Tokens

### Color Palette (Minimalist Zinc)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background | `#09090b` | `--background` | Deep solid background |
| Foreground | `#fafafa` | `--foreground` | Main text / accents |
| Card | `#09090b` | `--card` | Section containers |
| Muted | `#71717a` | `--muted-foreground` | Secondary text |
| Border | `#27272a` | `--border` | Subtle separation |

### Typography

- **Primary Font:** Inter (Sans-serif)
- **Mood:** Clean, professional, luxury, high-end SaaS
- **Sizing:** Large tracking for titles, condensed for metadata

### Layout: The Luxury Bento
- Use modular grid systems (Bento Grid).
- Avoid glows, scanlines, or tech brackets.
- Use 1px borders with 12px-24px border radius.

---

## Component Specs

### Buttons
- **Primary:** White background, black text. High contrast.
- **Secondary:** Dark zinc background, subtle border.
- **Ghost:** Transparent, text-only until hover.

### Cards (Luxury Variant)
- Flat backgrounds with subtle 1px borders.
- Hover states should be a slight background lighten (`#0c0c0e`) or border color shift.
- No shadows (or extremely diffused, subtle shadows).

### Forms & Inputs
- Minimalist fields with solid borders.
- No heavy focus glows; use simple border-color transitions.

---

## Interaction Principles

1. **Calm Motion:** Use `framer-motion` for smooth, purposeful fade-ins and layout transitions. Avoid jarring glitch effects.
2. **True Information:** Prioritize actual synchronized data. Handle missing data with elegant "Not Connected" states rather than mock placeholders.
3. **High Fidelity Loaders:** Use skeleton shimmer loaders instead of spinners to prevent layout shifts and maintain a premium feel.

---

## Anti-Patterns

- ❌ **Neon Glows** — Overwhelms the user.
- ❌ **Cryptic Labels** — Use clear English (e.g., "Starts In" not "T_MINUS").
- ❌ **Hardcoded Mocks** — Always attempt to show actual user state.
- ❌ **Busy Backgrounds** — Keep the focus on the content.
