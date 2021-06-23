@echo off

git pull

cd cli/win

call 1_install.bat
REM call 2_build-libs.bat
call 3_build-services.bat
call 4_stop.bat
call 5_migrate.bat
call 6_start.bat
