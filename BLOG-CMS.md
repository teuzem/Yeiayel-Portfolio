# Unified Sanity Blog

The portfolio uses the existing `/studio` instance and the `blog` document
type. The separate `Sanity blog CMS` folder remains an untracked reference
project and is intentionally not deployed or compiled by this application.

## Editorial workflow

1. Open `/studio`.
2. Open `Content & Community`.
3. Complete `Blog Categories`, `Blog Authors`, and optional `Product Reviews`.
4. Create a blog post and provide English and French content.
5. Set **Publishing status** to **Published** and choose a `publishedAt` date
   that is not in the future.
6. Use **Blog Settings** to edit the logo, hero copy, Bâtir le Pays SARL
   position, and accent color.

The bundled `public/blog/batir-le-pays-logo.png` is a visual fallback. Upload
the same or a replacement logo into **Blog Settings** to control it from
Sanity Studio.

## Seed initial editorial content

The seed script creates categories, an author, a product-review entry, blog
settings, and bilingual sample editorial posts. It does not overwrite existing
documents unless explicitly told to do so.

```powershell
node --env-file=.env.local scripts/seed-blog-content.mjs
```

Use `--overwrite` only to reset the fixed seed document IDs:

```powershell
node --env-file=.env.local scripts/seed-blog-content.mjs --overwrite
```

The script never deletes existing content. Review legacy mock posts in Studio,
export any content worth retaining, and remove only the confirmed mock records.
This keeps real editorial work protected.

## Immediate publishing

Set `SANITY_REVALIDATE_SECRET` in the hosting environment. Then create a Sanity
webhook for create, update, and delete events:

```text
https://your-domain.example/api/revalidate/sanity?secret=your-long-random-webhook-secret
```

Use the same value in the `x-sanity-revalidate-secret` request header. A valid
webhook revalidates the portfolio, blog, metadata, and sitemap cache.
