#!/usr/bin/env bash
set -euo pipefail

# Defaults
APP_NAME="${1:-simgerchev-website}"
BUILD_IMAGE=true
TAG=""
REGISTRY="localhost:5000"

usage() {
	echo "Usage: $0 [APP_NAME] [--no-build] [--tag <tag>] [--registry <registry>]"
	echo ""
	echo "  APP_NAME     Application name (default: simgerchev-website)"
	echo "  --no-build   Skip docker build/push; requires --tag"
	echo "  --tag        Use an existing image tag"
	echo "  --registry   Registry URL (default: localhost:5000)"
	echo ""
	echo "Examples:"
	echo "  $0                           # Deploy simgerchev-website with new build"
	echo "  $0 another-app               # Deploy another-app with new build"
	echo "  $0 my-app --tag v1.2.3       # Deploy my-app using existing tag"
}

# Shift APP_NAME if it doesn't start with --
if [[ $# -gt 0 && ! "$1" =~ ^-- ]]; then
	shift
fi

# Parse flags
while [[ $# -gt 0 ]]; do
	case "$1" in
		--no-build)
			BUILD_IMAGE=false
			shift
			;;
		--tag)
			if [[ $# -lt 2 || -z "${2:-}" ]]; then
				echo "Error: --tag requires a value" >&2
				usage
				exit 1
			fi
			TAG="$2"
			shift 2
			;;
		--registry)
			if [[ $# -lt 2 || -z "${2:-}" ]]; then
				echo "Error: --registry requires a value" >&2
				usage
				exit 1
			fi
			REGISTRY="$2"
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

# Validate app directory exists
if [[ "$APP_NAME" == "simgerchev-website" ]]; then
	APP_DIR="frontend"
	K8S_DIR="k8s"
	NAMESPACE="simgerchev-website"
	DEPLOYMENT="frontend"
	CONTAINER="frontend"
else
	APP_DIR="$APP_NAME"
	K8S_DIR="k8s/$APP_NAME"
	NAMESPACE="$APP_NAME"
	DEPLOYMENT="$APP_NAME"
	CONTAINER="$APP_NAME"
fi

if [[ ! -d "$APP_DIR" ]]; then
	echo "Error: Application directory '$APP_DIR' not found" >&2
	exit 1
fi

# Generate tag if not provided
if [[ -z "$TAG" ]]; then
	if [[ "$BUILD_IMAGE" == true ]]; then
		TAG=$(date +%Y%m%d-%H%M%S)
	else
		echo "--no-build requires --tag" >&2
		exit 1
	fi
fi

IMAGE="$REGISTRY/$APP_NAME:$TAG"

echo "==> Deploying $APP_NAME"
echo "    Image: $IMAGE"
echo "    Namespace: $NAMESPACE"

if [[ "$BUILD_IMAGE" == true ]]; then
	echo "==> Building and pushing image..."
	docker build -t "$IMAGE" "$APP_DIR"
	docker push "$IMAGE"
fi

# Ensure namespace exists first
echo "==> Applying Kubernetes manifests..."
kubectl apply -f "$K8S_DIR/namespace.yaml" 2>/dev/null || true

# Apply remaining k8s resources
kubectl apply -f "$K8S_DIR/"

# Update deployment image
echo "==> Updating deployment to $IMAGE..."
kubectl -n "$NAMESPACE" set image deployment/"$DEPLOYMENT" "$CONTAINER=$IMAGE"

kubectl -n "$NAMESPACE" rollout restart deployment/"$DEPLOYMENT"

echo "==> Waiting for rollout..."
kubectl -n "$NAMESPACE" rollout status deployment/"$DEPLOYMENT"

echo "✓ Deployment complete!"
