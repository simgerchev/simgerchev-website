# Reusable ops template

This folder is a reusable deployment template for containerized applications on k3s.

## What is reusable

- `ops/ansible/deploy-k3s.yml` deploy playbook
- `ops/templates/*.yaml.j2` Kubernetes manifest templates
- `ops/apps/*.yml` per-application configuration files

## Requirements

- Ansible installed
- `kubectl` available on the target host
- Docker available on the target host (for image build/push)
- k3s cluster accessible from the target host

Optional Ansible collections:

```bash
ansible-galaxy collection install community.docker kubernetes.core
```

## Deploy from this repository

From the repository root:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website"
```

Useful overrides:

```bash
# custom registry
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website registry=registry.example.com:5000"

# skip build/push and deploy existing tag
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website build_image=false tag=v1.0.0"
```

## Use in another repository

1. Copy this `ops/` folder into your target repository.
2. Make sure your app source is at `app/<app-name>/` with a `Dockerfile`.
3. Copy `ops/apps/example-app.yml` to `ops/apps/<app-name>.yml` and update values.
4. Update `ops/ansible/inventory.ini` for your deployment host.
5. Run:
   ```bash
   ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
     --extra-vars "app_name=<app-name>"
   ```

## Add a new app

1. Add application source in `app/<app-name>/` with a `Dockerfile`.
2. Copy `ops/apps/example-app.yml` to `ops/apps/<app-name>.yml`.
3. Update app settings (`namespace`, ports, ingress, env, resources).
4. Deploy with:

```bash
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=<app-name>"
```

## Notes

- Use `--extra-vars "registry=<registry>"` to deploy against a remote/private registry.
- Use `--extra-vars "build_image=false tag=<tag>"` to deploy an existing image without rebuilding.
- The Ansible playbook is the primary deployment interface.
