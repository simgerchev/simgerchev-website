#!/usr/bin/env bash
set -euo pipefail

# Defaults; can be overridden by flags below.
BUILD_IMAGE=true
TAG=""

usage() {
	echo "Usage: $0 [--no-build] [--tag <tag>]"
	echo "  --no-build   Skip docker build/import; requires --tag"
	echo "  --tag        Use an existing image tag"
}

# Simple flag parsing for optional build/tag behavior.
while [[ $# -gt 0 ]]; do
	case "$1" in
		--no-build)
			BUILD_IMAGE=false
			shift
			;;
		--tag)
			TAG="$2"
			shift 2
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "Unknown option: $1" >&2
			usage
			exit 1
			;;
	esac
done

# If no tag provided, generate one when building; otherwise require a tag.
if [[ -z "$TAG" ]]; then
	if [[ "$BUILD_IMAGE" == true ]]; then
		TAG=$(date +%Y%m%d-%H%M%S)
	else
		echo "--no-build requires --tag" >&2
		exit 1
	fi
fi

if [[ "$BUILD_IMAGE" == true ]]; then
	# Build and import the image into the local k3s container runtime.
	docker build -t simgerchev-website:$TAG frontend

	docker save -o simgerchev-website-$TAG.tar simgerchev-website:$TAG

	sudo mv simgerchev-website-$TAG.tar /var/lib/rancher/k3s/agent/images/

	sudo k3s ctr images import /var/lib/rancher/k3s/agent/images/simgerchev-website-$TAG.tar
fi

kubectl apply -f k8s/

kubectl -n simgerchev-website set image deployment/frontend frontend=simgerchev-website:$TAG

kubectl -n simgerchev-website rollout restart deployment/frontend

kubectl -n simgerchev-website rollout status deployment/frontend
