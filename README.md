# Simgerchev Website

Personal website built with React + Vite.

## Project Layout

- `app/simgerchev-website` - React application
- `ops` - reusable k3s/Ansible deployment automation

## Prerequisites

- Node.js 20+
- npm
- Docker (for image build/push and containerized workflows)
- Ansible + kubectl (for k3s deployment)

## Local Development

From the repository root:

```bash
cd app/simgerchev-website
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Deployments

### k3s (Ansible)

From the repository root:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
	--extra-vars "app_name=simgerchev-website"
```

Use an existing image tag (skip build/push):

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
	--extra-vars "app_name=simgerchev-website build_image=false tag=v1.0.0"
```

### GitHub Pages

From `app/simgerchev-website`:

```bash
npm run deploy
```

## Ops Docs

- `ops/README.md` - reusable ops template usage
- `ops/DEPLOYMENT.md` - full deployment guide and troubleshooting
