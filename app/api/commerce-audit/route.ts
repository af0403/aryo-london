import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
 if(createHash("sha256").update(request.headers.get("x-audit-access") || "").digest("hex") !== "befa06bdf7025b307b29bc029f7ea9cb2de64d385cd97c399c4c3d8d798769ca") return new Response(null,{status:404});
 const result: Record<string, unknown> = {};
 const env = process.env;
 result.config = Object.fromEntries(["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","RESEND_API_KEY","SUPABASE_SERVICE_ROLE_KEY","NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY","NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID","NEXT_PUBLIC_ARYO_WALLET_ADDRESS","NEXT_PUBLIC_SUPPORT_EMAIL","ARYO_CONTACT_FALLBACK_EMAIL"].map(k=>[k,Boolean(env[k] && !env[k]?.includes("placeholder"))]));
 result.stripeMode = env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "live" : "test-or-missing";
 result.email = {support:env.NEXT_PUBLIC_SUPPORT_EMAIL || null, contactInbox:env.ARYO_CONTACT_FALLBACK_EMAIL || "orders@aryo.london"};
 try {
  const {stripe}=await import("../../../lib/stripe");
  const a=await stripe.accounts.retrieve(null);
  const hooks=await stripe.webhookEndpoints.list({limit:100});
  result.stripe={chargesEnabled:a.charges_enabled,payoutsEnabled:a.payouts_enabled,country:a.country,businessName:a.business_profile?.name,supportEmail:a.business_profile?.support_email,receiptSettings:a.settings?.branding,webhooks:hooks.data.map(h=>({id:h.id,url:h.url,status:h.status,events:h.enabled_events}))};
 }catch{result.stripe={error:"Stripe connection failed"};}
 try {
  const response=await fetch("https://api.resend.com/domains",{headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`},cache:"no-store"});
  const data=await response.json();
  result.resend={status:response.status,domains:data.data?.map((d: {name:string;status:string})=>({name:d.name,status:d.status}))};
 }catch{result.resend={error:"Resend connection failed"};}
 try {
  const url=env.NEXT_PUBLIC_SUPABASE_URL!;const key=env.SUPABASE_SERVICE_ROLE_KEY!;
  const headers={apikey:key,Authorization:`Bearer ${key}`};
  const response=await fetch(`${url}/rest/v1/`,{headers,cache:"no-store"});
  const schema=await response.json();
  const table=schema.definitions?.customer_orders;
  result.database={status:response.status,customerOrdersColumns:table?.properties,customerOrdersRequired:table?.required};
  const check=await fetch(`${url}/rest/v1/customer_orders?select=id&limit=0`,{headers,cache:"no-store"});
  result.databaseAccess=check.status;
 }catch{result.database={error:"Database connection failed"};}
 return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});
}
