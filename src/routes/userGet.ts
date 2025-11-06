import express from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../supabaseClient';

const router = express.Router();

router.get('/', verifyFirebaseToken, async (req: AuthRequest, res) => {

  try {
    const uid = req.user!.uid;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', req.user?.uid)
      .single();

    return res.status(201).json({ data })
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });

  }
  });

export default router;

