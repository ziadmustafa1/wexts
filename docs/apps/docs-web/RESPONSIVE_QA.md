# Wexts Website Responsive QA

Use this checklist before shipping website changes.

## Homepage

- 320px: no horizontal body overflow; hero title wraps cleanly; CTAs stack; install command scrolls internally if needed.
- 375px: header menu opens and closes; proof badges wrap; cards are one column.
- 390px: architecture diagram stacks; route cards remain readable.
- 430px: code blocks scroll internally; no clipped buttons.
- 768px: tablet spacing is balanced; homepage sections remain one or two columns where intended.
- 1024px: desktop navigation is visible; hero split layout is stable.
- 1280px: architecture, RPC, deployment, and Shield sections use the available width without stretched text.
- 1440px: page remains centered with readable line length.

## Docs

- 320px: docs navigation is collapsed; article text is readable; code blocks do not widen the page.
- 375px: callouts and tables fit the viewport or scroll internally.
- 768px: docs article has comfortable spacing and no fixed sidebar.
- 1280px: sidebar and table of contents are visible; article width remains readable.

## Overflow Check

Run this in the browser console for each checked route and viewport:

```js
document.documentElement.scrollWidth <= window.innerWidth + 1;
```

Expected result: `true`.
