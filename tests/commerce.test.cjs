const { test } = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const ts = require("typescript");
const fs = require("node:fs");
Module._extensions[".ts"] = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
process.env.CHECKOUT_SIGNING_SECRET = "unit-test-signing-key-no-live-services";
process.env.ARYO_COMMERCE_ENABLED = "true";
process.env.STRIPE_SECRET_KEY = "sk_test_unit";
process.env.SUPABASE_SERVICE_ROLE_KEY = "unit";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
process.env.RESEND_API_KEY = "unit";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_unit";
const records = [];
let sends = 0,
  creates = 0;
const chain = {
  transaction: null,
  receipt: null,
  head: 10n,
  block: { timestamp: BigInt(Math.floor(Date.now() / 1000)) },
};
const rpc = {
  getTransaction: async () => chain.transaction,
  getTransactionReceipt: async () => chain.receipt,
  getBlockNumber: async () => chain.head,
  getBlock: async () => chain.block,
};
function query() {
  let filters = [],
    mode = "select",
    values,
    selection;
  const q = {
    select(s) {
      selection = s;
      return q;
    },
    eq(k, v) {
      filters.push((r) => r[k] === v);
      return q;
    },
    in(k, v) {
      filters.push((r) => v.includes(r[k]));
      return q;
    },
    insert(v) {
      mode = "insert";
      values = v;
      return q;
    },
    update(v) {
      mode = "update";
      values = v;
      return q;
    },
    order() {
      return q;
    },
    limit() {
      return q;
    },
    async single() {
      const r = await q;
      return { ...r, data: Array.isArray(r.data) ? r.data[0] || null : r.data };
    },
    async maybeSingle() {
      return q.single();
    },
    then(resolve, reject) {
      return Promise.resolve()
        .then(() => {
          if (mode === "insert") {
            if (records.some((r) => r.id === values.id))
              return { data: null, error: { code: "23505" } };
            records.push({ ...values, created_at: new Date().toISOString() });
            return { data: null, error: null };
          }
          const rows = records.filter((r) => filters.every((f) => f(r)));
          if (mode === "update") rows.forEach((r) => Object.assign(r, values));
          return { data: rows, error: null };
        })
        .then(resolve, reject);
    },
  };
  return q;
}
const intents = new Map();
const Stripe = require("stripe");
const sdk = new Stripe("sk_test_unit");
const stripe = {
  paymentIntents: {
    async create(params, options) {
      creates++;
      const id = "pi_" + options.idempotencyKey;
      let i = intents.get(id);
      if (!i) {
        i = {
          id,
          client_secret: "secret",
          ...params,
          status: "requires_payment_method",
        };
        intents.set(id, i);
      }
      return i;
    },
    async update(id, params) {
      const i = intents.get(id);
      i.metadata = { ...i.metadata, ...params.metadata };
      return i;
    },
    async retrieve(id) {
      return intents.get(id);
    },
    async cancel(id) {
      intents.get(id).status = "canceled";
    },
  },
  charges: {
    async retrieve() {
      return { receipt_url: "https://pay.stripe.com/test" };
    },
  },
  webhooks: sdk.webhooks,
};
const load = Module._load;
Module._load = function (request, parent, isMain) {
  if (request.endsWith("/lib/stripe") || request === "../stripe")
    return { stripe };
  if (request === "@supabase/supabase-js")
    return { createClient: () => ({ from: () => query() }) };
  if (request === "viem")
    return { ...load.apply(this, arguments), createPublicClient: () => rpc };
  if (request === "resend")
    return {
      Resend: class {
        emails = {
          send: async () => {
            sends++;
            return { data: { id: "email_" + sends }, error: null };
          },
        };
      },
    };
  return load.apply(this, arguments);
};
const security = require("../lib/commerce/security.ts");
const orders = require("../lib/commerce/orders.ts");
const checkout = require("../app/api/checkout/route.ts");
const email = require("../app/api/send-email/route.ts");
const webhook = require("../app/api/stripe/webhook/route.ts");
const { validateCheckoutItems } = require("../lib/checkout.ts");
const customer = {
  firstName: "Aryo",
  lastName: "Test",
  email: "test@example.invalid",
  address: {
    line1: "1 Test Street",
    city: "London",
    postcode: "SW1A 1AA",
    country: "United Kingdom",
  },
};
const request = (body, origin = "https://aryo.london") =>
  new Request("https://aryo.london/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(body),
  });
