# !bin/bash
cd ..

# Libs
echo Building libs...

cd ../lib-clients
echo lib-clients
npm run build

cd ../lib-http-server
echo lib-http-server
npm run build

cd ../lib-rpc
echo lib-rpc
npm run build

echo done