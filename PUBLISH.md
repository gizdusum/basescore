# BaseScore Publish Flow

Updated for the current Base.dev flow on April 1, 2026.

## Current recommendation

Publish BaseScore at `https://basescore.proveit.today/` as a standalone site, then register that URL on Base.dev.

Why this is now the right move:

- it gives BaseScore its own clean domain identity
- it unlocks separate ownership signing for this app
- it keeps `www.proveit.today` free for the main `ProveIt` app

## Repo assets already prepared

- publish metadata lives in `base.dev.project.json`
- a dedicated-domain manifest template lives in `.well-known.farcaster.template.json`
- a ready-to-fill manifest file also exists at `.well-known/farcaster.json`
- a publish-safe icon export now exists at `icon.png`
- the target launch URL is `https://basescore.proveit.today/`

## Infrastructure note

Because GitHub Pages allows one Pages site per repository, the current repo that serves `www.proveit.today` should stay attached to the main site.

For `basescore.proveit.today`, use a separate deploy target:

- a separate repository is the simplest option
- or another static host entirely
- do not replace the current repo custom domain with `basescore.proveit.today`, or you will break `www.proveit.today`

## DNS and hosting

1. Create a DNS `CNAME` record for `basescore.proveit.today` pointing to `gizdusum.github.io`.
2. Create a separate Pages site and set its custom domain to `basescore.proveit.today`.
3. Publish the contents of the `basescore/` folder at that new site's root.
4. Confirm that `https://basescore.proveit.today/` and `https://basescore.proveit.today/.well-known/farcaster.json` both return `200`.

## What you still need to do in Base.dev

Then:

1. Sign in to [Base.dev](https://base.dev) with the Base account that should own the project.
2. Create or select the `BaseScore` project.
3. Set the primary URL to `https://basescore.proveit.today/`.
4. Copy the values from `base.dev.project.json` into the Base.dev project fields if the UI does not import them automatically.
5. In `Preview -> Account Association`, verify `basescore.proveit.today` and sign with the owning wallet.
6. Paste the generated `accountAssociation.header`, `payload`, and `signature` values into `.well-known/farcaster.json`.
7. Redeploy and then open/share the production URL inside Base App once so indexing can catch it.

## Important date note

Base docs currently show a transition to the standard Base App web model on **April 9, 2026**.

As of **April 1, 2026**:

- the manifest and `accountAssociation` flow is still valid for ownership
- Base.dev project metadata is already the safer source of truth for publish setup

That means the lowest-risk path today is:

1. deploy BaseScore as its own site on `basescore.proveit.today`
2. register that URL on Base.dev
3. sign ownership after the dedicated domain is live
