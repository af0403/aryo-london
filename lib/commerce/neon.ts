import { Pool } from "pg";

let pool: Pool | undefined;
export function commercePool() {
  if (!pool) {
    const url = new URL(process.env.DATABASE_URL!);
    for (const key of [
      "sslmode",
      "sslcert",
      "sslkey",
      "sslrootcert",
      "uselibpqcompat",
    ])
      url.searchParams.delete(key);
    pool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true },
      max: 4,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}
const fields = new Set([
  "id",
  "created_at",
  "customer_email",
  "customer_name",
  "items",
  "total_pence",
  "stripe_payment_intent_id",
  "status",
  "shipping_address",
]);
function column(name: string) {
  if (!fields.has(name)) throw new Error("Unsupported order field");
  return `"${name}"`;
}
// Restricted server-side adapter: identifiers are allowlisted and every value is bound.
class OrderQuery {
  private columns = "*";
  private values: unknown[] = [];
  private filters: string[] = [];
  private patch?: Record<string, unknown>;
  private cap = 100;
  private sorting = "";
  private singular = false;
  private required = false;
  select(names: string) {
    this.columns = names === "*" ? "*" : names.split(",").map(column).join(",");
    return this;
  }
  update(patch: Record<string, unknown>) {
    Object.keys(patch).forEach(column);
    this.patch = patch;
    return this;
  }
  private filter(name: string, op: string, value: unknown) {
    this.values.push(value);
    this.filters.push(`${column(name)} ${op} $${this.values.length}`);
    return this;
  }
  eq(name: string, value: unknown) {
    return this.filter(name, "=", value);
  }
  lt(name: string, value: unknown) {
    return this.filter(name, "<", value);
  }
  in(name: string, value: unknown[]) {
    this.values.push(value);
    this.filters.push(`${column(name)} = ANY($${this.values.length})`);
    return this;
  }
  limit(count: number) {
    if (!Number.isInteger(count) || count < 0 || count > 100)
      throw new Error("Invalid order limit");
    this.cap = count;
    return this;
  }
  order(name: string, options: { ascending: boolean }) {
    this.sorting = ` ORDER BY ${column(name)} ${options.ascending ? "ASC" : "DESC"}`;
    return this;
  }
  single() {
    this.singular = true;
    this.required = true;
    return this;
  }
  maybeSingle() {
    this.singular = true;
    return this;
  }
  private async execute() {
    try {
      const values = [...this.values];
      let sql: string;
      if (this.patch) {
        if (!this.filters.length)
          throw new Error("Order update needs a filter");
        const assignments = Object.entries(this.patch).map(([key, value]) => {
          values.push(
            key === "shipping_address" || key === "items"
              ? JSON.stringify(value)
              : value,
          );
          return `${column(key)}=$${values.length}`;
        });
        sql = `UPDATE public.customer_orders SET ${assignments.join(",")} WHERE ${this.filters.join(" AND ")} RETURNING *`;
      } else
        sql = `SELECT ${this.columns} FROM public.customer_orders${this.filters.length ? ` WHERE ${this.filters.join(" AND ")}` : ""}${this.sorting} LIMIT ${this.singular ? 2 : this.cap}`;
      const { rows } = await commercePool().query(sql, values);
      if (this.singular && (rows.length > 1 || (this.required && !rows.length)))
        throw new Error("Order not found or ambiguous");
      return { data: this.singular ? rows[0] || null : rows, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
  then<TResult1 = { data: any; error: Error | null }, TResult2 = never>(
    resolve?:
      | ((value: {
          data: any;
          error: Error | null;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(resolve, reject);
  }
}
export function neonOrderDatabase() {
  return {
    from(table: string) {
      if (table !== "customer_orders")
        throw new Error("Unsupported order table");
      return new OrderQuery();
    },
    async rpc(
      name: string,
      args: { order_data: Record<string, unknown>; stock_limits: unknown[] },
    ) {
      if (name !== "create_store_order")
        throw new Error("Unsupported order operation");
      try {
        const result = await commercePool().query(
          "SELECT public.create_store_order($1::jsonb,$2::jsonb)",
          [JSON.stringify(args.order_data), JSON.stringify(args.stock_limits)],
        );
        return { data: result.rows[0], error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
  };
}
