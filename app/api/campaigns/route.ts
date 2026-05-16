import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from('campaigns').insert({
    title: body.title, title_zh: body.titleZh,
    message: body.message, message_zh: body.messageZh,
    audience: body.audience, channel: body.channel,
    status: 'live', recipients: body.recipients || 0,
    sent_at: new Date().toISOString(),
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
