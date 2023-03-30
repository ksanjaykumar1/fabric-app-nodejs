import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { buildCCP, buildWallet } from './appUtil.js';
import { buildCAClient, enrollAdmin } from './caUtil.js';
import dotenv from 'dotenv';
import { FabricConnectionFail } from '../errors/index.js';
dotenv.config();

const { CONNECTING_ORG, CONNECTING_CA_HOST_NAME, WALLET_PATH, CONNECTING_MSP } =
  process.env;
const connecting_org = CONNECTING_ORG || 'org1';
const connecting_ca_host_name =
  CONNECTING_CA_HOST_NAME || 'ca.org1.example.com';
const connecting_msp = CONNECTING_MSP || 'Org1MSP';
const walletPath = WALLET_PATH || './wallet';

let ccp, caClient, wallet;

const fabricSetup = async () => {
  try {
    ccp = await buildCCP();
    caClient = buildCAClient(FabricCAServices, ccp, connecting_ca_host_name);
    wallet = await buildWallet(Wallets, walletPath);
    await enrollAdmin(caClient, wallet, connecting_msp);
    console.log('Fabric setup complete');
  } catch (error) {
    console.log('Fabric setup failed');
    throw new FabricConnectionFail(error);
  }
};

export { ccp, caClient, wallet, fabricSetup };
