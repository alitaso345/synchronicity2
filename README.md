# synchronicity2

# setup development

```
$cp .env.default .env
```
Input your environment variables

```
$docker-compose up proxy
$cd client & yarn dev
```

# deploy

```
gcloud config set project project-id
gcloud config set compute/zone us-west1-c
```

```
docker build --tag=gcr.io/synchronicity2/synchronicity2-server --file=./docker/server.Dockerfile .
docker build --tag=gcr.io/synchronicity2/synchronicity2-client --file=./docker/client.Dockerfile .
```

```
docker push gcr.io/synchronicity2/synchronicity2-server
docker push gcr.io/synchronicity2/synchronicity2-client
```

```
gcloud container clusters create synchronicity2-cluster --num-nodes=2 --preemptible --machine-type=g1-small
gcloud container clusters get-credentials synchronicity2-cluster
kubectl create secret generic server-secret --from-env-file=./.env
kubectl apply -f k8s
```

```
gcloud beta container clusters create synchronicity2-cluster --num-nodes=2 --preemptible --machine-type=g1-small --addons=Istio
gcloud container clusters get-credentials synchronicity2-cluster
kubectl create secret generic server-secret --from-env-file=./.env
kubectl label namespace default istio-injection=enabled
kubectl apply -f istio
```

```
kubectl set image deployment/client client=gcr.io/synchronicity2/synchronicity2-client:v2
```