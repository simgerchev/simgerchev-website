# Ansible k3s deploy

This playbook renders Jinja templates and applies them with kubectl on a single node.
It supports deploying one app or multiple apps in sequence.

## Structure

- `deploy-k3s.yml`: top-level orchestration playbook
- `group_vars/all.yml`: default variables shared across all host groups
- `group_vars/k3s.yml`: optional overrides for the `k3s` host group
- `tasks/resolve-deployment-apps.yml`: resolves `app_name` / `app_names` / `app_names_csv`
- `tasks/dependencies.yml`: dependency orchestration task
- `tasks/dependencies/docker.yml`: Docker repository/packages/service
- `tasks/dependencies/k3s.yml`: k3s install and service management
- `tasks/dependencies/kubectl.yml`: kubectl command resolution and validation
- `tasks/gitlab-runner.yml`: optional GitLab Runner install/configuration
- `tasks/deploy-app.yml`: per-app orchestrator
- `tasks/deploy_app/prepare.yml`: load app vars and set paths
- `tasks/deploy_app/validate.yml`: validate app directory/inputs
- `tasks/deploy_app/image.yml`: resolve image tag and repository
- `tasks/deploy_app/build_push.yml`: build and push container image
- `tasks/deploy_app/render_apply.yml`: render/apply manifests and wait for rollout

## Requirements
- Ansible installed with required collections:
  ```
  ansible-galaxy collection install community.docker kubernetes.core
  ```
- docker and kubectl available on the target host
- k3s running and kubeconfig configured for kubectl

The playbook can auto-install deployment dependencies on Debian/Ubuntu targets (Docker Engine from Docker's official apt repository + `curl`), install k3s when missing, ensure the `k3s` service is running, and resolve Kubernetes CLI automatically (`kubectl` or `k3s kubectl`).

GitLab Runner setup is optional and disabled by default (`configure_gitlab_runner=false`).

When `registry` is local (`localhost:<port>` or `127.0.0.1:<port>`) and `build_image=true`, the playbook auto-ensures a local Docker registry container named `registry` is running.

## Usage
From the repo root:

Set your VM host in `ops/ansible/inventory.ini` first (SSH target), for example:

```
[k3s]
k3s-vm ansible_host=127.0.0.1 ansible_port=2222 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

`localhost` deployment is optional and should only be used when running directly on the cluster node.

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml
```

Target a specific inventory group:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "target_group=staging"
```

You can also target multiple grouped hosts defined in inventory (for example `k3s_all`).

Default deploy variables live in `ops/ansible/group_vars/k3s.yml`.
App configuration lives in `ops/ansible/apps/<app-name>.yml`. Override variables with `--extra-vars` when needed:

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

Sample app configs are provided in `ops/ansible/apps/frontend.yml`, `ops/ansible/apps/backend.yml`, and `ops/ansible/apps/db.yml`.
Those require matching application directories in the repo (`app/frontend/`, `app/backend/`, `app/db/`) when included in the deployment app list.

Ansible is the primary deployment interface. The wrapper script (`ops/k3s-deploy.sh`) is optional and only forwards variables to this playbook.

Use an existing tag (skip build/push):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "build_image=false tag=v1.2.3"
```

Disable local-registry auto-management:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "ensure_local_registry=false"
```

Disable dependency bootstrap:

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "install_dependencies=false"
```

Skip k3s installation (still checks for existing k3s/kubectl):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "install_k3s=false"
```

Install and configure GitLab Runner (Debian/Ubuntu):

```
ansible-playbook -i ops/ansible/inventory.ini ops/ansible/deploy-k3s.yml \
  --extra-vars "configure_gitlab_runner=true gitlab_runner_url=https://gitlab.com gitlab_runner_registration_token=<token>"
```

To add a new app, copy ops/ansible/apps/example-app.yml to ops/ansible/apps/<app-name>.yml and edit values.

