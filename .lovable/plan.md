# Frontpage Editor

Make every section of the homepage editable from the backend — text, headlines, body copy, images, CTAs, lists — with a friendly form UI (no raw JSON).

## Storage

Use the existing `pages` table. One row with `page_key = 'home'` whose `sections` JSONB holds a typed shape:

```
{
  hero: { eyebrow, headline_line1, headline_line2, headline_italic, body, image_url, primary_cta:{label,url}, secondary_cta:{label,url}, trust_items:[{label, icon}] },
  reassurance: { eyebrow, heading, body, image_url },
  promise:    { eyebrow, heading, body, image_url, points:[string] },
  portal:     { eyebrow, heading, italic_word, body, features:[string], image_url, cta:{label,url} },
  resources:  { eyebrow, heading, body },        // (cards remain DB-driven from blog_posts)
  cta:        { eyebrow, heading, italic_word, body, primary_cta, secondary_cta, footnote, background_image_url }
}
```

Services / Testimonials / FAQ stay sourced from their dedicated tables (already editable in admin). The editor only manages copy/image for those section *headers* if needed.

A migration seeds the `home` row with the current hardcoded defaults so the site looks identical on first load.

## Frontend

- New hook `src/lib/homepage-content.ts` → `useHomepageContent()` fetches the `home` page row, merges with a `DEFAULTS` object so missing keys never break the UI, exposes `useHomeSection('hero')` helper. Subscribes to realtime changes on `pages` so the preview updates after save.
- Refactor each home component (`Hero`, `Reassurance`, `Promise`, `Portal`, `Resources`, `CTA`) to read its strings/images from the hook instead of hardcoded literals. Layout, design tokens, animations untouched.

## Admin UI

New route `src/routes/admin.homepage.tsx` ("Homepage" link in `AdminShell` nav):

- One accordion per section (Hero, Reassurance, Promise, Portal, Resources, Call to Action).
- Each accordion shows a structured form: text inputs for headlines/eyebrows, textareas for body, repeatable list editor for arrays (trust items, portal features, promise points), image picker (URL input + "Choose from Media Library" button that opens existing `media_assets`), CTA label+URL pairs.
- Single "Save" per section writes back to `pages.sections.<key>` (merge update). Realtime subscription on the public site updates instantly.

## Technical Notes

- Update happens via `supabase.from('pages').update({ sections: merged }).eq('page_key','home')`.
- Defaults live in `src/lib/homepage-content.ts` so the components are safe even if the row is deleted.
- Image picker reuses `cms-media` bucket; uploads go through existing media admin flow.
- No new tables, no new RLS — `pages` already has admin-write / public-read policies.
- TanStack Query key: `['public','pages','home']`, invalidated on realtime + after save.
