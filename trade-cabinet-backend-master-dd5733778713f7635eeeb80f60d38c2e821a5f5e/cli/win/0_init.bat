@echo off

cd ..

echo Init microservices...

cd ../gateway-lead
echo Gateway-lead
call pm2 start ./build --name gateway-lead
call pm2 stop gateway-lead

cd ../gateway-operator
echo Gateway-operator
call pm2 start ./build --name gateway-operator
call pm2 stop gateway-operator

cd ../service-users
echo Service-users
call pm2 start ./build --name service-users
call pm2 stop service-users
