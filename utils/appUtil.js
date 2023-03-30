import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import NotFoundError from '../errors/not-found.js';
const { CONNECTING_CCP_FILE_PATH } = process.env;
const connecting_ccp_file_path =
  CONNECTING_CCP_FILE_PATH || './connectionProfiles/connection-org1.json';

const buildCCP = async (org) => {
  const ccp = JSON.parse(
    fs.readFileSync(connecting_ccp_file_path)
  );
  if (!ccp) {
    throw new NotFoundError(`CCP file doesn't exit`);
  }
  return ccp;
};

const buildWallet = async (Wallets, walletPath) => {
  // create a new wallet
  let wallet;
  if (walletPath) {
    wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Buit a file system wallet at ${walletPath}`);
  } else {
    wallet = await Wallets.newInMemoryWallet();
    console.log(`Built an in memory wallet`);
  }
  return wallet
};

const prettyJSONString = (inputString) => {
  return JSON.stringify(JSON.parse(inputString), null, 2);
};

export { buildCCP, buildWallet, prettyJSONString };
