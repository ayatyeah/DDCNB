# DDCNB Scroll Story

Scroll-controlled product storytelling site for DDC. The page uses a fixed full-screen canvas background and renders a WebP frame sequence according to scroll progress.

## Stack

- Next.js 16
- React 19
- TypeScript
- CSS
- HTML Canvas API
- Sharp for local PNG to WebP frame conversion

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm ci
npm run build
npm start
```

The production server listens on `0.0.0.0:3000`. Deployment platforms can provide a `PORT` environment variable; Next will use it.

## Deploy

The repository root contains:

- `package.json` for Node/Next auto-detection
- `Dockerfile` for Docker-based deployment fallback
- `.do/app.yaml` for DigitalOcean App Platform
- `public/frames/*.webp` with the prebuilt animation frames

If the platform says "No components detected", make sure:

1. The repository branch contains `package.json` in the repo root.
2. The source directory is `/` or empty.
3. The latest local changes are committed and pushed to `master`.
4. The GitHub app has permission to read `ayatyeah/DDCNB`.
5. If auto-detection still fails, choose Dockerfile deployment.

Recommended commands:

- Build command: `npm ci && npm run build`
- Run command: `npm start`
- HTTP port: `3000`

## Frame Pipeline

The runtime does not use a `<video>` element. Frames live in `public/frames`:

```text
frame-0001.webp
frame-0002.webp
...
frame-0240.webp
```

To regenerate WebP frames from the local `images` folder:

```bash
npm run frames:webp
```

The script uses `sharp` and exports high-quality WebP frames.
