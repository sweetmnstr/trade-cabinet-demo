# !bin/bash
cd ..

# microservices
echo Building microservices...

cd ../gateway-lead
echo Gateway-lead
rm -rf build
npm run build

cd ../gateway-operator
echo Gateway-operator
rm -rf build
npm run build

cd ../service-users
echo Service-users
rm -rf build
npm run build

echo done