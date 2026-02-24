# Ansible k3s deploy

This playbook renders Jinja templates and applies them with kubectl on a single node.
It supports deploying one app or multiple apps in sequence.

## Requirements
- Ansible installed with required collections:
  ```
  ansible-galaxy collection install community.docker kubernetes.core
  ```
- docker and kubectl available on the target host
- k3s running and kubeconfig configured for kubectl

## Usage
From the repo root:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml
```

App configuration lives in ops/apps/<app-name>.yml. Override variables with --extra-vars:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website build_image=true registry=localhost:5000"
```

Deploy multiple apps (example: frontend/backend/db):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars '{"app_names":["frontend","backend","db"]}'
```

CSV variant:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "app_names_csv=frontend,backend,db"
```

Sample app configs are provided in `ops/apps/frontend.yml`, `ops/apps/backend.yml`, and `ops/apps/db.yml`.
Those are disabled by default (`app.enabled: false`) and require matching application directories in the repo (`app/frontend/`, `app/backend/`, `app/db/`) when enabled.

Ansible is the primary deployment interface. The wrapper script (`ops/k3s-deploy.sh`) is optional and only forwards variables to this playbook.

Use an existing tag (skip build/push):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "build_image=false tag=v1.2.3"
```

To add a new app, copy ops/apps/example-app.yml to ops/apps/<app-name>.yml and edit values.

