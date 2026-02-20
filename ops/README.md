# Reusable ops template

This folder is a reusable deployment template for containerized applications on k3s.

## What is reusable

- `ops/ansible/deploy-k3s.yml` deploy playbook
- `ops/templates/*.yaml.j2` Kubernetes manifest templates
- `ops/apps/*.yml` per-application configuration files

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

## Notes

- Use `--extra-vars "registry=<registry>"` to deploy against a remote/private registry.
- Use `--extra-vars "build_image=false tag=<tag>"` to deploy an existing image without rebuilding.
- `ops/k3s-deploy.sh` is optional convenience; all deployment features are available directly via Ansible.
