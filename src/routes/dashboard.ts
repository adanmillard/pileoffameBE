import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, avatar_url')
    .limit(5);

  if(error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

export default router;
