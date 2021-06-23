@echo off
cd ..
echo Installing dependencies...

cd ../lib-clients
echo lib-clients
call npm install

cd ../lib-http-server
echo lib-http-server
call npm install

cd ../lib-rpc
echo lib-rpc
call npm install

cd ../gateway-lead
echo Gateway-lead
call npm install

cd ../gateway-operator
echo Gateway-operator
call npm install

cd ../service-users
echo Service-users
call npm install
