import express from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../supabaseClient';

const router = express.Router();

router.post('/', verifyFirebaseToken, async (req: AuthRequest, res) => {

  try {
    await supabase.from('users').update({ username: req.body.username, "about_me": req.body.aboutMe }).eq('firebase_uid', req.user?.uid).select();

    return res.status(201).json({ message: "user updated" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });

  }
  });

export default router;

