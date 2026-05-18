import { supabase } from './supabase';
import {
  customerFromRow, transactionFromRow, stringingFromRow, rewardFromRow,
  type CustomerRow, type TransactionRow, type StringingRow, type RewardRow,
} from './mappers';
import type { Customer, Reward, StringingService, Transaction } from './types';

function client() {
  if (!supabase) throw new Error('Supabase client not initialized — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  return supabase;
}

// ─── reads ─────────────────────────────────────────────────────
export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await client()
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CustomerRow[]).map(customerFromRow);
}

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await client()
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? customerFromRow(data as CustomerRow) : null;
}

export async function fetchCustomerByPhone(phone: string): Promise<Customer | null> {
  const { data, error } = await client()
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();
  if (error) throw error;
  return data ? customerFromRow(data as CustomerRow) : null;
}

export async function fetchTransactions(customerId: string): Promise<Transaction[]> {
  const { data, error } = await client()
    .from('transactions')
    .select('*')
    .eq('customer_id', customerId)
    .in('type', ['earn', 'redeem'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as TransactionRow[]).map(transactionFromRow);
}

export async function fetchStringing(customerId: string): Promise<StringingService[]> {
  const { data, error } = await client()
    .from('stringing_services')
    .select('*')
    .eq('customer_id', customerId)
    .order('service_date', { ascending: false });
  if (error) throw error;
  return (data as StringingRow[]).map(stringingFromRow);
}

export async function fetchRewards(): Promise<Reward[]> {
  const { data, error } = await client()
    .from('rewards')
    .select('*')
    .order('threshold', { ascending: true });
  if (error) throw error;
  return (data as RewardRow[]).map(rewardFromRow);
}

// ─── mutations (RPCs preferred per the schema) ─────────────────
export async function rpcAddStamp(customerId: string): Promise<void> {
  const { error } = await client().rpc('add_stamp', { cust_id: customerId });
  if (error) throw error;
}

export async function rpcRedeem(customerId: string, amount: number): Promise<void> {
  const { error } = await client().rpc('redeem_stamp', { cust_id: customerId, amount });
  if (error) throw error;
}

export async function rpcRecordStringing(
  customerId: string,
  data: {
    racketBrand: string; racketModel: string;
    stringBrand: string; stringModel: string;
    tension: number;
    serviceDate?: string; // ISO date 'YYYY-MM-DD'
  },
): Promise<void> {
  const { error } = await client().rpc('record_stringing', {
    cust_id: customerId,
    r_brand: data.racketBrand,
    r_model: data.racketModel,
    s_brand: data.stringBrand,
    s_model: data.stringModel,
    tension: data.tension,
    s_date: data.serviceDate ?? new Date().toISOString().slice(0, 10),
  });
  if (error) throw error;
}

export async function createCustomerRow(input: { phone: string; name: string }): Promise<Customer> {
  const { data, error } = await client()
    .from('customers')
    .insert({ phone: input.phone, name: input.name })
    .select('*')
    .single();
  if (error) throw error;
  return customerFromRow(data as CustomerRow);
}

export async function updateRewardActive(rewardId: string, active: boolean): Promise<void> {
  const { error } = await client()
    .from('rewards')
    .update({ is_active: active })
    .eq('id', rewardId);
  if (error) throw error;
}
