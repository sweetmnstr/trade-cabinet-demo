@echo off
cd ..

REM Libs
echo Building libs...

cd ../lib-http-server
echo lib-http-server
RMDIR build /s /q build 2>nul
call npm run build

cd ../lib-clients
echo lib-clients
RMDIR build /s /q build 2>nul
call npm run build

cd ../lib-rpc
echo lib-rpc
RMDIR build /s /q build 2>nul
call npm run build