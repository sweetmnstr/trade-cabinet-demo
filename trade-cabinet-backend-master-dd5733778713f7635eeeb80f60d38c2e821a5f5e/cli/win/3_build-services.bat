@echo off
cd ..

REM microservices
echo Building microservices...

cd ../gateway-lead
echo Gateway-lead
RMDIR build /s /q build 2>nul
call npm run build

cd ../gateway-operator
echo Gateway-operator
RMDIR build /s /q build 2>nul
call npm run build

cd ../service-users
echo Service-users
RMDIR build /s /q build 2>nul
call npm run build

echo done