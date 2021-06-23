# !bin/bash
chmod -R 755 cli

git pull
chmod -R 755 ./deploy.sh

cd cli/linux

./1_install.sh
# ./2_build-libs.sh
./3_build-services.sh
./4_stop.sh
./5_migrate.sh
./6_start.sh
