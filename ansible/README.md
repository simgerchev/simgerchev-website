# Ansible k3s deploy

This playbook mirrors k3s-deploy.sh using Ansible on a single node.

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
ansible-playbook -i ansible/inventory.ini ansible/deploy-k3s.yml
```

Override variables with --extra-vars:

```
ansible-playbook -i ansible/inventory.ini ansible/deploy-k3s.yml \
  --extra-vars "app_name=simgerchev-website build_image=true registry=localhost:5000"
```

Use an existing tag (skip build/push):

```
ansible-playbook -i ansible/inventory.ini ansible/deploy-k3s.yml \
  --extra-vars "build_image=false tag=v1.2.3"
```
