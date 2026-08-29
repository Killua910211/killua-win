import { env } from 'cloudflare:workers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const setting = await env.DB.prepare(
    'SELECT value FROM site_settings WHERE key = ?',
  )
    .bind('database_version')
    .first<{ value: string }>();

  return Response.json({
    status: 'ok',
    database: 'killua-win-d1',
    version: setting?.value ?? null,
  });
}
