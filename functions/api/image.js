// functions/api/image.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const date = url.searchParams.get('date');
  const redirect = url.searchParams.get('redirect') === 'true';
  const mkt = url.searchParams.get('mkt') || 'zh-CN';

  if (!date) {
    return new Response(JSON.stringify({
      error: '缺少 date 参数',
      example: '/api/image?date=20260809&mkt=zh-CN'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function normalizeDate(dateStr) {
    const digits = dateStr.replace(/\D/g, '');
    if (digits.length === 8) {
      return digits.slice(0, 4) + '-' + digits.slice(4, 6) + '-' + digits.slice(6, 8);
    }
    return dateStr;
  }

  try {
    // ★★★ 从 API 获取指定日期的壁纸 ★★★
    const normalizedDate = normalizeDate(date);
    const apiUrl = `https://bing.api.hangdn.com/api/images?mkt=${mkt}&idx=0&count=9999`;
    const resp = await fetch(apiUrl);
    
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: '无法加载壁纸数据' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: '暂无壁纸数据' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = data.find(w => w.date === normalizedDate);

    if (!item) {
      const recentDates = data.slice(0, 10).map(w => w.date);
      return new Response(JSON.stringify({
        error: `未找到 ${date} 的壁纸`,
        available_dates: recentDates,
        hint: '可用日期格式: YYYY-MM-DD (如 2026-08-09)'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const imageUrl = item.url || `https://www.bing.com${item.urlbase}_1920x1080.jpg`;

    if (redirect) {
      return Response.redirect(imageUrl, 302);
    }

    const imgResp = await fetch(imageUrl, {
      headers: { 'User-Agent': 'CloudflarePages-Function' }
    });

    if (!imgResp.ok) {
      return new Response(JSON.stringify({ error: '图片获取失败' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
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
    return new Response(JSON.stringify({
      error: '服务器错误',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
