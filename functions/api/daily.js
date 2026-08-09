// functions/api/daily.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const redirect = url.searchParams.get("redirect") === "true";
  const mkt = url.searchParams.get('mkt') || 'zh-CN';
  const size = parseInt(url.searchParams.get('size')) || 0;

  const SIZE_MAP = {
    400: '400x240',
    640: '640x360',
    768: '768x432',
    1024: '1024x576',
    1366: '1366x768',
    1920: '1920x1080',
    2560: '2560x1440',
  };

  try {
    // ★★★ 获取最新壁纸 ★★★
    const apiUrl = `https://bing.api.hangdn.com/api/images?mkt=${mkt}&idx=0&count=1`;
    const resp = await fetch(apiUrl);
    
    if (!resp.ok) {
      return new Response('Failed to fetch image data', { status: 502 });
    }

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return new Response('No image found', { status: 404 });
    }

    const item = data[0];
    let imageUrl = item.url || `https://www.bing.com${item.urlbase}_1920x1080.jpg`;

    // 如果指定了尺寸，尝试替换
    if (size > 0 && SIZE_MAP[size]) {
      imageUrl = imageUrl.replace('1920x1080', SIZE_MAP[size]);
    }

    if (redirect) {
      return Response.redirect(imageUrl, 302);
    }

    const imgResp = await fetch(imageUrl, {
      headers: { 'User-Agent': 'CloudflarePages-Function' }
    });

    if (!imgResp.ok) {
      return new Response('Image not found', { status: 404 });
    }

    return new Response(imgResp.body, {
      headers: {
        'Content-Type': imgResp.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=10800',
        'X-Image-Date': item.date || '',
        'X-Image-Copyright': encodeURIComponent(item.copyright || ''),
        'X-Image-Lang': mkt
      }
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
