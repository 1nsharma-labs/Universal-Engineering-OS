# Kubernetes Cheatsheet

## Essential kubectl Operations
```bash
kubectl get pods -A -o wide
kubectl logs -f deployment/universal-app -c app
kubectl top nodes
kubectl top pods
kubectl rollout restart deployment/universal-app
```

## Port Forwarding
```bash
kubectl port-forward svc/postgres 5432:5432
```
