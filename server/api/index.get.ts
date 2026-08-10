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

  // 辅助函数：为指定路径生成所有地区的链接列表
  function generateLinks(path: string, queryParams: string = '') {
    return locales.map(locale => {
      const fullPath = `${baseUrl}${path}?mkt=${locale.code}${queryParams}`;
      return `<li><a href="${fullPath}" target="_blank">${fullPath}</a> <span style="color:#888;font-size:0.85em;">(${locale.name})</span></li>`;
    }).join('');
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>必应壁纸 API 文档</title>
  <!-- Twikoo CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.min.css">
  <style>
    /* ===== 基础重置 ===== */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #0d0d1a;
      color: #e0e0e0;
      min-height: 100vh;
      padding: 28px 20px 60px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ===== 滚动条 ===== */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 3px; }
    ::-webkit-scrollbar-thumb { background: #4fc3f7; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #81d4fa; }

    /* ===== 布局 ===== */
    .container { max-width: 1000px; margin: 0 auto; }

    /* ===== 头部 ===== */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #4fc3f7, #00e5ff);
      border-radius: 2px;
    }
    .header-left h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-left h1 .gradient {
      background: linear-gradient(135deg, #4fc3f7, #00e5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .header-left p {
      color: rgba(255,255,255,0.4);
      font-size: 14px;
      margin-top: 4px;
    }
    .header-left p i { color: #4fc3f7; }
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .header-right .badge {
      background: rgba(79,195,247,0.12);
      color: #4fc3f7;
      padding: 5px 16px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(79,195,247,0.12);
    }
    .header-right .btn-back {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.6);
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 13px;
      cursor: pointer;
      transition: 0.3s;
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .header-right .btn-back:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border-color: rgba(79,195,247,0.3);
      transform: translateY(-1px);
    }
    .header-right .btn-feedback {
      background: rgba(79,195,247,0.12);
      border: 1px solid rgba(79,195,247,0.2);
      color: #4fc3f7;
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 13px;
      cursor: pointer;
      transition: 0.3s;
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .header-right .btn-feedback:hover {
      background: rgba(79,195,247,0.2);
      transform: translateY(-1px);
      box-shadow: 0 0 20px rgba(79,195,247,0.08);
    }

    /* ===== 统计卡片 ===== */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 14px;
      margin-bottom: 36px;
    }
    .stat-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 20px 18px;
      text-align: center;
      transition: 0.3s;
    }
    .stat-card:hover {
      border-color: rgba(79,195,247,0.3);
      transform: translateY(-2px);
    }
    .stat-card .num {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }
    .stat-card .num i { color: #4fc3f7; margin-right: 6px; }
    .stat-card .label {
      font-size: 11px;
      color: rgba(255,255,255,0.35);
      margin-top: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ===== 卡片 ===== */
    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 20px 24px;
      margin: 20px 0;
      transition: 0.3s;
    }
    .card:hover {
      border-color: rgba(79,195,247,0.2);
    }
    .card .tag {
      display: inline-block;
      background: #4caf50;
      color: #0d0d1a;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 12px;
      border-radius: 4px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .card .tag.get { background: #4caf50; }
    .card h3 {
      color: #fff;
      font-size: 18px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .card .desc {
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      margin-bottom: 12px;
    }
    .card .params {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 12px;
    }
    .card .params code {
      background: rgba(255,255,255,0.06);
      padding: 2px 8px;
      border-radius: 4px;
      color: #ffb74d;
      font-size: 12px;
    }
    .card ul {
      list-style: none;
      padding: 0;
    }
    .card ul li {
      padding: 4px 0;
      font-size: 13px;
      word-break: break-all;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .card ul li:last-child { border-bottom: none; }
    .card ul li a {
      color: #4fc3f7;
      text-decoration: none;
      transition: 0.2s;
    }
    .card ul li a:hover {
      color: #81d4fa;
      text-decoration: underline;
    }
    .card ul li .locale-name {
      color: rgba(255,255,255,0.35);
      font-size: 0.85em;
    }

    /* ===== 页脚 ===== */
    .footer {
      margin-top: 44px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 13px;
      color: rgba(255,255,255,0.3);
    }
    .footer a {
      color: rgba(255,255,255,0.3);
      transition: 0.2s;
      text-decoration: none;
    }
    .footer a:hover { color: #4fc3f7; }

    /* ============================================================
       评论弹窗 - 与首页风格统一
       ============================================================ */
    .comment-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.25s ease;
    }
    .comment-overlay.active { display: flex; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .comment-modal {
      background: #1a1a2e;
      border-radius: 16px;
      width: 92%;
      max-width: 720px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255,255,255,0.06);
      animation: slideUp 0.3s ease;
      overflow: hidden;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    .comment-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #4fc3f7;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }
    .comment-header h2 i { font-style: normal; }
    .comment-header .close-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.3);
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: 0.2s;
      line-height: 1;
    }
    .comment-header .close-btn:hover {
      background: rgba(255,255,255,0.06);
      color: #fff;
    }

    .comment-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px 16px;
      background: #0d0d1a;
    }
    .comment-body::-webkit-scrollbar { width: 4px; }
    .comment-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    /* ★★★ Twikoo 暗色主题适配 ★★★ */
    .tk-comments,
    .tk-comment,
    .tk-input,
    .tk-submit,
    .tk-meta,
    .tk-loading,
    .tk-footer,
    .tk-powered {
      color: #e0e0e0 !important;
    }
    .tk-input {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
    }
    .tk-input textarea,
    .tk-input input {
      color: #e0e0e0 !important;
      background: transparent !important;
    }
    .tk-input textarea::placeholder,
    .tk-input input::placeholder {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-comment .tk-nick,
    .tk-comment .tk-nick a {
      color: #4fc3f7 !important;
    }
    .tk-comment .tk-content,
    .tk-comment .tk-content p {
      color: #e0e0e0 !important;
    }
    .tk-comment .tk-time {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-comment .tk-actions .tk-action {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-comment .tk-actions .tk-action:hover {
      color: #4fc3f7 !important;
    }
    .tk-submit .tk-btn {
      background: #4fc3f7 !important;
      color: #0d0d1a !important;
    }
    .tk-meta .tk-count {
      color: rgba(255,255,255,0.5) !important;
    }
    .tk-meta .tk-order {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-meta .tk-order.active {
      color: #4fc3f7 !important;
    }
    .tk-loading .tk-load-more {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-loading .tk-load-more:hover {
      color: #4fc3f7 !important;
    }
    .tk-empty {
      color: rgba(255,255,255,0.3) !important;
    }
    .tk-footer,
    .tk-powered,
    .tk-footer a,
    .tk-powered a {
      color: rgba(255,255,255,0.2) !important;
    }
    .tk-footer a:hover,
    .tk-powered a:hover {
      color: rgba(255,255,255,0.5) !important;
    }

    /* ============================================================
       响应式
       ============================================================ */
    @media (max-width: 768px) {
      body { padding: 16px 14px 40px; }
      .header-left h1 { font-size: 24px; }
      .stats { grid-template-columns: repeat(3, 1fr); }
      .card { padding: 16px 18px; }
      .card h3 { font-size: 16px; }
      .comment-modal { width: 95%; max-height: 90vh; border-radius: 12px; }
      .comment-header { padding: 14px 16px 10px; }
      .comment-header h2 { font-size: 16px; }
      .comment-body { padding: 14px 16px 12px; }
      .header-right .btn-feedback span { display: none; }
    }
    @media (max-width: 480px) {
      .stats { grid-template-columns: 1fr; }
      .header-left h1 { font-size: 20px; }
      .header { flex-direction: column; align-items: stretch; }
      .header-right { justify-content: flex-start; }
      .header::after { width: 40px; }
    }
  </style>
</head>
<body>

<div class="container">

  <!-- ===== 头部 ===== -->
  <div class="header">
    <div class="header-left">
      <h1>
        <span>📷</span>
        <span class="gradient">必应壁纸</span>
        <span style="font-weight:300; color:rgba(255,255,255,0.3); font-size:0.7em;">API</span>
      </h1>
      <p><i>✦</i> 每日自动更新 · 9 种语言 · 完全免费</p>
    </div>
    <div class="header-right">
      <span class="badge"><i>◆</i> RESTful</span>
      <a href="/" class="btn-back"><span>←</span> 返回首页</a>
      <button class="btn-feedback" id="feedbackBtn">
        <span>💬</span> <span>反馈</span>
      </button>
    </div>
  </div>

  <!-- ===== 统计 ===== -->
  <div class="stats">
    <div class="stat-card">
      <div class="num"><i>◆</i> 9</div>
      <div class="label">支持地区</div>
    </div>
    <div class="stat-card">
      <div class="num"><i>◆</i> ${locales.length}</div>
      <div class="label">API 接口</div>
    </div>
    <div class="stat-card">
      <div class="num"><i>◆</i> ${new Date().toISOString().slice(0,10)}</div>
      <div class="label">今日更新</div>
    </div>
  </div>

  <!-- ===== 接口列表 ===== -->
  <h2 style="color:#fff;font-size:20px;margin-bottom:16px;">📡 接口列表</h2>

  <!-- 1. /api/image.random -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/image.random</h3>
    <div class="desc">获取一张随机壁纸图片（直接返回图片流）</div>
    <div class="params">参数：<code>mkt</code> (可选) 地区代码，默认 zh-CN</div>
    <ul>${generateLinks('/api/image.random')}</ul>
  </div>

  <!-- 2. /api/images?random=true -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/images?mkt=zh-CN&random=true</h3>
    <div class="desc">返回随机壁纸的 JSON 数据</div>
    <div class="params">参数：<code>mkt</code> (可选) 地区代码 · <code>random=true</code> 必需</div>
    <ul>${generateLinks('/api/images', '&random=true')}</ul>
  </div>

  <!-- 3. /api/random -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/random?mkt=zh-CN</h3>
    <div class="desc">返回随机壁纸的 JSON 数据（短地址）</div>
    <div class="params">参数：<code>mkt</code> (可选) 地区代码，默认 zh-CN</div>
    <ul>${generateLinks('/api/random')}</ul>
  </div>

  <!-- 4. /api/random?redirect=true -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/random?mkt=zh-CN&redirect=true</h3>
    <div class="desc">重定向到一张随机壁纸图片</div>
    <div class="params">参数：<code>mkt</code> (可选) 地区代码 · <code>redirect=true</code> 必需</div>
    <ul>${generateLinks('/api/random', '&redirect=true')}</ul>
  </div>

  <!-- 5. /api/daily?redirect=true -->
  <div class="card">
    <h3><span class="tag get">GET</span> /api/daily?mkt=zh-CN&redirect=true</h3>
    <div class="desc">重定向到今日壁纸图片</div>
    <div class="params">参数：<code>mkt</code> (可选) 地区代码 · <code>redirect=true</code> 必需</div>
    <ul>${generateLinks('/api/daily', '&redirect=true')}</ul>
  </div>

  <!-- ===== 页脚 ===== -->
  <div class="footer">
    <span>© ${new Date().getFullYear()} · 图片来自 Bing</span>
    <span>
      <a href="/">首页</a> · 
      <a href="https://github.com/chnbsdan/bing.wallpaper" target="_blank">GitHub</a>
    </span>
  </div>

</div>

<!-- ============================================================
     评论弹窗
     ============================================================ -->
<div class="comment-overlay" id="commentOverlay">
  <div class="comment-modal">
    <div class="comment-header">
      <h2><i>💬</i> 反馈与讨论</h2>
      <button class="close-btn" id="closeCommentBtn">✕</button>
    </div>
    <div class="comment-body" id="commentBody">
      <div id="tcomment"></div>
    </div>
  </div>
</div>

<!-- ===== Twikoo ===== -->
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.min.js"></script>

<script>
  // ============================================================
  // 1. 主题切换（跟随首页）
  // ============================================================
  // 检测系统主题，默认暗色
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // 如果需要亮色支持，可以在这里添加切换逻辑
  // 目前保持暗色统一

  // ============================================================
  // 2. 评论系统
  // ============================================================
  let twikooInstance = null;

  function initTwikoo() {
    if (typeof twikoo === 'undefined') {
      setTimeout(initTwikoo, 500);
      return;
    }
    if (document.getElementById('tcomment').hasChildNodes()) return;
    twikoo.init({
      envId: 'https://twikoo.hangdn.net',
      el: '#tcomment',
      lang: 'zh-CN',
    }).then(() => {
      twikooInstance = true;
    }).catch(() => {
      twikooInstance = false;
    });
  }

  // ============================================================
  // 3. 弹窗控制
  // ============================================================
  const feedbackBtn = document.getElementById('feedbackBtn');
  const commentOverlay = document.getElementById('commentOverlay');
  const closeCommentBtn = document.getElementById('closeCommentBtn');

  function openComment() {
    commentOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // 延迟初始化，确保 DOM 渲染完成
    setTimeout(initTwikoo, 300);
  }

  function closeComment() {
    commentOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  feedbackBtn.addEventListener('click', openComment);
  closeCommentBtn.addEventListener('click', closeComment);

  commentOverlay.addEventListener('click', function(e) {
    if (e.target === commentOverlay) closeComment();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && commentOverlay.classList.contains('active')) {
      closeComment();
    }
  });

  // 如果 URL 带 ?action=comment 参数，自动打开
  if (window.location.search.indexOf('action=comment') !== -1) {
    setTimeout(openComment, 500);
  }

  // 接收来自 iframe 或父窗口的打开评论消息
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'openComment') {
      openComment();
    }
  });

  console.log('✅ API 文档已加载');
  console.log('💡 点击 "反馈" 按钮打开评论');
</script>

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
