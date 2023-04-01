import dotenv from 'dotenv';
import { CertificateFail } from '../errors/index.js';
dotenv.config();
const { CONNECTING_ADMIN_USER_ID, CONNECTING_ADMIN_USER_PASSWD } = process.env;

const connecting_admin_user_Id = CONNECTING_ADMIN_USER_ID || 'admin';
const connecting_admin_user_passwd = CONNECTING_ADMIN_USER_PASSWD || 'admin';

const enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    console.log(connecting_admin_user_Id);
    const identity = await wallet.get(connecting_admin_user_Id);
    if (identity) {
      console.log(`And identity fro the admin user already exists`);
      return;
    }
    console.log(connecting_admin_user_Id);
    const enrollment = await caClient.enroll({
      enrollmentID: connecting_admin_user_Id,
      enrollmentSecret: connecting_admin_user_passwd,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };
    await wallet.put(connecting_admin_user_Id, x509Identity);
    console.log(
      `Successfully enrolled admin user and imported it into the wallet`
    );
  } catch (error) {
    console.log(`Failed to enroll admin user: ${error}`);
  }
};

const registerAndEnrollUser = async (
  caClient,
  wallet,
  orgMspId,
  userId,
  affiliation,
  attrs
) => {
  const userIdentity = await wallet.get(userId);
  if (userIdentity) {
    console.log(
      `An identity for the user ${userId} already exist in the wallet`
    );
    throw new CertificateFail(
      `An identity for the user ${userId} already exist in the wallet`
    );
  }
  const adminIdentity = await wallet.get(connecting_admin_user_Id);
  if (!adminIdentity) {
    // call enroll admin
  }

  // build object for authenticating with CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(
    adminIdentity,
    connecting_admin_user_Id
  );

  // Register the user
  try {
    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: 'client',
        attrs: attrs,
      },
      adminUser
    );
    console.log(secret);
    // enroll the user
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });
    // import the new identity into the wallet
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };
    // create file wallet
    await wallet.put(userId, x509Identity);
    console.log(
      `Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );
  } catch (error) {
    // console.log(error.errors[0].code);
    // if (error.errors[0].code == 74) {
    //   reEnrollByAdmin(caClient, wallet, orgMspId, userId, affiliation, attrs);
    // }
    throw new CertificateFail(error);
  }
};
const reEnrollByAdmin = async (caClient, wallet, orgMspId, userId, attrs) => {
  const adminIdentity = await wallet.get(connecting_admin_user_Id);
  if (!adminIdentity) {
    // call enroll admin
  }

  // build object for authenticating with CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(
    adminIdentity,
    connecting_admin_user_Id
  );
  const enrollment = await caClient.reenroll(adminUser, attrs);
  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: orgMspId,
    type: 'X.509',
  };
  // create file wallet
  await wallet.put(userId, x509Identity);
  console.log(
    `Successfully reenrolled user ${userId} and imported it into the wallet`
  );
};
const reEnrollUser = async (caClient, wallet, orgMspId, userId, attrs) => {
  const userIdentity = await wallet.get(userId);
  if (!userIdentity) {
    throw new CertificateFail(
      `An identity for the ${userId} user doesn't exists in the wallet`
    );
  }
  const provider = wallet.getProviderRegistry().getProvider(userIdentity.type);
  const user = await provider.getUserContext(userIdentity, userId);
  const enrollment = await caClient.reenroll(user, attrs);
  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: orgMspId,
    type: 'X.509',
  };
  // create file wallet
  await wallet.put(userId, x509Identity);
  console.log(
    `Successfully reenrolled user ${userId} and imported it into the wallet`
  );
};

const revokeUser = async (
  caClient,
  wallet,
  orgMspId,
  userId,
  affiliation,
  attrs
) => {
  const adminIdentity = await wallet.get(connecting_admin_user_Id);
  if (!adminIdentity) {
    // call enroll admin
  }

  // build object for authenticating with CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(
    adminIdentity,
    connecting_admin_user_Id
  );

  // revoke  the user
  let revokeRequest = {
    enrollmentID: userId,
  };
  const revoke = await caClient.revoke(revokeRequest, adminUser);
  console.log(revoke);
  const userIdentity = await wallet.get(userId);
  // remove from file wallet if it exits
  if (userIdentity) {
    await wallet.remove(userId);
  }
  console.log(`Successfully revoke ${userId} `);
};

const buildCAClient = (FabricCAServices, ccp, caHostName) => {
  // creates a new CA client for interacting with CA.
  const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

export {
  enrollAdmin,
  buildCAClient,
  registerAndEnrollUser,
  reEnrollUser,
  revokeUser,
};
