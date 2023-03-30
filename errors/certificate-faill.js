import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class CertificateFail extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export default CertificateFail;
