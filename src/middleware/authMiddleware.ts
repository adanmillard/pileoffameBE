import { Request, Response, NextFunction } from 'express';
import admin from '../firebaseAdmin';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "no token provided", authHeader});
  }

  const token = authHeader.replace('Bearer ', "").trim();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded Firebase Token:', decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Error verifying Firebase token:', error);
    return res.status(403).json({ message: 'Unauthorized: Invaild token', error: error.message });
  }
};
