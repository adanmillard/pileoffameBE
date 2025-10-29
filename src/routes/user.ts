import express from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/authMiddleware';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

router.post('/', verifyFirebaseToken, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name, picture } = req.user!;

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {

      console.error('Error fetching user from Supabase:', fetchError);
      return res.status(500).json({ message: 'Error Checking user!' });
    }

    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            firebase_uid: uid,
            email: email,
            name: name || '',
            avatar_url: picture || '',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user into Supabase:', insertError);
        return res.status(500).json({ message: 'Error creating user!' });
      }

      return res.status(201).json({ message: 'User created', user: newUser });
    }

    return res.status(200).json({ message: 'User exists', user: existingUser });

  } catch (error) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  });

export default router;

