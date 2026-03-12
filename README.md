# Simgerchev Website

Personal website built with React + Vite.

## Prerequisites

- Node.js 20+
- npm

## Local Development

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Deployment

### Docker

```bash
docker build -t simgerchev-website .
docker run --rm -p 8080:80 simgerchev-website
```

### GitLab CI and Kubernetes

The repository includes a GitLab pipeline in `.gitlab-ci.yml` that:

- runs `npm run lint` and `npm run build`
- builds and pushes a Docker image to the GitLab registry
- deploys the image to Kubernetes with manifests from `k8s/`

Pipeline variables:

- `KUBE_CONFIG`: base64-encoded kubeconfig for the deploy runner, optional if the runner can read `/etc/rancher/k3s/k3s.yaml`
- `K8S_NAMESPACE`: target namespace, defaults to `simgerchev-website`
- `K8S_INGRESS_HOST`: optional host for ingress creation
- `VITE_BASE_PATH`: optional Vite base path passed into the Docker build, defaults to `/`

Kubernetes resources created by the deploy job:

- Deployment: `simgerchev-website`
- Service: `simgerchev-website`
- Ingress: `simgerchev-website` when `K8S_INGRESS_HOST` is set
