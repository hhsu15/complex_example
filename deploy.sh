# deployment script 
# we will build the images with two tags, one for latest and one with SHA
# we will with SHA to make sure we always get the latest build image
docker build -t hhsu15/multi-client:latest -t hhsu15/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t hhsu15/multi-server:latest -t hhsu15/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t hhsu15/multi-worker:latest -t hhsu15/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push hhsu15/multi-client:latest
docker push hhsu15/multi-server:latest
docker push hhsu15/multi-worker:latest

docker push hhsu15/multi-client:$SHA
docker push hhsu15/multi-server:$SHA
docker push hhsu15/multi-worker:$SHA

#since travis only downloads kubectl we can just the command
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=hhsu15/multi-server:$SHA
kubectl set image deployments/client-deployment client=hhsu15/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=hhsu15/multi-worker:$SHA
