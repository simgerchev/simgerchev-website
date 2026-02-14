# from repo root
cd frontend

# unique tag (timestamp)
TAG=$(date +%Y%m%d-%H%M%S)

docker build -t simgerchev-website:$TAG .

docker save -o simgerchev-website-$TAG.tar simgerchev-website:$TAG
sudo mv simgerchev-website-$TAG.tar /var/lib/rancher/k3s/agent/images/

# update deployment to new tag
kubectl -n simgerchev-website set image deployment/frontend frontend=simgerchev-website:$TAG

# force restart just in case
kubectl -n simgerchev-website rollout restart deployment/frontend