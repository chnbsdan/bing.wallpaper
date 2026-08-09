// functions/api/updates.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const idx = parseInt(url.searchParams.get('idx')) || 0;
  const mkt = url.searchParams.get('mkt') || 'zh-CN';

  try {
    // ★★★ 转发到你的 Vercel API ★★★
    const apiUrl = `https://bing.api.hangdn.com/api/updates?idx=${idx}`;
    const resp = await fetch(apiUrl);
    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
