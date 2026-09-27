//#region node_modules/.nitro/vite/services/ssr/assets/spots-CGM4tP9h.js
var _0002_spots_default = "-- Regions (zones in the header dropdown) and their fishing spots (beaches).\n-- Images are stored inline as base64; list queries must never select image_data.\n\ncreate table if not exists regions (\n  id            serial primary key,\n  name          text not null unique,\n  sort          int not null default 0,\n  image_data    text,\n  image_type    text,\n  image_focus   int not null default 50,\n  image_version int not null default 0\n);\n\ncreate table if not exists spots (\n  id            serial primary key,\n  region_id     int not null references regions (id) on delete restrict,\n  name          text not null,\n  profile       int not null,\n  seed          real not null default 0,\n  temp          int not null default 0,\n  wind          real not null default 1,\n  rain          int not null default 0,\n  coef          int not null default 0,\n  score         int not null default 0,\n  sort          int not null default 0,\n  image_data    text,\n  image_type    text,\n  image_focus   int not null default 50,\n  image_version int not null default 0,\n  unique (region_id, name)\n);\n\ncreate index if not exists spots_region_id_idx on spots (region_id);\n\ninsert into regions (name, sort) values\n  ('Cascais', 1),\n  ('Parque das Nações', 2),\n  ('Sintra', 3),\n  ('Almada', 4)\non conflict (name) do nothing;\n\ninsert into spots (region_id, name, profile, seed, temp, wind, rain, coef, score, sort)\nselect r.id, v.name, v.profile, v.seed, v.temp, v.wind, v.rain, v.coef, v.score, v.sort\nfrom (values\n  ('Parque das Nações', 'Parque das Nações', 0, 0.22,  1, 1.16,  4, -2, -1, 1),\n  ('Parque das Nações', 'Belém',             0, 0.34,  1, 1.08,  2, -1,  0, 2),\n  ('Parque das Nações', 'Algés',             0, 0.16,  0, 1.02,  1,  0,  0, 3),\n  ('Cascais',           'Oeiras',            0, 0,     0, 1,     0,  0,  0, 1),\n  ('Cascais',           'Cascais',           2, 0.08,  1, 0.94, -2,  1,  1, 2),\n  ('Cascais',           'Carcavelos',        3, 0.18,  0, 1.04,  1,  0,  0, 3),\n  ('Cascais',           'Estoril',           2, 0.28,  1, 0.9,  -3,  2,  1, 4),\n  ('Cascais',           'Guincho',           1, 0.45, -1, 1.34,  3, -1, -1, 5),\n  ('Sintra',            'Guincho',           1, 0.45, -1, 1.34,  3, -1, -1, 1),\n  ('Sintra',            'Praia Grande',      1, 0.62, -2, 1.42,  5, -2, -1, 2),\n  ('Sintra',            'Adraga',            1, 0.76, -2, 1.28,  4,  0,  0, 3),\n  ('Sintra',            'Magoito',           1, 0.91, -2, 1.36,  6, -3, -1, 4),\n  ('Almada',            'Costa da Caparica', 4, 0.2,   0, 1,     0,  0,  0, 1),\n  ('Almada',            'Fonte da Telha',    4, 0.5,   1, 1.18, -1,  2,  1, 2),\n  ('Almada',            'Trafaria',          4, 0.1,   1, 0.92,  2, -1,  0, 3)\n) as v (region, name, profile, seed, temp, wind, rain, coef, score, sort)\njoin regions r on r.name = v.region\non conflict (region_id, name) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_spots.sql": _0002_spots_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
/** All regions (sorted) with their spots; never selects image bytes. */
async function loadRegions() {
	const sql = await getSql();
	const [regions, spots] = await Promise.all([sql`
      select id, name, image_data is not null as has_image, image_version, image_focus
      from regions order by sort, id`, sql`
      select id, region_id, name, profile, seed, temp, wind, rain, coef, score,
             image_data is not null as has_image, image_version, image_focus
      from spots order by sort, id`]);
	const byRegion = /* @__PURE__ */ new Map();
	for (const s of spots) {
		const list = byRegion.get(s.region_id) ?? [];
		list.push({
			id: s.id,
			regionId: s.region_id,
			name: s.name,
			profile: s.profile,
			seed: Math.round(Number(s.seed) * 100) / 100,
			temp: s.temp,
			wind: Math.round(Number(s.wind) * 100) / 100,
			rain: s.rain,
			coef: s.coef,
			score: s.score,
			hasImage: s.has_image,
			imageVersion: s.image_version,
			imageFocus: s.image_focus
		});
		byRegion.set(s.region_id, list);
	}
	return regions.map((r) => ({
		id: r.id,
		name: r.name,
		hasImage: r.has_image,
		imageVersion: r.image_version,
		imageFocus: r.image_focus,
		spots: byRegion.get(r.id) ?? []
	}));
}
async function loadImage(kind, id) {
	const sql = await getSql();
	const row = (kind === "region" ? await sql`
          select image_data, image_type from regions where id = ${id}` : await sql`
          select image_data, image_type from spots where id = ${id}`)[0];
	if (!row?.image_data || !row.image_type) return null;
	return {
		data: row.image_data,
		type: row.image_type
	};
}
/** Reference forecast profiles; index matches `SPOTS` in public/peixe.html. */
var SPOT_PROFILES = [
	"Oeiras",
	"Guincho",
	"Cascais",
	"Carcavelos",
	"Costa da Caparica",
	"Sesimbra"
];
var IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
/** Max decoded image size accepted by the server (bytes). */
var MAX_IMAGE_BYTES = 2621440;
function imageUrl(kind, id, version) {
	return `/api/images/${kind}/${id}?v=${version}`;
}
//#endregion
export { imageUrl as a, getSql as i, MAX_IMAGE_BYTES as n, loadImage as o, SPOT_PROFILES as r, loadRegions as s, IMAGE_TYPES as t };
