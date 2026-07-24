# Deployment Rules — READ BEFORE DEPLOYING

**This file exists because production has been broken twice (2026-06-19 and 2026-07-24) by bad deploys. Both times the video gallery went dark. Follow these rules exactly.**

## Facts

- **Source of truth:** this repo — `github.com/unrealdesignsae/aries-black-portfolio`, branch `master`.
- **Live production:** Vercel project `aries-black-portfolio` (id `prj_9vCyvC1Qij7BhnhqdWbOfnsBgR0K`, team `team_wuxQiTVRUQRNzFYzPU3mGPYL`) → https://aries-black-portfolio.vercel.app
- **The 28 gallery videos are NOT in this repo and NOT in the build output.** They live in a Cloudflare R2 bucket and are reached through the rewrite in `vercel.json`:
  `/r2-cdn/:path*` → `https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev/:path*`
- The Vercel project `black-portfolio` is a frozen known-good copy. Do not deploy to it, do not delete it.

## The one way to deploy

From the **repo root** (so `vercel.json` ships with the deploy):

```bash
npx vercel --prod --yes
```

Vercel builds remotely (`tsc && vite build`) and applies `vercel.json`. Done.

## Never do this

- **Never** run `vercel deploy` from `dist/` or any folder that is not this repo root. A bare `dist` upload has no `vercel.json`, so every `/r2-cdn/*` request 404s and the whole video gallery dies. This is exactly what broke production both times.
- **Never** deploy this project from an unrelated working directory (e.g. the vault). Both bad deploys carried `gitDirty` metadata from the wrong repo or none at all.
- **Never** hand-edit the deployed bundle to patch behavior. Fix it here, commit, redeploy.

## Verify after every deploy

```bash
curl -sI https://aries-black-portfolio.vercel.app/r2-cdn/video_1.mp4 | head -3
```

Must return `HTTP/1.1 200 OK` (or 308→200). If it returns 404, the rewrite is missing — you deployed wrong. Redeploy from repo root.
