# fabric-app-nodejs

## How to use
1. Create folder called connectionProfiles
2. add the CCP of org1 and org2 in the connectionProfiles
3. Remember to replace the CCP file whenever a new network is created

## Sample ENV

PORT=3000
WALLET_PATH='./wallet'
CONNECTING_ORG='org1'
CONNECTING_MSP='Org1MSP'
CONNECTING_CA_HOST_NAME ='ca.org1.example.com'
CONNECTING_ADMIN_USER_ID ='admin'
CONNECTING_ADMIN_USER_PASSWD ='adminpw'
CONNECTING_CCP_FILE_PATH ='./connectionProfiles/connection-org1.json'

## TODO
1. ErrorHanlder
  1. Enrollment failure due to user already registered
  2. Identity doesn't exit in the wallet


## Steps for setting up docker container
1. In connection profile add your IP address
2. command to build image 
docker build --target development . -t fabric-server

## To run docker container
docker-compose up -d 