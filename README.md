# synchronicity2

# setup development

```
$cp .env.default .env
```
Input your environment variables

```
$docker-compose up
```

Open http://localhost:3000/

# deploy

```
gcloud config set project project-id
```

```
kubectl create secret generic server-secret --from-env-file=./.env
```

```
docker build --tag=gcr.io/synchronicity2/synchronicity2-server --file=./Dockerfile .
docker build --tag=gcr.io/synchronicity2/synchronicity2-client --file=./Dockerfile .
```

```
docker push gcr.io/synchronicity2/synchronicity2-server
docker push gcr.io/synchronicity2/synchronicity2-client
```

```
gcloud beta container clusters create synchronicity2-cluster --num-nodes=2 --preemptible --addons=Istio
gcloud container clusters get-credentials synchronicity2-cluster
```

```
kubectl label namespace default istio-injection=enabled
kubectl apply -f istio/server.yaml
kubectl apply -f istio/client.yaml
kubectl apply -f istio/gateway.yaml
```

```
kubectl get service istio-ingressgateway -n istio-system
```