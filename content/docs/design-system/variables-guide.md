---
title: "Japanese Minimalist Theme Variables"
slug: "variables-guide"
category: "design-system"
description: "Reference guide for CSS variables, color tokens, and typography specifications."
order: 2
---

# Japanese Minimalist Theme Variables

The Japanese Minimalist theme relies on a central token system defined in `src/styles/variables.css` and mapped to Tailwind CSS v4.

## Color Tokens

The palette balances traditional Japanese natural tones:

- `--color-primary` (`#b04749`): Akane Cinnabar Red. Used for primary CTA triggers.
- `--color-bg` (`#fef0de`): Torinoko Rice Paper background.
- `--color-text` (`#121212`): Sumi Ink Black for high legibility text.
- `--color-accent-peach` (`#f6e0ce`): Warm sand accent for badges and code blocks.

## Typography Guidelines

1. **Headings**: Use `font-serif` (`Newsreader`) for editorial elegance.
2. **Body Text**: Use `font-sans` (`Plus Jakarta Sans`) for maximum readability.
3. **Code & Data**: Use `font-mono` (`JetBrains Mono`).

## Code Block Example

```css
:root {
  --color-primary: #b04749;
  --color-bg: #fef0de;
  --color-text: #121212;
}
```
