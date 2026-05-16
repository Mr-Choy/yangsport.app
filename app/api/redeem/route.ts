import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { customerId, amount, note } = await req.json();
  const { error } = await supabase.rpc('redeem_stamp', { cust_id: customerId, amount, reward_note: note || '' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = await supabase.from('customers').select('*').eq('id', customerId).single();
  return NextResponse.json({ success: true, customer: data });
}
