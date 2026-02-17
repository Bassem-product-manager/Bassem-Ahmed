# Connect Me Form Setup

1. Create a Formspree form under your inbox `bassem.ahmed0202@gmail.com`, then copy the endpoint (example: `https://formspree.io/f/abcdwxyz`).
2. Create a local `.env` file in the project root.
3. Add:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

4. Restart the dev server after editing `.env`.
