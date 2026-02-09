# Contributing to SWG Audit

Thank you for considering contributing to SWG Audit. We welcome contributions from the community.

## How you can contribute

### Reporting issues

If you find bugs or have suggestions, please open an issue. Include steps to reproduce and any relevant details.

### Submitting changes

1. **Fork** the repository on GitHub.
2. **Create a branch** (e.g. `fix-bug-123` or `add-feature`).
3. **Make your changes** and keep the code simple and minimal.
   - Edit **HTML in `src/`** (not `public/`). Use `{{> header }}` and `{{> footer }}` where the shared header/footer go. To change nav or footer text, edit **`public/partials/header.html`** or **`public/partials/footer.html`**. Then run **`npm run build:html`** to update `public/`.
   - Use the workspace **snippets** in `.vscode/html.code-snippets` when adding pages: type `swg-doc`, `swg-header`, `swg-footer`, etc., for consistent structure.
4. **Test** that the app still runs (`npm start`) and simulations behave as expected.
5. **Open a pull request** with a clear description of the change.

### Documentation

Improvements to README, comments, or docs are welcome.

### Feature ideas

Open an issue to discuss new features before implementing.

## Code of conduct

Please be respectful and constructive. We aim for a welcoming environment for everyone.

## Questions

Open an issue or contact the maintainers. We appreciate your contributions.