const valid = {
  items: [{ slug: "structure-jacket-noir", size: "M", quantity: 1 }],
  customerDetails: customer,
  attemptId: "12345678-1234-4234-a234-123456789012",
};
test("signed order links reject tampering, wrong purpose and expiry", () => {
  const token = security.signToken({ id: "one" }, "receipt");
  assert.equal(security.readToken(token, "receipt").id, "one");
  assert.throws(() => security.readToken(token + "x", "receipt"));
  assert.throws(() => security.readToken(token, "crypto-quote"));
  assert.throws(() =>
    security.readToken(security.signToken({}, "receipt", -1), "receipt"),
  );
});
test("cart validation rejects malformed, hidden, fractional and excessive quantities", () => {
  for (const items of [
    null,
    {},
    [null],
    [{ slug: "test-product", size: "M", quantity: 1 }],
    [{ slug: "structure-jacket-noir", size: "M", quantity: 1.5 }],
    [{ slug: "structure-jacket-noir", size: "M", quantity: 21 }],
  ])
    assert.ok(validateCheckoutItems(items).errors.length);
});
test("checkout validates before creating a payment and never simulates success", async () => {
  let count = creates;
  for (const body of [
    {},
    { ...valid, customerDetails: {} },
    { ...valid, items: [{ slug: "bad", size: "M", quantity: 1 }] },
  ]) {
    assert.equal((await checkout.POST(request(body))).status, 400);
  }
  assert.equal(creates, count);
  assert.equal(
    (await checkout.POST(request(valid, "https://evil.invalid"))).status,
    400,
  );
  const saved = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  assert.equal((await checkout.POST(request(valid))).status, 503);
  process.env.STRIPE_SECRET_KEY = saved;
});
test("server prices, saves pending order and repeated checkout uses the same intent", async () => {
  const first = await (await checkout.POST(request(valid))).json();
  assert.ok(first.clientSecret);
  assert.ok(first.receiptToken);
  assert.equal(records.length, 1);
  assert.equal(records[0].total_pence, 25000);
  assert.equal(records[0].status, "pending");
  const again = await (await checkout.POST(request(valid))).json();
  assert.equal(again.orderId, first.orderId);
  assert.equal(records.length, 1);
});
test("only verified matching payment can produce a confirmation; retries do not resend", async () => {
  const intent = [...intents.values()][0];
  await assert.rejects(orders.finaliseCardOrder(intent));
  assert.equal(sends, 0);
  intent.status = "succeeded";
  intent.amount_received = 24999;
  await assert.rejects(orders.finaliseCardOrder(intent));
  assert.equal(sends, 0);
  intent.amount_received = 25000;
  intent.latest_charge = "ch_unit";
  await orders.finaliseCardOrder(intent);
  await orders.finaliseCardOrder(intent);
  assert.equal(records[0].status, "paid");
  assert.equal(sends, 1);
});
test("receipt escapes customer content and includes quantity, reference, total and support", () => {
  const order = { ...records[0], customer_name: "<img src=x> Test" };
  const { html, text } = orders.buildOrderEmail(order);
  assert.ok(!html.includes("<img src=x>"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(html.includes("Quantity 1"));
  assert.ok(text.includes("£250.00"));
  assert.ok(text.includes("support@aryo.london"));
  assert.ok(html.includes(orders.orderNumber(order.id)));
});
test("public email endpoint cannot send a forged order confirmation", async () => {
  const count = sends;
  assert.equal(
    (
      await email.POST(
        request({ to: "someone@example.invalid", items: [], total: 1 }),
      )
    ).status,
    403,
  );
  assert.equal(sends, count);
});
test("Stripe webhook rejects unsigned and tampered requests, accepts valid signed events", async () => {
  assert.equal((await webhook.POST(request({}))).status, 400);
  const intent = [...intents.values()][0];
  const payload = JSON.stringify({
    id: "evt_unit",
    type: "payment_intent.succeeded",
    data: { object: intent },
  });
  const signature = sdk.webhooks.generateTestHeaderString({
    payload,
    secret: "whsec_unit",
  });
  const signed = new Request("https://aryo.london/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload,
  });
  assert.equal((await webhook.POST(signed)).status, 200);
  assert.equal(sends, 1);
  const bad = new Request("https://aryo.london/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload + " ",
  });
  assert.equal((await webhook.POST(bad)).status, 400);
});
test("receipt preview is clearly labelled as test and renders with no customer data", () => {
  const demo = {
    ...records[0],
    customer_email: "aryocyrus@yahoo.co.uk",
    customer_name: "Aryo",
    shipping_address: {
      line1: "Example delivery address",
      city: "London",
      postcode: "EXAMPLE",
      country: "United Kingdom",
    },
  };
  const { html, text } = orders.buildOrderEmail(demo, undefined, true);
  assert.ok(text.includes("NO PAYMENT TAKEN"));
  fs.mkdirSync("output/commerce", { recursive: true });
  fs.writeFileSync("output/commerce/receipt-preview.html", html);
});

const cryptoConfirm = require("../app/api/crypto/confirm/route.ts");
test("crypto verification checks confirmations, recipient, amount, status and replay before emailing", async () => {
  const now = Math.floor(Date.now() / 1000),
    hash = "0x" + "a".repeat(64),
    payer = "0x" + "1".repeat(40),
    wallet = "0x" + "2".repeat(40);
  const quote = {
    id: "quote-one",
    payer,
    wallet,
    wei: "1000",
    totalPence: 25000,
    issuedAt: now - 10,
    expiresAt: now + 1800,
    customer,
    items: records[0].items,
  };
  const body = {
    transactionHash: hash,
    quoteToken: security.signToken(quote, "crypto-quote"),
  };
  const before = sends;
  assert.equal((await cryptoConfirm.POST(request(body))).status, 202);
  chain.transaction = { from: payer, to: wallet, value: 1000n };
  chain.receipt = { status: "success", blockNumber: 10n };
  assert.equal((await cryptoConfirm.POST(request(body))).status, 202);
  chain.head = 11n;
  chain.transaction.value = 999n;
  assert.equal((await cryptoConfirm.POST(request(body))).status, 400);
  chain.transaction.value = 1000n;
  chain.transaction.to = payer;
  assert.equal((await cryptoConfirm.POST(request(body))).status, 400);
  chain.transaction.to = wallet;
  chain.receipt.status = "reverted";
  assert.equal((await cryptoConfirm.POST(request(body))).status, 400);
  chain.receipt.status = "success";
  assert.equal(sends, before);
  const result = await cryptoConfirm.POST(request(body));
  assert.equal(result.status, 200);
  assert.ok((await result.json()).receiptToken);
  assert.equal(sends, before + 1);
  assert.equal((await cryptoConfirm.POST(request(body))).status, 200);
  assert.equal(sends, before + 1);
  const replay = {
    ...body,
    quoteToken: security.signToken(
      { ...quote, id: "another-quote" },
      "crypto-quote",
    ),
  };
  assert.equal((await cryptoConfirm.POST(request(replay))).status, 409);
  assert.equal(sends, before + 1);
});
