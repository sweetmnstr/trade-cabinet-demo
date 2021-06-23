@echo off
cd  ..

cd ../service-users
call npm run migrate:run
timeout -t 5