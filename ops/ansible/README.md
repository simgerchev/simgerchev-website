# Ansible k3s deploy

This playbook renders Jinja templates and applies them with kubectl on a single node.

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

Ansible is the primary deployment interface. The wrapper script (`ops/k3s-deploy.sh`) is optional and only forwards variables to this playbook.

Use an existing tag (skip build/push):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "build_image=false tag=v1.2.3"
```

To add a new app, copy ops/apps/example-app.yml to ops/apps/<app-name>.yml and edit values.

