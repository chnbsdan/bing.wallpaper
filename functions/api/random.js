// functions/api/random.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") === "true";
  const mkt = url.searchParams.get('mkt') || 'zh-CN';

  try {
    // ★★★ 从你的 Vercel API 获取随机壁纸数据 ★★★
    const apiUrl = `https://bing.api.hangdn.com/api/images?mkt=${mkt}&random=true`;
    const resp = await fetch(apiUrl);
    
    if (!resp.ok) {
      return new Response('Failed to fetch image data', { status: 502 });
    }

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return new Response('No image found', { status: 404 });
    }

    const item = data[0];
    const imageUrl = item.url || `https://www.bing.com${item.urlbase}_1920x1080.jpg`;

    // 获取图片
    const imgResp = await fetch(imageUrl, {
      headers: { 'User-Agent': 'CloudflarePages-Function' }
    });

    if (!imgResp.ok) {
      return new Response('Image not found', { status: 404 });
    }

    if (redirect) {
      return Response.redirect(imageUrl, 302);
    }

    return new Response(imgResp.body, {
      headers: {
        'Content-Type': imgResp.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}-${Math.random()}"`,
        'X-Image-Date': item.date || '',
        'X-Image-Copyright': encodeURIComponent(item.copyright || ''),
        'X-Image-Lang': mkt
      }
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
