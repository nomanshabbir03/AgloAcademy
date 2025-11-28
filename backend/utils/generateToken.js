import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d',
  });
};

export default generateToken;
