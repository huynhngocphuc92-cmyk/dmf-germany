#!/usr/bin/env python3
"""
Generate a beautiful, standalone interactive Preview Portal for all 23 strategic articles.
Allows user to view, read, search, and verify all articles with images and responsive styling.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
COMPILED_DIR = BASE_DIR / "content" / "compiled"
DRAFTS_DIR = BASE_DIR / "content" / "drafts"

# Cluster mapping by draft prefix
CLUSTER_MAP = {
    "01": {"id": 1, "name": "Cụm 1: Pháp lý & Thủ tục", "badge": "bg-blue-100 text-blue-800", "color": "#1e40af"},
    "08": {"id": 1, "name": "Cụm 1: Pháp lý & Thủ tục", "badge": "bg-blue-100 text-blue-800", "color": "#1e40af"},
    "18": {"id": 1, "name": "Cụm 1: Pháp lý & Thủ tục", "badge": "bg-blue-100 text-blue-800", "color": "#1e40af"},
    "19": {"id": 1, "name": "Cụm 1: Pháp lý & Thủ tục", "badge": "bg-blue-100 text-blue-800", "color": "#1e40af"},
    "20": {"id": 1, "name": "Cụm 1: Pháp lý & Thủ tục", "badge": "bg-blue-100 text-blue-800", "color": "#1e40af"},

    "02": {"id": 2, "name": "Cụm 2: So sánh & Chi phí", "badge": "bg-emerald-100 text-emerald-800", "color": "#065f46"},
    "12": {"id": 2, "name": "Cụm 2: So sánh & Chi phí", "badge": "bg-emerald-100 text-emerald-800", "color": "#065f46"},
    "22": {"id": 2, "name": "Cụm 2: So sánh & Chi phí", "badge": "bg-emerald-100 text-emerald-800", "color": "#065f46"},
    "23": {"id": 2, "name": "Cụm 2: So sánh & Chi phí", "badge": "bg-emerald-100 text-emerald-800", "color": "#065f46"},

    "03": {"id": 3, "name": "Cụm 3: Vận hành & Hội nhập", "badge": "bg-amber-100 text-amber-800", "color": "#92400e"},
    "04": {"id": 3, "name": "Cụm 3: Vận hành & Hội nhập", "badge": "bg-amber-100 text-amber-800", "color": "#92400e"},
    "05": {"id": 3, "name": "Cụm 3: Vận hành & Hội nhập", "badge": "bg-amber-100 text-amber-800", "color": "#92400e"},
    "13": {"id": 3, "name": "Cụm 3: Vận hành & Hội nhập", "badge": "bg-amber-100 text-amber-800", "color": "#92400e"},

    "07": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "10": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "11": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "14": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "15": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "16": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},
    "17": {"id": 4, "name": "Cụm 4: Ngành trọng điểm", "badge": "bg-purple-100 text-purple-800", "color": "#6b21a8"},

    "06": {"id": 5, "name": "Cụm 5: Đào tạo nghề & Rủi ro", "badge": "bg-rose-100 text-rose-800", "color": "#9f1239"},
    "09": {"id": 5, "name": "Cụm 5: Đào tạo nghề & Rủi ro", "badge": "bg-rose-100 text-rose-800", "color": "#9f1239"},
    "21": {"id": 5, "name": "Cụm 5: Đào tạo nghề & Rủi ro", "badge": "bg-rose-100 text-rose-800", "color": "#9f1239"},

    "24": {"id": 6, "name": "Cụm 6: Kỹ thuật xanh & PV", "badge": "bg-teal-100 text-teal-800", "color": "#0d9488"},
    "25": {"id": 6, "name": "Cụm 6: Kỹ thuật xanh & PV", "badge": "bg-teal-100 text-teal-800", "color": "#0d9488"},

    "26": {"id": 7, "name": "Cụm 7: Y tế chuyên sâu & Đạo đức", "badge": "bg-cyan-100 text-cyan-800", "color": "#0891b2"},
    "27": {"id": 7, "name": "Cụm 7: Y tế chuyên sâu & Đạo đức", "badge": "bg-cyan-100 text-cyan-800", "color": "#0891b2"},

    "28": {"id": 8, "name": "Cụm 8: Lãnh đạo & Định cư", "badge": "bg-indigo-100 text-indigo-800", "color": "#4338ca"},
    "29": {"id": 8, "name": "Cụm 8: Lãnh đạo & Định cư", "badge": "bg-indigo-100 text-indigo-800", "color": "#4338ca"},
    "30": {"id": 8, "name": "Cụm 8: Lãnh đạo & Định cư", "badge": "bg-indigo-100 text-indigo-800", "color": "#4338ca"},

    "31": {"id": 9, "name": "Cụm 9: Trợ cấp DeuFöV & EQ", "badge": "bg-lime-100 text-lime-800", "color": "#4d7c0f"},
    "32": {"id": 9, "name": "Cụm 9: Trợ cấp DeuFöV & EQ", "badge": "bg-lime-100 text-lime-800", "color": "#4d7c0f"},

    "33": {"id": 10, "name": "Cụm 10: Xây dựng & Ausbau", "badge": "bg-orange-100 text-orange-800", "color": "#c2410c"},
    "34": {"id": 10, "name": "Cụm 10: Xây dựng & Ausbau", "badge": "bg-orange-100 text-orange-800", "color": "#c2410c"},

    "35": {"id": 11, "name": "Cụm 11: Logistics & Vận tải", "badge": "bg-slate-100 text-slate-800", "color": "#334155"},
}

def generate_preview():
    posts_data = json.loads((COMPILED_DIR / "all-posts.json").read_text(encoding="utf-8"))
    draft_files = sorted([f for f in DRAFTS_DIR.glob("[0-9]*.md")])

    enriched_posts = []
    for idx, p in enumerate(posts_data):
        df = draft_files[idx] if idx < len(draft_files) else None
        num_prefix = df.name[:2] if df else f"{idx+1:02d}"
        cluster_info = CLUSTER_MAP.get(num_prefix, {"id": 1, "name": "Chung", "badge": "bg-gray-100 text-gray-800", "color": "#374151"})
        
        # Calculate word count of content
        words = len(p["content"].split())

        enriched_posts.append({
            **p,
            "number": num_prefix,
            "filename": df.name if df else "",
            "cluster_id": cluster_info["id"],
            "cluster_name": cluster_info["name"],
            "cluster_color": cluster_info["color"],
            "words": words,
            "reading_time": max(3, round(words / 180)),
        })

    html_template = """<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DMF Talents — B2B Editorial & Content Preview Portal (23 Articles)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1e3a5f;
      --primary-dark: #0f172a;
      --accent: #0891b2;
      --accent-light: #e0f2fe;
      --bg-main: #f8fafc;
      --bg-card: #ffffff;
      --border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --sidebar-width: 360px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-main);
      color: var(--text-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    /* SIDEBAR */
    #sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: #ffffff;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
    }
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 100%);
      color: #ffffff;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-badge {
      font-size: 11px;
      background: #0891b2;
      color: white;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 600;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
    
    /* FILTERS & SEARCH */
    .filter-section {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      background: #f8fafc;
    }
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
    }
    .cluster-tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      padding-top: 8px;
      scrollbar-width: none;
    }
    .cluster-tabs::-webkit-scrollbar { display: none; }
    .tab-btn {
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: #ffffff;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .tab-btn:hover { background: #f1f5f9; color: var(--text-main); }
    .tab-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }
    
    /* ARTICLE LIST */
    .article-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    .article-item {
      padding: 12px 14px;
      margin-bottom: 6px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
      background: #ffffff;
    }
    .article-item:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .article-item.active {
      background: #eef5f9;
      border-color: #0891b2;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.08);
    }
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .item-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: var(--accent);
      background: #e0f2fe;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .item-cluster {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .item-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 6px;
    }
    
    /* MAIN VIEWPORT */
    #main-content {
      flex: 1;
      height: 100vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    
    /* TOP ACTION BAR */
    .topbar {
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #0369a1;
      background: #e0f2fe;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0284c7;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #ffffff;
      color: var(--text-main);
      transition: all 0.15s;
    }
    .action-btn:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    
    /* ARTICLE CONTAINER */
    .article-wrap {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 32px 80px 32px;
      width: 100%;
    }
    
    /* META CARD */
    .seo-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .seo-title {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .seo-row {
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .seo-label {
      font-weight: 600;
      color: var(--text-main);
    }
    
    /* ARTICLE CONTENT STYLING (matching article.module.css) */
    .content-area {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid var(--border);
      padding: 44px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
    }
    .content-area h1 {
      font-size: 32px;
      font-weight: 800;
      color: #1e3a5f;
      line-height: 1.25;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    .content-area h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1e3a5f;
      margin-top: 40px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
      letter-spacing: -0.01em;
    }
    .content-area h3 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .content-area p {
      font-size: 16px;
      line-height: 1.75;
      color: #334155;
      margin-bottom: 20px;
    }
    .content-area ul, .content-area ol {
      margin-bottom: 24px;
      padding-left: 24px;
      color: #334155;
    }
    .content-area li {
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 8px;
    }
    .content-area strong {
      color: #0f172a;
      font-weight: 600;
    }
    .content-area a {
      color: #0891b2;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .content-area a:hover {
      color: #0e7490;
    }
    
    /* IMAGES & CAPTIONS */
    .content-area img {
      width: 100%;
      height: auto;
      max-height: 480px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-top: 28px;
      margin-bottom: 8px;
      background: #f8fafc;
    }
    .content-area img + p:has(> em:only-child),
    .content-area p:has(> em:only-child) {
      font-size: 13px;
      color: #64748b;
      font-style: italic;
      text-align: center;
      margin-top: 4px;
      margin-bottom: 28px;
    }
    
    /* TABLES */
    .table-responsive {
      overflow-x: auto;
      margin: 28px 0;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .content-area table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }
    .content-area th {
      background: #f1f5f9;
      color: #1e3a5f;
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid #cbd5e1;
    }
    .content-area td {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .content-area tr:last-child td {
      border-bottom: none;
    }
    .content-area tr:nth-child(even) td {
      background: #fafafa;
    }
    
    /* CALLOUT CTA */
    .cta-box {
      margin-top: 48px;
      background: linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 100%);
      color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
    }
    .cta-box h3 {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .cta-box p {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .cta-btn {
      display: inline-block;
      background: #0891b2;
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
      padding: 10px 24px;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.15s;
    }
    .cta-btn:hover { background: #06b6d4; }
  </style>
</head>
<body>

  <!-- SIDEBAR -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <div class="brand-title">
        DMF TALENTS
        <span class="brand-badge">35 Bài Chiến Lược</span>
      </div>
      <div class="brand-subtitle">Cổng duyệt & kiểm tra nội dung B2B SEO & GEO</div>
    </div>
    
    <div class="filter-section">
      <input type="text" id="search-box" class="search-input" placeholder="Tìm theo tiêu đề, slug, từ khoá...">
      <div class="cluster-tabs">
        <button class="tab-btn active" onclick="filterCluster(0)">Tất cả (35)</button>
        <button class="tab-btn" onclick="filterCluster(1)">Cụm 1: Pháp lý (5)</button>
        <button class="tab-btn" onclick="filterCluster(2)">Cụm 2: Chi phí (4)</button>
        <button class="tab-btn" onclick="filterCluster(3)">Cụm 3: Hội nhập (4)</button>
        <button class="tab-btn" onclick="filterCluster(4)">Cụm 4: Ngành (7)</button>
        <button class="tab-btn" onclick="filterCluster(5)">Cụm 5: Nghề (3)</button>
        <button class="tab-btn" onclick="filterCluster(6)">Cụm 6: Xanh &amp; PV (2)</button>
        <button class="tab-btn" onclick="filterCluster(7)">Cụm 7: Y tế &amp; Đạo đức (2)</button>
        <button class="tab-btn" onclick="filterCluster(8)">Cụm 8: Lãnh đạo &amp; Định cư (3)</button>
        <button class="tab-btn" onclick="filterCluster(9)">Cụm 9: Trợ cấp (2)</button>
        <button class="tab-btn" onclick="filterCluster(10)">Cụm 10: Xây dựng (2)</button>
        <button class="tab-btn" onclick="filterCluster(11)">Cụm 11: Logistics (1)</button>
      </div>
    </div>
    
    <div class="article-list" id="article-list">
      <!-- Items dynamically populated -->
    </div>
  </aside>

  <!-- MAIN CONTENT VIEWPORT -->
  <main id="main-content">
    <div class="topbar">
      <div class="topbar-left">
        <span class="status-badge">
          <span class="status-dot"></span>
          Trạng thái: Bản nháp hoàn chỉnh (Draft)
        </span>
        <span id="current-meta-words" style="font-size: 13px; color: var(--text-muted);"></span>
      </div>
      <div class="topbar-right">
        <button class="action-btn" onclick="copySlug()">📋 Sao chép Slug</button>
        <button class="action-btn" onclick="window.print()">🖨️ In / PDF</button>
      </div>
    </div>

    <div class="article-wrap">
      <!-- SEO METADATA CARD -->
      <div class="seo-card">
        <div class="seo-title">SEO & GEO Metadata (Dữ liệu phục vụ Bot tìm kiếm & AI)</div>
        <div class="seo-row"><span class="seo-label">Meta Title:</span> <span id="view-meta-title"></span></div>
        <div class="seo-row"><span class="seo-label">Meta Description:</span> <span id="view-meta-desc"></span></div>
        <div class="seo-row"><span class="seo-label">Slug URL:</span> <code id="view-slug" style="font-family: 'JetBrains Mono', monospace; color: var(--accent); background: #f1f5f9; padding: 2px 6px; border-radius: 4px;"></code></div>
        <div class="seo-row"><span class="seo-label">File Markdown:</span> <code id="view-filename" style="font-family: 'JetBrains Mono', monospace; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;"></code></div>
      </div>

      <!-- MAIN ARTICLE BODY -->
      <article class="content-area" id="view-body">
        <!-- Rendered HTML here -->
      </article>

      <!-- CTA BOX -->
      <div class="cta-box">
        <h3>Sẵn sàng kết nối với nhân tài từ Việt Nam?</h3>
        <p>DMF Talents đồng hành cùng doanh nghiệp từ khâu lập hồ sơ, thẩm định BQFG, thủ tục § 81a đến onboarding trọn gói.</p>
        <a href="../../app/fuer-arbeitgeber/personalbedarf" class="cta-btn">Gửi yêu cầu nhân sự</a>
      </div>
    </div>
  </main>

  <script>
    const POSTS = __POSTS_DATA__;
    let currentPostIdx = 0;
    let currentClusterFilter = 0;

    function renderList() {
      const query = document.getElementById('search-box').value.toLowerCase().trim();
      const listContainer = document.getElementById('article-list');
      listContainer.innerHTML = '';

      POSTS.forEach((p, idx) => {
        const matchesCluster = currentClusterFilter === 0 || p.cluster_id === currentClusterFilter;
        const matchesSearch = !query || 
          p.title.toLowerCase().includes(query) || 
          p.slug.toLowerCase().includes(query) || 
          p.meta_description.toLowerCase().includes(query);

        if (matchesCluster && matchesSearch) {
          const item = document.createElement('div');
          item.className = 'article-item' + (idx === currentPostIdx ? ' active' : '');
          item.onclick = () => selectPost(idx);
          item.innerHTML = `
            <div class="item-header">
              <span class="item-num">#${p.number}</span>
              <span class="item-cluster" style="color: ${p.cluster_color}; background: #f1f5f9;">Cụm ${p.cluster_id}</span>
            </div>
            <div class="item-title">${p.title}</div>
            <div class="item-meta">
              <span>📖 ${p.reading_time} phút</span>
              <span>•</span>
              <span>📝 ${p.words} từ</span>
            </div>
          `;
          listContainer.appendChild(item);
        }
      });
    }

    function selectPost(idx) {
      currentPostIdx = idx;
      renderList();
      const post = POSTS[idx];

      document.getElementById('current-meta-words').textContent = `Cụm ${post.cluster_id} • ${post.words} từ • ${post.reading_time} phút đọc`;
      document.getElementById('view-meta-title').textContent = post.meta_title;
      document.getElementById('view-meta-desc').textContent = post.meta_description;
      document.getElementById('view-slug').textContent = '/blog/' + post.slug;
      document.getElementById('view-filename').textContent = 'content/drafts/' + post.filename;

      // Adjust image paths for local file:// protocol if necessary
      let renderedContent = post.content;
      if (window.location.protocol === 'file:') {
        renderedContent = renderedContent.replace(/src="\/images\//g, 'src="../../public/images/');
      }

      document.getElementById('view-body').innerHTML = `
        <h1>${post.title}</h1>
        ${renderedContent}
      `;

      // Scroll to top of viewport
      document.getElementById('main-content').scrollTop = 0;
    }

    function filterCluster(clusterId) {
      currentClusterFilter = clusterId;
      document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === clusterId);
      });
      renderList();
    }

    document.getElementById('search-box').addEventListener('input', renderList);

    function copySlug() {
      const slug = POSTS[currentPostIdx].slug;
      navigator.clipboard.writeText(slug).then(() => {
        alert('Đã sao chép slug: ' + slug);
      });
    }

    // Initialize
    selectPost(0);
  </script>
</body>
</html>
"""

    html_output = html_template.replace("__POSTS_DATA__", json.dumps(enriched_posts, ensure_ascii=False))
    
    preview_file = COMPILED_DIR / "preview.html"
    preview_file.write_text(html_output, encoding="utf-8")
    print(f"Generated standalone preview portal: {preview_file} ({len(html_output)} bytes)")

if __name__ == "__main__":
    generate_preview()
