# Deployment Guide

This `ops/` folder is designed to be reused as a deployment template across different repositories.

## Prerequisites

1. **k3s installed** on your homelab server
2. **Docker** running on your machine
3. **kubectl** configured to access your k3s cluster

## One-Time Setup: Local Docker Registry

Set up a local registry that k3s can pull images from:

```bash
# Start a local Docker registry with persistent storage
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /opt/registry:/var/lib/registry \
  registry:2

# Verify it's running
curl http://localhost:5000/v2/_catalog
```

### Configure k3s to trust the local registry

If your registry is on the same machine as k3s:
```bash
sudo mkdir -p /etc/rancher/k3s/
sudo tee /etc/rancher/k3s/registries.yaml <<EOF
mirrors:
  "localhost:5000":
    endpoint:
      - "http://localhost:5000"
EOF

# Restart k3s
sudo systemctl restart k3s
```

If your registry is on a different machine, replace `localhost` with the registry machine's IP.

## Deploying Applications

Deployment is automated with Ansible.

### Deploy an app in this repository

Run the playbook directly:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml
```

Deploy a specific app:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website"
```

Deploy with a custom registry:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website registry=registry.example.com:5000"
```

Deploy without rebuilding (use existing image tag):

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website build_image=false tag=v1.0.0"
```

Optional wrapper script (same behavior):

```bash
./ops/k3s-deploy.sh simgerchev-website

# Or use a specific tag
./ops/k3s-deploy.sh --tag v1.0.0

# Deploy without rebuilding (reuse existing image)
./ops/k3s-deploy.sh --no-build --tag v1.0.0
```

### Deploy other applications

Direct Ansible usage:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=another-app"
```

For future apps, organize your repository like this:

```
repository/
├── app/
│   ├── simgerchev-website/
│   │   ├── Dockerfile
│   │   └── ...
│   └── another-app/       # New app
│       ├── Dockerfile
│       └── ...
└── ops/
  ├── apps/
  │   ├── example-app.yml
  │   ├── simgerchev-website.yml
  │   └── another-app.yml
  ├── templates/
  │   ├── namespace.yaml.j2
  │   ├── deployment.yaml.j2
  │   ├── service.yaml.j2
  │   └── ingress.yaml.j2
  └── k3s-deploy.sh      # Shared deploy script
```

Ansible usage:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=another-app"
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=my-backend-api"
```

To add a new app:

1. Create app code under app/<app-name> with a Dockerfile.
2. Copy ops/apps/example-app.yml to ops/apps/<app-name>.yml.
3. Update app/namespace, ports, ingress, env, and resources in that file.

## Reusing this ops folder in another repository

1. Copy `ops/` into the new repository.
2. Ensure application code lives in `app/<app-name>/` with a Dockerfile.
3. Copy `ops/apps/example-app.yml` to `ops/apps/<app-name>.yml` and set values.
4. Update `ops/ansible/inventory.ini` for your target host(s).
5. Deploy with:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=<app-name>"
```

## Deploy All Applications

Create a simple script to deploy everything:

```bash
#!/bin/bash
# deploy-all.sh

set -e

echo "Deploying all applications..."

./ops/k3s-deploy.sh simgerchev-website
./ops/k3s-deploy.sh another-app
# Add more apps here

echo "All applications deployed!"
```

## Checking Registry Contents

```bash
# List all images in your registry
curl http://localhost:5000/v2/_catalog

# List tags for a specific image
curl http://localhost:5000/v2/simgerchev-website/tags/list
```

## Troubleshooting

### Can't pull from registry
```bash
# Check if registry is accessible from k3s node
curl http://REGISTRY_IP:5000/v2/_catalog

# Check k3s registry config
cat /etc/rancher/k3s/registries.yaml
sudo systemctl status k3s
```

### Image not found
```bash
# Verify image was pushed
docker images | grep simgerchev-website
curl http://localhost:5000/v2/simgerchev-website/tags/list
```

### Check deployment status
```bash
kubectl -n simgerchev-website get pods
kubectl -n simgerchev-website describe pod POD_NAME
kubectl -n simgerchev-website logs POD_NAME
```
