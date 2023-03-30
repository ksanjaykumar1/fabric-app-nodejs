import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class FabricConnectionFail extends CustomAPIError {
  constructor(message) {
    super(`Fabric connection failed due to ${message}`);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default FabricConnectionFail;
