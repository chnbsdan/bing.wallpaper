// server/api/index.get.ts
export default defineEventHandler((event) => {
  // ★★★ 动态获取当前部署的域名 ★★★
  const host = event.headers.get('host') || 'bing.api.hangdn.com';
  const protocol = event.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  // 定义所有需要展示的地区
  const locales = [
    { code: 'zh-CN', name: '中国 (简体中文)' },
    { code: 'en-US', name: '美国 (英语)' },
    { code: 'en-GB', name: '英国 (英语)' },
    { code: 'en-CA', name: '加拿大 (英语)' },
    { code: 'en-IN', name: '印度 (英语)' },
    { code: 'ja-JP', name: '日本 (日语)' },
    { code: 'de-DE', name: '德国 (德语)' },
    { code: 'fr-FR', name: '法国 (法语)' },
    { code: 'it-IT', name: '意大利 (意大利语)' },
  ];

  // 生成所有地区的随机图片链接 (用于 /api/image.random)
  const imageRandomLinks = locales.map(locale => 
    `<li><a href="${baseUrl}/api/image.random?mkt=${locale.code}" target="_blank">${baseUrl}/api/image.random?mkt=${locale.code}</a> (${locale.name})</li>`
  ).join('');

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>必应壁纸 API 文档</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 960px; margin: 40px auto; padding: 0 20px; background: #0d0d1a; color: #e0e0e0; line-height: 1.6; }
    h1, h2, h3 { color: #4fc3f7; }
    a { color: #4fc3f7; word-break: break-all; }
    .card { background: #1a1a2e; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #2a2a4e; }
    .card code { background: #0d0d1a; padding: 2px 8px; border-radius: 4px; color: #ffb74d; }
    .card pre { background: #0d0d1a; padding: 16px; border-radius: 8px; overflow-x: auto; color: #b0b0b0; }
    .tag { display: inline-block; background: #4fc3f7; color: #0d0d1a; font-size: 12px; font-weight: bold; padding: 2px 12px; border-radius: 20px; margin-right: 8px; }
    .tag.get { background: #4caf50; }
    .tag.post { background: #ff9800; }
    hr { border: none; border-top: 1px solid #2a2a4e; margin: 30px 0; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .locale-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }
  </style>
</head>
<body>
  <h1>📷 必应壁纸 API</h1>
  <p>基础地址: <code>${baseUrl}</code></p>
  <hr>

  <h2>接口列表</h2>

  <!-- 1. 获取随机壁纸图片 (直接返回图片流) -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/image.random</h3>
    <p><strong>功能：</strong>获取一张随机壁纸图片（直接返回图片流）</p>
    <p><strong>参数：</strong></p>
    <ul>
      <li><code>mkt</code> (可选): 地区代码，如 zh-CN, en-US, ja-JP，默认 zh-CN</li>
    </ul>
    <p><strong>示例（点击直接打开图片）：</strong></p>
    <div class="locale-grid">
      <ul>${imageRandomLinks}</ul>
    </div>
  </div>

  <!-- 2. 获取随机壁纸 JSON -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/images?mkt=zh-CN&random=true</h3>
    <p><strong>功能：</strong>返回随机壁纸的 JSON 数据</p>
    <p><strong>参数：</strong></p>
    <ul>
      <li><code>mkt</code> (可选): 地区代码，默认 zh-CN</li>
      <li><code>random</code> (必需): 设置为 <code>true</code></li>
    </ul>
    <p><strong>示例（点击查看 JSON）：</strong><br>
      <a href="${baseUrl}/api/images?mkt=zh-CN&random=true" target="_blank">${baseUrl}/api/images?mkt=zh-CN&random=true</a>
    </p>
  </div>

  <!-- 3. 获取随机壁纸 JSON (短地址) -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/random?mkt=zh-CN</h3>
    <p><strong>功能：</strong>返回随机壁纸的 JSON 数据（短地址）</p>
    <p><strong>参数：</strong></p>
    <ul>
      <li><code>mkt</code> (可选): 地区代码，默认 zh-CN</li>
    </ul>
    <p><strong>示例（点击查看 JSON）：</strong><br>
      <a href="${baseUrl}/api/random?mkt=zh-CN" target="_blank">${baseUrl}/api/random?mkt=zh-CN</a>
    </p>
  </div>

  <!-- 4. 重定向到随机壁纸图片 -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/random?mkt=zh-CN&redirect=true</h3>
    <p><strong>功能：</strong>重定向到一张随机壁纸图片</p>
    <p><strong>参数：</strong></p>
    <ul>
      <li><code>mkt</code> (可选): 地区代码，默认 zh-CN</li>
      <li><code>redirect</code> (必需): 设置为 <code>true</code></li>
    </ul>
    <p><strong>示例（点击直接跳转到图片）：</strong><br>
      <a href="${baseUrl}/api/random?mkt=zh-CN&redirect=true" target="_blank">${baseUrl}/api/random?mkt=zh-CN&redirect=true</a>
    </p>
  </div>

  <!-- 5. 今日壁纸 (重定向) -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/daily?mkt=zh-CN&redirect=true</h3>
    <p><strong>功能：</strong>重定向到今日壁纸图片</p>
    <p><strong>参数：</strong></p>
    <ul>
      <li><code>mkt</code> (可选): 地区代码，默认 zh-CN</li>
      <li><code>redirect</code> (必需): 设置为 <code>true</code></li>
    </ul>
    <p><strong>示例（点击直接跳转到今日图片）：</strong><br>
      <a href="${baseUrl}/api/daily?mkt=zh-CN&redirect=true" target="_blank">${baseUrl}/api/daily?mkt=zh-CN&redirect=true</a>
    </p>
  </div>

  <hr>
  <p style="color: #888;">💡 支持的地区代码: zh-CN, en-US, ja-JP, de-DE, fr-FR, it-IT, en-CA, en-GB, en-IN</p>
  <p style="color: #888;">📅 壁纸每日自动更新 · 图片来自 Bing</p>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
});
