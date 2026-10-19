# Repository Guidelines

## Project Structure
- This is a build-free Japanese static site. `index.html`, `style.css`, and `script.js` are the frontend; keep the existing vanilla HTML/CSS/JavaScript structure and avoid adding a build system or dependencies without a clear need.
- `config.js` contains public site configuration. Keep secrets and administrative credentials out of it and out of all frontend assets.
- `gas/` is a separately deployed Google Apps Script reservation API. Store its credentials and operational settings in Apps Script properties, not in the repository.
- `images/` contains the site assets. Reuse existing images where suitable and preserve meaningful Japanese alt text.

## Content and Behavior
- Treat provisional details in the site and README as unconfirmed. Do not present them as verified; preserve their provisional status unless the user supplies confirmed values.
- Keep frontend reservation fields and request/response behavior compatible with `gas/Code.gs`.
- Retain responsive behavior, keyboard access, accessible labels/status messages, and reduced-motion support when changing interactions or layout.
- Update the relevant README when deployment or configuration steps change.

## Validation
- There is no package manifest, build step, or automated test suite. For frontend changes, inspect the page in a browser at desktop and mobile widths and check the browser console; check both demo mode and configured behavior when relevant.
- For GAS changes, review the affected API paths and confirm the Apps Script manifest/scopes when permissions change. Live reservation, email, and concurrency behavior require a deployed GAS environment and are not verified by local static checks.