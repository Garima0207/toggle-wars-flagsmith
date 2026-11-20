# Toggle Wars – Teammate Finder

> Flag it, test it, ship the winner.

A small board where Toggle Wars hackathon participants post what they're building and the skills they need, and others click **Connect** to reach them. It runs one real A/B test with Flagsmith Experimentation.

Built for **Toggle Wars** (WeMakeDevs × Flagsmith, Nov 26–29, 2026), Track 01: *Test Something Real*.

## The experiment

| | |
|---|---|
| **Hypothesis** | Showing a project's *skills needed* as badges makes it easier to see where you fit, so more visitors click **Connect** than with a plain bio. |
| **Flag** | `card_layout` (multivariate) |
| **Control** | `bio`: each card shows a short bio |
| **Variant** | `skills`: each card shows "Looking for" skill badges instead |
| **Metric** | `connect_clicked` (counted once per card per visitor) |
| **Split** | 50 / 50 |
| **Results** | _Coming after the experiment runs._ |

### How it's wired
- Every visitor gets a stable anonymous ID (`localStorage`), passed to Flagsmith as the identity, so exposures and conversions join per visitor.
- `useExperiment('card_layout')` reads the variant and records one `$flag_exposure` for enrolled visitors.
- `flagsmith.trackEvent('connect_clicked')` records the conversion.
- Uses `@flagsmith/flagsmith` v12.5+ with `enableEvents: true`.

## Run it locally

```bash
cd app
npm install
cp .env.example .env.local   # add your Flagsmith client-side environment key
npm run dev
```

Without a key, the app runs on the control version and shows a notice.

## Flagsmith setup
1. Create a project and copy the **client-side environment key**.
2. Create a multivariate feature `card_layout` with the control value `bio` and a variation `skills`. Enable it.
3. Create the metric from the event `connect_clicked`.
4. Create an experiment on `card_layout` with that metric and a 50/50 split, then start it.

## Status / roadmap
- [x] App skeleton, A/B card variants, Flagsmith flag + events wiring
- [ ] Shared backend for posts (currently browser-local)
- [ ] Deploy and share with participants
- [ ] Results + roll out the winner
- [ ] Demo video
