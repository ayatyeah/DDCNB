# DDCNB Site

Clean Next.js site for АО «Центр цифрового развития».

## What Is Inside

- `app/page.tsx` - full landing page, content, and scroll background shell
- `components/FrameBackground.tsx` - fixed canvas renderer for the frame sequence
- `app/globals.css` - full-screen background, nav, and responsive layout
- `public/img/*` - scroll-controlled WebP frame sequence for the background
- `public/people/*` - management and board portraits

The background is now driven by a fixed canvas and a 240-frame WebP sequence instead of a video file.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```
