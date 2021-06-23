# !bin/bash

cd ..

echo Init microservices...

cd ../gateway-lead
echo Gateway-lead
pm2 start ./build --name gateway-lead
pm2 stop gateway-lead

cd ../gateway-operator
echo Gateway-operator
pm2 start ./build --name gateway-operator
pm2 stop gateway-operator

cd ../service-users
echo Service-users
pm2 start ./build --name service-users
pm2 stop service-users
