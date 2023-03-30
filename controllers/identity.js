import { StatusCodes } from 'http-status-codes';
import {
  registerAndEnrollUser,
  reEnrollUser,
  revokeUser,
} from '../utils/caUtil.js';
import { caClient, wallet } from '../utils/fabric-setup.js';

const { CONNECTING_MSP } = process.env;
const registerAndEnroll = async (req, res) => {
  const { userId, affiliation, attrs } = req.body;
  await registerAndEnrollUser(
    caClient,
    wallet,
    CONNECTING_MSP,
    userId,
    affiliation,
    attrs
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: `${userId} registered and enrolled into CA successfully` });
};
const reEnroll = async (req, res) => {
  const { userId, affiliation, attrs } = req.body;
  await reEnrollUser(caClient, wallet, CONNECTING_MSP, userId, attrs);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `${userId} reenrolled into CA successfully` });
};
const revoke = async (req, res) => {
  const { userId, affiliation, attrs } = req.body;
  await revokeUser(caClient, wallet, CONNECTING_MSP, userId, attrs);
  res.status(StatusCodes.CREATED).json({ msg: `${userId} revoked ` });
};
export { registerAndEnroll, reEnroll, revoke };
