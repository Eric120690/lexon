// ============================================================
//  ARTICLE & ROOT WORD MODULE (Updated with Hardcoded API Key)
// ============================================================

// Tích hợp trực tiếp API Key bạn cung cấp
let _mavisApiKey = 'sk-021866a411104e60e55f4541ab1ba1aec5d6c02f3fae0b599c64e36fe081ddec'; 

// ── 1. ARTICLE DRAWER (Xử lý Ngữ cảnh Báo chí) ──

function parseArticles(w) {
  const sp = s => (s || '').split('|').map(x => x.trim()).filter(Boolean);
  const src = sp(w.art_source);
  if (!src.length) return [];

  const urls = sp(w.art_url);
  const ctxs = sp(w.art_ctx_vi);
  const qts = sp(w.art_quote);
  const qtvis = sp(w.art_quote_vi);

  return src.map((s, i) => ({
    source: s,
    url: urls[i] || '',
    ctx_vi: ctxs[i] || '',
    quote: qts[i] || '',
    quote_vi: qtvis[i] || ''
  }));
}

function hlWord(text, word) {
  if (!word) return text;
  const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${safeWord})`, 'gi'), '<mark>$1</mark>');
}

function openArtDrawer(w) {
  const arts = parseArticles(w);
  
  // Tăng XP khi xem ngữ cảnh (hàm hỗ trợ trong app.js)
  if (typeof window.xpOnArticleOpen === 'function') window.xpOnArticleOpen();

  document.getElementById('artWord').textContent = w.word;
  const body = document.getElementById('artBody');

  if (!arts.length) {
    body.innerHTML = `
      <div class="art-empty">
        📰<br><br>
        Từ này chưa có dữ liệu ngữ cảnh.<br>
        <span style="font-size:0.75rem; opacity:0.6;">Cập nhật thêm trong file Excel để hiển thị.</span>
      </div>`;
  } else {
    body.innerHTML = arts.map(a => `
      <div class="art-card">
        <div class="art-source">
          <span>${a.source}</span>
          ${a.url ? `<a href="${a.url}" target="_blank">Xem bài gốc ↗</a>` : ''}
        </div>
        ${a.ctx_vi ? `<div class="art-ctx">${a.ctx_vi}</div>` : ''}
        <div class="art-quote">“${hlWord(a.quote, w.word)}”</div>
        ${a.quote_vi ? `<div class="art-quote-vi">${a.quote_vi}</div>` : ''}
      </div>
    `).join('');
  }
  document.getElementById('artOverlay').classList.add('show');
}

function closeArtDrawer() {
  document.getElementById('artOverlay').classList.remove('show');
}


// ── 2. ROOT WORD (AI Phân tích Gốc từ qua chiasegpu.vn) ──

async function openRootWord() {
  const w = window.words[window.currentIndex];
  if (!w) return;

  document.getElementById('rootwordWord').textContent = w.word;
  document.getElementById('rootwordOverlay').classList.add('show');

  const container = document.getElementById('rootwordContent');
  container.innerHTML = `
    <div class="rootword-loading">
      <div class="spinner"></div>
      <span>Claude 4.6 đang phân tích cấu tạo từ...</span>
    </div>`;

  const data = await getRootWordFromAI(w.word);
  
  if (data) {
    renderRootWordResult(container, data);
  } else {
    container.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--neon-pink)">
        <p>⚠️ Lỗi kết nối AI.</p>
        <small>Vui lòng kiểm tra lại trạng thái API Key chiasegpu.</small>
      </div>`;
  }
}

async function getRootWordFromAI(word) {
  if (!_mavisApiKey) return null;

  const API_URL = "https://llm.chiasegpu.vn/v1/chat/completions";
  const MODEL = "claude-sonnet-4.6";

  const systemPrompt = `Bạn là chuyên gia ngôn ngữ học. Phân tích từ tiếng Anh và trả về JSON chuẩn:
{
  "cauTao": "Tiền tố, gốc từ, hậu tố",
  "lichSu": "Nguồn gốc và sự biến đổi nghĩa",
  "meoNhoR": "Mẹo ghi nhớ nhanh"
}
Lưu ý: Chỉ trả về JSON, không giải thích thêm.`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${_mavisApiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Phân tích từ: "${word}"` }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const resJson = await response.json();
    const aiContent = resJson.choices[0].message.content;
    
    return parseRootWordJson(aiContent);
  } catch (error) {
    console.error("Lỗi API ChiaseGPU:", error);
    return null;
  }
}

function parseRootWordJson(rawText) {
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    return {
      cauTao: "Đang cập nhật cấu trúc...",
      lichSu: rawText,
      meoNhoR: "Ghi nhớ qua ví dụ."
    };
  }
}

function renderRootWordResult(container, data) {
  const sections = [
    { key: 'cauTao',  icon: '🧩', label: 'Cấu tạo từ' },
    { key: 'lichSu',  icon: '📜', label: 'Lịch sử hình thành' },
    { key: 'meoNhoR', icon: '💡', label: 'Mẹo ghi nhớ' },
  ];

  const esc = (t) => (t || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));

  let html = '';
  sections.forEach(s => {
    const content = data[s.key];
    if (content) {
      html += `
        <div class="rootword-section">
          <div class="rootword-section-label">${s.icon} ${s.label}</div>
          <div class="rootword-section-content">${esc(content)}</div>
        </div>`;
    }
  });

  if (!html) html = `<div class="rootword-section-content">${esc(JSON.stringify(data))}</div>`;
  container.innerHTML = html;
}

function closeRootWord() {
  document.getElementById('rootwordOverlay').classList.remove('show');
}

// ── 3. ADMIN SETTINGS ──

async function adminSaveMavisApiKey() {
  const keyInput = document.getElementById('adminMavisApiKey');
  const key = (keyInput?.value || '').trim();
  if (!key) return;

  _mavisApiKey = key;
  try {
    const configDoc = window._doc(window._db, 'appConfig', 'mavis');
    await window._setDoc(configDoc, { apiKey: key });
    alert("Cập nhật thành công!");
  } catch (e) {
    console.error(e);
  }
}

// Khởi tạo: Ưu tiên lấy Key từ DB nếu có, không thì dùng Key mặc định đã dán ở trên
(async function initApiKey() {
  const checkFB = setInterval(async () => {
    if (window._db) {
      clearInterval(checkFB);
      try {
        const docSnap = await window._getDoc(window._doc(window._db, 'appConfig', 'mavis'));
        if (docSnap.exists()) {
          _mavisApiKey = docSnap.data().apiKey;
          const keyInput = document.getElementById('adminMavisApiKey');
          if (keyInput) keyInput.value = _mavisApiKey;
        }
      } catch (e) {}
    }
  }, 500);
})();
