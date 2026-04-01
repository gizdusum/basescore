# BaseScore Site

Standalone static deploy for `https://basescore.proveit.today/`.

## Important files

- `index.html`, `styles.css`, `app.js`: app shell and client logic
- `.well-known/farcaster.json`: live manifest file for Base.dev ownership
- `base.dev.project.json`: Base.dev project metadata
- `CNAME`: GitHub Pages custom domain
- `.nojekyll`: static asset compatibility on Pages

## Ownership flow

1. Deploy the site to `basescore.proveit.today`.
2. In Base.dev, verify the domain in `Preview -> Account Association`.
3. Paste the generated `header`, `payload`, and `signature` into `.well-known/farcaster.json`.
4. Redeploy so the signed manifest is live.
