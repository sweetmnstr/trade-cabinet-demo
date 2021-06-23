@echo off

call pm2 start gateway-lead
call pm2 start gateway-operator
call pm2 start service-users