// ── ARTICLE DRAWER ──
function parseArticles(w) {
  const sp = s => (s||'').split('|').map(x=>x.trim()).filter(Boolean);
  const src = sp(w.art_source);
  if (!src.length) return [];
  const urls = sp(w.art_url), ctxs = sp(w.art_ctx_vi);
  const qts  = sp(w.art_quote), qtvis = sp(w.art_quote_vi);
  return src.map((s,i) => ({ source:s, url:urls[i]||'', ctx_vi:ctxs[i]||'', quote:qts[i]||'', quote_vi:qtvis[i]||'' }));
}
function hlWord(text, word) {
  if (!word) return text;
  return text.replace(new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'), '<mark>$1</mark>');
}
function openArtDrawer(w) {
  const arts = parseArticles(w);
  xpOnArticleOpen(); // ✦ XP article
  document.getElementById('artWord').textContent = w.word;
  const body = document.getElementById('artBody');
  if (!arts.length) {
    body.innerHTML = `<div class="art-empty">📰<br><br>Từ này chưa có ngữ cảnh báo chí.<br><span style="font-size:0.72rem;opacity:0.6">Thêm vào Excel: <code style="color:var(--neon-cyan)">Nguồn báo · Trích dẫn gốc · Ngữ cảnh VI · Dịch câu</code></span></div>`;
  } else {
    body.innerHTML = arts.map((a,i)=>`
      <div class="art-item" id="aItem${i}">
        <div class="art-item-head" onclick="toggleArt(${i})">
          <span class="art-arrow">▶</span>
          <span class="art-src">${h(a.source)}</span>
        </div>
        <div class="art-item-body">
          ${a.ctx_vi?`<div class="art-sec"><div class="art-sec-lbl">Ngữ cảnh (tiếng Việt)</div><div class="art-ctx">${h(a.ctx_vi)}</div></div>`:''}
          ${a.quote?`<div class="art-sec"><div class="art-sec-lbl">Trích dẫn gốc</div><div class="art-qt">${hlWord(h(a.quote),w.word)}</div></div>`:''}
          ${a.quote_vi?`<div class="art-sec"><div class="art-sec-lbl">Dịch câu</div><div class="art-qtvi">${h(a.quote_vi)}</div></div>`:''}
          ${a.url?`<a class="art-link" href="${h(a.url)}" target="_blank">↗ Đọc bài gốc</a>`:''}
        </div>
      </div>`).join('');
    toggleArt(0);
  }
  document.getElementById('artOverlay').classList.add('open');
}
function toggleArt(i) {
  const item = document.getElementById('aItem'+i);
  if (!item) return;
  const was = item.classList.contains('open');
  document.querySelectorAll('.art-item.open').forEach(el=>el.classList.remove('open'));
  if (!was) item.classList.add('open');
}
function closeArtDrawer() {
  document.getElementById('artOverlay').classList.remove('open');
}
// ── CONTEXT FILE UPLOAD (Admin) ──
function handleDragOver2(e) { e.preventDefault(); document.getElementById('ctxDropzone').classList.add('drag-over'); }
function handleDragLeave2() { document.getElementById('ctxDropzone').classList.remove('drag-over'); }
function handleDropCtx(e) { e.preventDefault(); handleDragLeave2(); const f=e.dataTransfer.files[0]; if(f) processCtxFile(f); }
function handleFileSelectCtx(e) { const f=e.target.files[0]; if(f) processCtxFile(f); e.target.value=''; }

async function processCtxFile(file) {
  if (!file.name.match(/\.(xlsx|xls)$/i)) { showToast('error','✕ Chỉ hỗ trợ .xlsx hoặc .xls'); return; }
  const res = document.getElementById('ctxImportResult');
  res.style.display = 'block';
  res.innerHTML = '<span style="color:rgba(255,255,255,0.45)">⟳ Đang xử lý...</span>';

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const wb   = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval:''});
      if (!rows.length) { showToast('error','✕ File trống'); return; }

      function getC(row, aliases) {
        const keys = Object.keys(row).map(k=>k.toLowerCase().trim());
        for (const a of aliases) { const i=keys.indexOf(a); if(i>=0) return String(Object.values(row)[i]).trim(); }
        return '';
      }
      const CCTX = {
        word:     ['word'],
        source:   ['nguồn báo','nguon bao','article_source','source'],
        url:      ['link','url','article_url'],
        ctx_vi:   ['ngữ cảnh vi','ngu canh vi','article_context_vi','context_vi'],
        quote:    ['trích dẫn gốc','trich dan goc','trích dẫn','article_quote','quote'],
        quote_vi: ['dịch câu','dich cau','article_quote_vi','quote_vi'],
      };

      // Gom theo word (lowercase) → mảng bài báo
      const byWord = {};
      rows.forEach(row => {
        const w = getC(row, CCTX.word).toLowerCase();
        if (!w) return;
        if (!byWord[w]) byWord[w] = [];
        byWord[w].push({
          source:   getC(row, CCTX.source),
          url:      getC(row, CCTX.url),
          ctx_vi:   getC(row, CCTX.ctx_vi),
          quote:    getC(row, CCTX.quote),
          quote_vi: getC(row, CCTX.quote_vi),
        });
      });

      const totalCtxWords = Object.keys(byWord).length;
      const successWords = [];
      const failWords = [];

      // Chỉ merge vào pack đang mở
      if (words.length) {
        words.forEach(w => {
          const key = (w.word||'').toLowerCase();
          if (byWord[key]) {
            const arts = byWord[key];
            w.art_source   = arts.map(a=>a.source).join('|');
            w.art_url      = arts.map(a=>a.url).join('|');
            w.art_ctx_vi   = arts.map(a=>a.ctx_vi).join('|');
            w.art_quote    = arts.map(a=>a.quote).join('|');
            w.art_quote_vi = arts.map(a=>a.quote_vi).join('|');
            successWords.push(w.word);
          }
        });
        // Tìm từ trong file nhưng không khớp trong pack
        Object.keys(byWord).forEach(key => {
          const matched = words.some(w => (w.word||'').toLowerCase() === key);
          if (!matched) failWords.push(byWord[key][0] ? key : key);
        });
        await saveData();

        // Nếu là admin pack → cũng lưu lên adminPacks
        if (currentPack && currentPack.isAdmin && isAdmin()) {
          try {
            await window._setDoc(
              window._doc(window._db, 'adminPacks', currentPack.id),
              { words: words, updatedAt: Date.now() },
              { merge: true }
            );
            await _bumpAppVersion();
          } catch(err2) { console.warn('Admin pack sync error:', err2); }
        }
      } else {
        // Không có pack đang mở
        Object.keys(byWord).forEach(key => failWords.push(key));
      }

      // ── Báo cáo ──
      const packName = currentPack ? currentPack.name : 'Gói hiện tại';
      let html = `
        <div style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;font-size:0.75rem;line-height:1.9">
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
            <span>📄 File: <strong style="color:var(--neon-cyan)">${totalCtxWords}</strong> từ</span>
            <span>✅ Gắn thành công: <strong style="color:var(--neon-green)">${successWords.length}</strong> từ</span>
            <span>❌ Chưa khớp: <strong style="color:var(--neon-pink)">${failWords.length}</strong> từ</span>
          </div>`;
      if (failWords.length > 0) {
        const failList = failWords.map(w=>`<span style="display:inline-block;background:rgba(255,0,110,0.1);border:1px solid rgba(255,0,110,0.25);border-radius:6px;padding:2px 8px;margin:2px;font-family:'Space Mono',monospace;font-size:0.68rem;color:rgba(255,100,130,0.9)">${h(w)}</span>`).join('');
        html += `<div style="font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,0,110,0.5);margin-bottom:6px">Danh sách từ chưa gán được</div>
          <div style="line-height:2">${failList}</div>`;
      } else {
        html += `<div style="color:rgba(57,255,20,0.7);font-size:0.72rem">🎉 Tất cả từ trong file đã được gắn thành công!</div>`;
      }
      html += `</div>`;
      res.innerHTML = html;
      showToast('success', `✓ Gắn ngữ cảnh: ${successWords.length}/${totalCtxWords} từ trong "${packName}"`);
      renderList();
    } catch(err) {
      res.innerHTML = `<span style="color:var(--neon-pink)">✕ Lỗi: ${h(err.message)}</span>`;
      showToast('error','✕ '+err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}


// ============================================================
//  ROOT WORD FEATURE
// ============================================================
const ROOTWORD_CACHE = {};

function getApiKey() { return _mavisApiKey || ''; }

function _rootWordDocKey(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

async function openRootWord(wordObj) {
  if (!wordObj) return;
  const word = wordObj.word || '';
  const overlay = document.getElementById('rootwordOverlay');
  const titleEl = document.getElementById('rootwordTitle');
  const bodyEl  = document.getElementById('rootwordBody');
  titleEl.textContent = word;
  overlay.classList.add('show');
  const apiKey = getApiKey();
  if (!apiKey) {
    bodyEl.innerHTML = '<div class="rootword-no-key">🚧 Tính năng này chưa được kích hoạt (chưa có API Key).</div>';
    return;
  }
  if (ROOTWORD_CACHE[word]) { renderRootWordResult(bodyEl, ROOTWORD_CACHE[word]); return; }
  bodyEl.innerHTML = `<div class="rootword-loading"><div class="rootword-spinner"></div> Đang tải...</div>`;
  try {
    const docKey = _rootWordDocKey(word);
    const ref = window._doc(window._db, 'rootWords', docKey);
    const snap = await window._getDoc(ref);
    if (snap.exists()) {
      const cached = snap.data();
      ROOTWORD_CACHE[word] = cached;
      renderRootWordResult(bodyEl, cached);
      return;
    }
  } catch(e) { console.warn('[RootWord] Firestore read error', e); }
  bodyEl.innerHTML = `<div class="rootword-loading"><div class="rootword-spinner"></div> Đang tra cứu gốc từ...</div>`;
  try {
    const result = await fetchRootWord(word, apiKey);
    ROOTWORD_CACHE[word] = result;
    try {
      const docKey = _rootWordDocKey(word);
      await window._setDoc(window._doc(window._db, 'rootWords', docKey), { ...result, _word: word, _savedAt: Date.now() });
    } catch(e) { console.warn('[RootWord] Firestore write error', e); }
    renderRootWordResult(bodyEl, result);
  } catch(err) {
    bodyEl.innerHTML = `<div class="rootword-error">✕ Lỗi: ${err.message}</div>`;
  }
}

async function fetchRootWord(word, apiKey) {
  const prompt = `Gốc của từ: ${word}. Chỉ trả về JSON, không giải thích thêm: {"cauTao":"...","lichSu":"...","meoNhoR":"..."}`;
  const res = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({ model: 'claude-sonnet-4.6', max_tokens: 400, messages: [{ role: 'user', content: prompt }] })
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('API Key không hợp lệ (401)');
    throw new Error(`Lỗi server ${res.status}`);
  }
  const data = await res.json();
  let rawText = data.choices?.[0]?.message?.content || '';
  const clean = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  try { return JSON.parse(jsonMatch ? jsonMatch[0] : clean); }
  catch(e) { return { cauTao: '', lichSu: rawText, meoNhoR: '' }; }
}

function renderRootWordResult(container, data) {
  const sections = [
    { key: 'cauTao',  icon: '🧩', label: 'Cấu tạo từ' },
    { key: 'lichSu',  icon: '📜', label: 'Lịch sử hình thành' },
    { key: 'meoNhoR', icon: '💡', label: 'Mẹo ghi nhớ' },
  ];
  let html = '';
  for (const s of sections) {
    const val = data[s.key];
    if (!val) continue;
    html += `<div class="rootword-section"><div class="rootword-section-label">${s.icon} ${s.label}</div><div class="rootword-section-content">${h(val)}</div></div>`;
  }
  if (!html) {
    const raw = typeof data === 'string' ? data : JSON.stringify(data);
    html = `<div class="rootword-section-content">${h(raw)}</div>`;
  }
  container.innerHTML = html;
}

function closeRootWord() {
  document.getElementById('rootwordOverlay').classList.remove('show');
}

// Admin: save MAVIS API Key
async function adminSaveMavisApiKey() {
  if (!isAdmin()) return;
  const key = (document.getElementById('adminMavisApiKey')?.value || '').trim();
  _mavisApiKey = key;
  try {
    await window._setDoc(window._doc(window._db, 'appConfig', 'scoring'), { mavisApiKey: key }, { merge: true });
    const btn = document.getElementById('adminSaveMavisKey');
    if (btn) { btn.textContent = '✓ Đã lưu!'; btn.classList.add('saved'); setTimeout(() => { btn.textContent = '✓ Lưu API Key'; btn.classList.remove('saved'); }, 2000); }
  } catch(e) { alert('Lỗi lưu API Key: ' + e.message); }
}

