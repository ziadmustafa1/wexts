# Deployment Templates & Integrations

This directory contains deployment configurations and integrations for various platforms.

## 📁 Structure

```
templates/
├── railway/          # Railway deployment template
│   ├── railway.json
│   ├── nixpacks.toml
│   └── README.md
│
└── render/           # Render blueprint
    ├── render.yaml
    └── README.md
```

## 🚀 Quick Deploy

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ziadmustafa1/wexts)

### Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ziadmustafa1/wexts)

## 📦 Platform Packages

### Vercel

```bash
pnpm add -D @wexts/vercel-builder
```

See: `packages/vercel-builder/`

### Netlify

```bash
pnpm add -D @wexts/netlify-plugin
```

See: `packages/netlify-plugin/`

## 📖 Documentation

For comprehensive deployment guides, see:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Main deployment guide
- [Railway Template](./railway/README.md) - Railway-specific guide
- [Render Blueprint](./render/README.md) - Render-specific guide

## 🔧 Customization

Each template can be customized for your specific needs:

**Railway**: Edit `railway.json` and `nixpacks.toml`
**Render**: Edit `render.yaml`

## 🆘 Support

Having issues? Check our:
- [Deployment Guide](../DEPLOYMENT.md)
- [GitHub Discussions](https://github.com/ziadmustafa1/wexts/discussions)
- [GitHub Issues](https://github.com/ziadmustafa1/wexts/issues)
