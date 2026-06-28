# Mohikontok Sound Lab Repository

Welcome to the **Mohikontok Sound Lab** codebase – a creative hub where audio, music, and intelligent automation converge. This repo hosts the core projects that power our sound‑design tools, web presence, and AI‑driven workflows.

## 🚀 What’s Inside?

- **Web Front‑end** – A modern React + TypeScript + Vite stack that powers the Mohikontok website and the interactive SoundLibrary grid.
- **Audio Automation** – Scripts and services for generating AI‑music (Suno, HeartMuLa), creating 4K video renders, and publishing to `mohikontok.com`.
- **Infrastructure** – Cloudflare Tunnel setup, cron‑driven outreach bots, and smart‑home integration for studio lighting.
- **Documentation & Skills** – A growing collection of **skills** (reusable Hermes workflows) for tasks like blog publishing, outreach monitoring, and sound‑proofing guides.

## 📦 Quick Start (Local Development)

```bash
# Clone the repo (already available at /opt/data/workspace/mohikontok)
cd /opt/data/workspace/mohikontok

# Install Node dependencies (requires Node ≥18)
npm ci

# Start the development server
npm run dev
```

The site will be available at `http://localhost:5173`. For production, run:

```bash
npm run build   # builds static assets into ./dist
npm run preview # serves the built site locally
```

## 🛠️ Backend Services

### Cloudflare Tunnel
The website is exposed publicly via a Cloudflare Tunnel (port 8889). To spin it up locally:

```bash
# Ensure cf_email_sender.py and .cloudflare.env are present
./cf_email_sender.py tunnel start --port 8889
```

### Cron‑Driven Automation
We use Hermes Agent’s cron system for daily outreach monitoring and blog post generation. To view or edit jobs:

```bash
hermes cron list
hermes cron edit <job_id>
```

## 🤝 Contributing

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feat/your‑feature`.
3. Follow the existing code style (ESLint + TypeScript strict rules).
4. Run tests (if any) and ensure the site builds.
5. Open a Pull Request – our CI will run linting, type‑checking, and deployment checks.

## 📄 License

This project is licensed under the MIT License – see the `LICENSE` file for details.

## 🎧 About Mohikontok

Mohikontok Sound Lab empowers creators in the Bronx and beyond with AI‑enhanced audio tools, research‑driven sound‑proofing guides, and community‑focused outreach. We blend technical rigor with playful creativity – think of us as the lab‑grown companion that loves turning ideas into sonic reality.

---

*Generated and maintained by the Mohikontok AI assistant.*