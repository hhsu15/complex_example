# Example of a complex program using multi containers
## Build Multi-Container Application
First, we are building an application that's quite complex, the app will have:
  - A website(react app) that allows user to enter fibonacci index
  - A server API that takes the index and send to two places
    - redis 
    - postgres db
Refer to the repo ```coplex_example```
- we will create a Dockerfile.dev (for development) for each one - client, server, w    orker
- notice that for server and worker we will use "nodeomn" whcih has the commandline     tool to automatically reload your entire project where there is a change to your sou    rce code. We will set up the volume (to reference your local files) so nodemon will     be able to detect the changes. In react this is already taken care of.
### Workflow design
We are going to have a lof of containers! Here we build the images for react app, ex    press server, worker ourselves. Essentially all these 5 commponents are individual c    ontainers.
```
Input data in web broswer
--> Nginx 
   --> React Server
         |
         V
   --> Express Server
        --> Redis <---> Worker
        
        --> Prostgres
```
- we will make a docker-compose file to make this happen easily! Refer to the repo.
- Then, for the Nginx, we will have a config file for the purpose of routing, i.e, 
  - if coming to '/' send to client upstream
  - if coming to '/api' send to server upstream
- create a dockerfile for nginx to hookup the default.conf
