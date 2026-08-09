// functions/api/list.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const page = parseInt(url.searchParams.get('page')) || 1;
  const pageSize = parseInt(url.searchParams.get('size')) || 30;
  const mkt = url.searchParams.get('mkt') || 'zh-CN';

  if (page < 1) {
    return new Response(JSON.stringify({ error: 'page 必须 >= 1' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (pageSize < 1 || pageSize > 100) {
    return new Response(JSON.stringify({ error: 'size 必须在 1-100 之间' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // ★★★ 从 Vercel API 获取数据 ★★★
    const apiUrl = `https://bing.api.hangdn.com/api/images?mkt=${mkt}&idx=0&count=9999`;
    const resp = await fetch(apiUrl);
    
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: '无法加载壁纸数据' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: '暂无壁纸数据' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 按日期降序排序
    data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const items = data.slice(start, end);

    return new Response(JSON.stringify({
      code: 0,
      data: {
        items: items,
        page: currentPage,
        pageSize: pageSize,
        total: total,
        totalPages: totalPages,
        hasMore: currentPage < totalPages,
        lang: mkt
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
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
