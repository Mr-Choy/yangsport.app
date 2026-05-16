import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function toAppCustomer(c: any) {
  const now = new Date();
  const lastVisit = c.last_visit ? new Date(c.last_visit) : null;
  const createdAt = c.created_at ? new Date(c.created_at) : now;
  const lastVisitDays = lastVisit ? Math.floor((now.getTime() - lastVisit.getTime()) / 86400000) : 999;
  const joinDays = Math.floor((now.getTime() - createdAt.getTime()) / 86400000);
  let status = 'active';
  if (joinDays <= 7) status = 'new';
  else if (lastVisitDays > 30) status = 'inactive';
  return { ...c, lastVisitDays, joinDays, status };
}

export async function GET() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).map(toAppCustomer));
}

export async function POST(req: Request) {
  const { phone, name } = await req.json();
  // upsert: return existing if phone exists
  const { data: existing } = await supabase
    .from('customers').select('*').eq('phone', phone).single();
  if (existing) return NextResponse.json(toAppCustomer(existing));
  const { data, error } = await supabase
    .from('customers').insert({ phone, name }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toAppCustomer(data));
}
