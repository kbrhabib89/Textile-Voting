import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { candidateId } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  const salt = process.env.IP_SALT_SECRET || 'secure-salt';
  const ipHash = crypto.createHmac('sha256', salt).update(clientIp).digest('hex');

  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('ip_hash', ipHash)
    .single();

  if (existingVote) {
    return res.status(400).json({ success: false, message: 'এই ডিভাইস বা নেটওয়ার্ক থেকে ইতিমধ্যে একবার ভোট দেওয়া হয়েছে!' });
  }

  const { error } = await supabase
    .from('votes')
    .insert([{ candidate_id: candidateId, ip_hash: ipHash }]);

  if (error) {
    return res.status(500).json({ success: false, message: 'ডাটাবেস এরর!' });
  }

  return res.status(200).json({ success: true, message: 'আপনার ভোট সফলভাবে জমা হয়েছে!' });
}denc
