import { StatusCodes } from 'http-status-codes';

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send(`Route doesn't Exist`);
};

export default notFound;
