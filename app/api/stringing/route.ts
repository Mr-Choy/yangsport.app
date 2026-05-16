import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');
  const query = supabase.from('stringing_services').select('*').order('service_date', { ascending: false });
  if (customerId) query.eq('customer_id', customerId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // convert to app format (daysAgo)
  const now = new Date();
  const result = (data || []).map(s => ({
    ...s,
    id: s.id,
    racketBrand: s.racket_brand, racketModel: s.racket_model,
    stringBrand: s.string_brand, stringModel: s.string_model,
    tension: s.tension_lbs,
    daysAgo: Math.floor((now.getTime() - new Date(s.service_date).getTime()) / 86400000),
    note: s.note || '',
  }));
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { customerId, racketBrand, racketModel, stringBrand, stringModel, tension, note } = await req.json();
  const { error } = await supabase.rpc('record_stringing', {
    cust_id: customerId,
    r_brand: racketBrand, r_model: racketModel,
    s_brand: stringBrand, s_model: stringModel,
    tension, s_note: note || '',
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
