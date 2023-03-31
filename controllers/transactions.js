import { Gateway } from 'fabric-network';
import { StatusCodes } from 'http-status-codes';
import { prettyJSONString } from '../utils/appUtil.js';
import { ccp, wallet } from '../utils/fabric-setup.js';

const submitTransaction = async (req, res) => {
  const { userId, channelName, chaincode, functionName, chaincodeAgrs } = req.body
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincode);
  let result = await contract.submitTransaction(functionName, ...chaincodeAgrs);
  res.status(StatusCodes.OK).json({ result: JSON.parse(result) });
};
const evaluateTransaction = async (req, res) => {
  const { userId, channelName, chaincode, functionName, chaincodeAgrs } =
    req.body;
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincode);
  let result = await contract.evaluateTransaction(
    functionName,
    ...chaincodeAgrs
  );
  res
    .status(StatusCodes.OK)
    .json({ result: JSON.parse(result) });
};
export { submitTransaction, evaluateTransaction };
