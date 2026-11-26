/* RAQİB Live Visual Inline Editor (Admin-Only Pencil Mode • 0 Visitor Overhead) */
(function () {
  'use strict';

  const STYLE_ID = 'rqb-inline-editor-css';
  const BAR_ID = 'rqb-admin-dock';
  const MODAL_ID = 'rqb-admin-modal';
  const PILL_ID = 'rqb-admin-mini-pill';
  const TOAST_ID = 'rqb-admin-toast';

  const PENCIL_SVG =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 20h9"/>' +
    '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' +
    '</svg>';

  function injectAdminStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      .rqb-pen {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        min-width: 24px;
        margin-inline-start: 6px;
        padding: 0;
        border-radius: 999px;
        border: 1px solid rgba(52, 211, 153, 0.55);
        background: rgba(6, 78, 59, 0.92);
        color: #A7F3D0;
        cursor: pointer;
        vertical-align: middle;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
        transition: transform 0.14s ease, background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
        line-height: 1;
        z-index: 4;
        position: relative;
      }
      .rqb-pen:hover {
        transform: scale(1.16);
        background: #10B981;
        color: #031912;
        border-color: #6EE7B7;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.28);
      }
      .rqb-pen.is-dirty {
        background: #F59E0B;
        border-color: #FDE68A;
        color: #1F1300;
      }
      .rqb-pen.is-overridden:not(.is-dirty) {
        background: rgba(14, 116, 144, 0.92);
        border-color: rgba(56, 189, 248, 0.7);
        color: #E0F2FE;
      }
      .rqb-edit-host-hover {
        outline: 1.5px dashed rgba(52, 211, 153, 0.75) !important;
        outline-offset: 3px;
        border-radius: 6px;
      }
      #${BAR_ID} {
        position: fixed;
        left: 50%;
        bottom: 16px;
        transform: translateX(-50%);
        z-index: 99990;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
        max-width: calc(100vw - 20px);
        padding: 10px 14px;
        border-radius: 18px;
        background: rgba(10, 16, 24, 0.94);
        border: 1px solid rgba(52, 211, 153, 0.45);
        box-shadow: 0 18px 46px rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        color: #F8FAFC;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        direction: ltr;
      }
      #${BAR_ID} .rqb-dock-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 999px;
        background: rgba(16, 185, 129, 0.16);
        border: 1px solid rgba(52, 211, 153, 0.35);
        color: #A7F3D0;
        font-weight: 700;
        font-size: 12px;
      }
      #${BAR_ID} .rqb-dock-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #34D399;
      }
      #${BAR_ID} .rqb-dock-dot.dirty {
        background: #F59E0B;
      }
      #${BAR_ID} button {
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(255, 255, 255, 0.06);
        color: #F1F5F9;
        border-radius: 10px;
        padding: 7px 12px;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.14s ease;
        white-space: nowrap;
      }
      #${BAR_ID} button:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(148, 163, 184, 0.5);
      }
      #${BAR_ID} button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      #${BAR_ID} button.rqb-btn-save {
        background: linear-gradient(135deg, #10B981, #059669);
        border-color: #34D399;
        color: #031912;
        font-weight: 800;
      }
      #${BAR_ID} button.rqb-btn-save:hover:not(:disabled) {
        filter: brightness(1.08);
      }
      #${BAR_ID} button.rqb-btn-danger {
        color: #FCA5A5;
        border-color: rgba(248, 113, 113, 0.32);
      }
      #${BAR_ID} button.rqb-btn-danger:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.18);
      }
      #${PILL_ID} {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 99985;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 14px;
        border-radius: 999px;
        background: rgba(10, 16, 24, 0.92);
        border: 1px solid rgba(52, 211, 153, 0.48);
        color: #A7F3D0;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(14px);
      }
      #${PILL_ID}:hover {
        background: #10B981;
        color: #031912;
      }
      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(3, 7, 12, 0.78);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        direction: ltr;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #${MODAL_ID} .rqb-modal-card {
        width: min(640px, 100%);
        background: #0F1722;
        border: 1px solid rgba(52, 211, 153, 0.38);
        border-radius: 20px;
        padding: 20px 22px;
        color: #F8FAFC;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65);
      }
      #${MODAL_ID} .rqb-modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }
      #${MODAL_ID} .rqb-modal-title {
        font-size: 16px;
        font-weight: 800;
        margin: 0;
      }
      #${MODAL_ID} .rqb-modal-meta {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 11.5px;
        color: #34D399;
        background: rgba(16, 185, 129, 0.14);
        border: 1px solid rgba(52, 211, 153, 0.3);
        padding: 3px 9px;
        border-radius: 999px;
      }
      #${MODAL_ID} .rqb-modal-sub {
        margin: 0 0 12px;
        color: #94A3B8;
        font-size: 13px;
        line-height: 1.5;
      }
      #${MODAL_ID} .rqb-fmt-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      #${MODAL_ID} .rqb-fmt-btn {
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(255, 255, 255, 0.05);
        color: #CBD5E1;
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }
      #${MODAL_ID} .rqb-fmt-btn:hover {
        border-color: #34D399;
        color: #FFFFFF;
      }
      #${MODAL_ID} textarea, #${MODAL_ID} input[type="password"] {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.28);
        background: #070C13;
        color: #F8FAFC;
        border-radius: 12px;
        padding: 12px 14px;
        font-family: inherit;
        font-size: 14.5px;
        line-height: 1.6;
        outline: none;
        resize: vertical;
        box-sizing: border-box;
      }
      #${MODAL_ID} textarea:focus, #${MODAL_ID} input[type="password"]:focus {
        border-color: #10B981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
      }
      #${MODAL_ID} .rqb-modal-err {
        color: #FCA5A5;
        font-size: 12.5px;
        min-height: 18px;
        margin-top: 6px;
      }
      #${MODAL_ID} .rqb-modal-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      #${MODAL_ID} .rqb-modal-right {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-inline-start: auto;
      }
      #${MODAL_ID} .rqb-btn {
        border: 1px solid rgba(148, 163, 184, 0.28);
        background: rgba(255, 255, 255, 0.06);
        color: #F1F5F9;
        border-radius: 11px;
        padding: 9px 15px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      #${MODAL_ID} .rqb-btn:hover { background: rgba(255, 255, 255, 0.13); }
      #${MODAL_ID} .rqb-btn-primary {
        background: linear-gradient(135deg, #10B981, #059669);
        border-color: #34D399;
        color: #031912;
      }
      #${MODAL_ID} .rqb-btn-primary:hover { filter: brightness(1.08); }
      #${MODAL_ID} .rqb-btn-amber {
        background: rgba(245, 158, 11, 0.18);
        border-color: rgba(251, 191, 36, 0.5);
        color: #FDE68A;
      }
      #${MODAL_ID} .rqb-btn-ghost-danger {
        border-color: rgba(248, 113, 113, 0.35);
        color: #FCA5A5;
      }
      #${TOAST_ID} {
        position: fixed;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100000;
        padding: 10px 18px;
        border-radius: 999px;
        background: #064E3B;
        border: 1px solid #34D399;
        color: #ECFDF5;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        direction: ltr;
      }
      #${TOAST_ID}.is-err {
        background: #7F1D1D;
        border-color: #F87171;
        color: #FEF2F2;
      }
      @media (max-width: 640px) {
        #${BAR_ID} {
          bottom: 10px;
          padding: 8px 10px;
          gap: 6px;
        }
        #${BAR_ID} button {
          padding: 6px 9px;
          font-size: 11.5px;
        }
      }
    `;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showToast(msg, isError) {
    const prev = document.getElementById(TOAST_ID);
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.id = TOAST_ID;
    if (isError) el.className = 'is-err';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, 3400);
  }

  function getSessionStatsKey() {
    try {
      return sessionStorage.getItem('raqib_stats_key') || '';
    } catch (_) {
      return '';
    }
  }

  function setSessionStatsKey(val) {
    try {
      if (val) sessionStorage.setItem('raqib_stats_key', val);
      else sessionStorage.removeItem('raqib_stats_key');
    } catch (_) {}
  }

  function authHeaders() {
    const k = getSessionStatsKey();
    return k ? { 'x-stats-key': k } : {};
  }

  /**
   * Initializes live content override loading + optional Admin Pencil Editor on a page.
   *
   * adapter = {
   *   page: 'index' | 'privacy',
   *   getCurrentLang: () => 'tr' | 'en' | 'ar' | 'ku' | 'de',
   *   applyOverrides: (mergedOverridesObj) => void,
   *   getTargets: () => Array<{ el: HTMLElement, key: string, label: string, getValue: () => string, getDefault: () => string, isRtl?: boolean }>
   * }
   */
  function boot(adapter) {
    const state = {
      isAdmin: false,
      editMode: false,
      pencilsVisible: true,
      storageConfigured: false,
      storageBackend: 'none',
      serverOverrides: {},
      pendingPatch: {},      // key -> newValue (string)
      pendingDeletes: {},    // key -> true (reset single key to code default)
      saving: false
    };

    const apiAvailable =
      location.protocol.startsWith('http') && !location.hostname.endsWith('github.io');

    function getMergedOverrides() {
      const merged = Object.assign({}, state.serverOverrides);
      Object.keys(state.pendingDeletes).forEach((k) => delete merged[k]);
      Object.keys(state.pendingPatch).forEach((k) => {
        merged[k] = state.pendingPatch[k];
      });
      return merged;
    }

    function dirtyCount() {
      return Object.keys(state.pendingPatch).length + Object.keys(state.pendingDeletes).length;
    }

    function clearPencils() {
      document.querySelectorAll('.rqb-pen').forEach((p) => p.remove());
    }

    function refreshAll() {
      clearPencils();
      adapter.applyOverrides(getMergedOverrides());
      if (state.isAdmin && state.editMode && state.pencilsVisible) {
        attachPencils();
      }
      renderAdminChrome();
    }

    function attachPencils() {
      clearPencils();
      if (!state.isAdmin || !state.editMode || !state.pencilsVisible) return;
      injectAdminStyles();
      const targets = adapter.getTargets() || [];
      targets.forEach((t) => {
        if (!t || !t.el || !t.el.isConnected) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rqb-pen';
        btn.setAttribute('data-rqb-pen', t.key);
        btn.setAttribute('aria-label', 'Düzenle: ' + (t.label || t.key));
        btn.title = 'Düzenle (' + t.key + ')';
        if (state.pendingPatch[t.key] !== undefined || state.pendingDeletes[t.key]) {
          btn.classList.add('is-dirty');
        } else if (state.serverOverrides[t.key] !== undefined) {
          btn.classList.add('is-overridden');
        }
        btn.innerHTML = PENCIL_SVG;
        btn.addEventListener('mouseenter', () => t.el.classList.add('rqb-edit-host-hover'));
        btn.addEventListener('mouseleave', () => t.el.classList.remove('rqb-edit-host-hover'));
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          t.el.classList.remove('rqb-edit-host-hover');
          openFieldEditorModal(t);
        });
        t.el.appendChild(btn);
      });
    }

    function closeModal() {
      const m = document.getElementById(MODAL_ID);
      if (m) m.remove();
    }

    function wrapSelection(textarea, openTag, closeTag) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const selected = val.slice(start, end) || 'metin';
      const next = val.slice(0, start) + openTag + selected + closeTag + val.slice(end);
      textarea.value = next;
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }

    function openFieldEditorModal(target) {
      injectAdminStyles();
      closeModal();
      const currentVal = String(target.getValue() || '');
      const defaultVal = String(target.getDefault() || '');
      const isOverridden =
        state.pendingPatch[target.key] !== undefined ||
        (state.serverOverrides[target.key] !== undefined && !state.pendingDeletes[target.key]);

      const overlay = document.createElement('div');
      overlay.id = MODAL_ID;
      overlay.innerHTML = `
        <div class="rqb-modal-card" role="dialog" aria-modal="true">
          <div class="rqb-modal-head">
            <h3 class="rqb-modal-title">✏️ Metni Düzenle</h3>
            <span class="rqb-modal-meta"></span>
          </div>
          <p class="rqb-modal-sub">Değişikliği önce taslak olarak uygulayabilir veya doğrudan tüm dünyada canlı yayınlayabilirsiniz. (İzinli biçimler: <code>&lt;strong&gt;</code>, <code>&lt;code&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;br&gt;</code>)</p>
          <div class="rqb-fmt-bar">
            <button type="button" class="rqb-fmt-btn" data-fmt="strong"><strong>Kalın</strong></button>
            <button type="button" class="rqb-fmt-btn" data-fmt="em"><em>İtalik</em></button>
            <button type="button" class="rqb-fmt-btn" data-fmt="code">&lt;code&gt;</button>
            <button type="button" class="rqb-fmt-btn" data-fmt="br">Satır Başı (&lt;br&gt;)</button>
          </div>
          <textarea rows="5"></textarea>
          <div class="rqb-modal-err"></div>
          <div class="rqb-modal-actions">
            <button type="button" class="rqb-btn rqb-btn-ghost-danger" data-act="reset-one" ${isOverridden ? '' : 'style="display:none;"'}>Varsayılana Döndür</button>
            <div class="rqb-modal-right">
              <button type="button" class="rqb-btn" data-act="cancel">İptal</button>
              <button type="button" class="rqb-btn rqb-btn-amber" data-act="apply">Taslağa Uygula</button>
              <button type="button" class="rqb-btn rqb-btn-primary" data-act="publish">💾 Kaydet &amp; Yayınla</button>
            </div>
          </div>
        </div>
      `;

      overlay.querySelector('.rqb-modal-meta').textContent = target.key;
      const ta = overlay.querySelector('textarea');
      ta.value = currentVal;
      if (target.isRtl || adapter.getCurrentLang() === 'ar') {
        ta.dir = 'rtl';
      }
      const errEl = overlay.querySelector('.rqb-modal-err');

      overlay.querySelectorAll('.rqb-fmt-btn').forEach((b) => {
        b.addEventListener('click', () => {
          const f = b.getAttribute('data-fmt');
          if (f === 'strong') wrapSelection(ta, '<strong>', '</strong>');
          else if (f === 'em') wrapSelection(ta, '<em>', '</em>');
          else if (f === 'code') wrapSelection(ta, '<code>', '</code>');
          else if (f === 'br') {
            const pos = ta.selectionStart;
            ta.value = ta.value.slice(0, pos) + '<br>' + ta.value.slice(ta.selectionEnd);
            ta.focus();
            ta.setSelectionRange(pos + 4, pos + 4);
          }
        });
      });

      function stageCurrentValue() {
        const nextVal = ta.value.trim();
        if (!nextVal) {
          errEl.textContent = 'Metin boş bırakılamaz. Orijinale dönmek için "Varsayılana Döndür" kullanın.';
          return false;
        }
        if (nextVal === defaultVal) {
          delete state.pendingPatch[target.key];
          if (state.serverOverrides[target.key] !== undefined) {
            state.pendingDeletes[target.key] = true;
          } else {
            delete state.pendingDeletes[target.key];
          }
        } else {
          delete state.pendingDeletes[target.key];
          state.pendingPatch[target.key] = nextVal;
        }
        return true;
      }

      overlay.querySelector('[data-act="cancel"]').addEventListener('click', closeModal);
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeModal();
      });

      overlay.querySelector('[data-act="reset-one"]').addEventListener('click', async () => {
        delete state.pendingPatch[target.key];
        if (state.serverOverrides[target.key] !== undefined) {
          state.pendingDeletes[target.key] = true;
        }
        closeModal();
        refreshAll();
        showToast('Varsayılana alındı — kalıcı olması için "Kaydet & Yayınla"ya basın.');
      });

      overlay.querySelector('[data-act="apply"]').addEventListener('click', () => {
        if (!stageCurrentValue()) return;
        closeModal();
        refreshAll();
        showToast('Taslağa uygulandı — hazır olunca "Kaydet & Yayınla"ya basın.');
      });

      overlay.querySelector('[data-act="publish"]').addEventListener('click', async () => {
        if (!stageCurrentValue()) return;
        closeModal();
        refreshAll();
        await publishPending();
      });

      ta.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          closeModal();
        } else if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
          ev.preventDefault();
          if (stageCurrentValue()) {
            closeModal();
            refreshAll();
            publishPending();
          }
        }
      });

      document.body.appendChild(overlay);
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }

    function openLoginModal() {
      injectAdminStyles();
      closeModal();
      const overlay = document.createElement('div');
      overlay.id = MODAL_ID;
      overlay.innerHTML = `
        <div class="rqb-modal-card" style="width:min(420px,100%);" role="dialog" aria-modal="true">
          <div class="rqb-modal-head">
            <h3 class="rqb-modal-title">🔐 RAQİB Admin Canlı Düzenleme</h3>
            <span class="rqb-modal-meta">${adapter.page}</span>
          </div>
          <p class="rqb-modal-sub">Mevcut istatistik paneli şifrenizi (<code>STATS_ADMIN_KEY</code>) girerek her metnin yanında düzenleme kalemciklerini açın.</p>
          <input type="password" placeholder="Admin şifresi..." autocomplete="current-password" />
          <div class="rqb-modal-err"></div>
          <div class="rqb-modal-actions">
            <div class="rqb-modal-right">
              <button type="button" class="rqb-btn" data-act="cancel">Kapat</button>
              <button type="button" class="rqb-btn rqb-btn-primary" data-act="login">Giriş Yap</button>
            </div>
          </div>
        </div>
      `;

      const inp = overlay.querySelector('input');
      const errEl = overlay.querySelector('.rqb-modal-err');
      const loginBtn = overlay.querySelector('[data-act="login"]');

      async function doLogin() {
        const key = inp.value.trim();
        if (!key) {
          errEl.textContent = 'Lütfen admin şifresini girin.';
          return;
        }
        loginBtn.disabled = true;
        errEl.textContent = '';
        try {
          const res = await fetch('/api/content', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', key })
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            errEl.textContent =
              res.status === 503
                ? 'Vercel üzerinde STATS_ADMIN_KEY ortam değişkeni tanımlı değil.'
                : 'Şifre hatalı.';
            loginBtn.disabled = false;
            return;
          }
          setSessionStatsKey(key);
          state.isAdmin = true;
          state.editMode = true;
          state.pencilsVisible = true;
          state.storageConfigured = Boolean(data.storageConfigured);
          state.storageBackend = data.storageBackend || state.storageBackend;
          closeModal();
          refreshAll();
          showToast('Admin düzenleme modu açıldı — istediğiniz yazının yanındaki ✏️ kaleme tıklayın.');
        } catch (_) {
          errEl.textContent = 'Sunucuya ulaşılamadı. Canlı Vercel adresinden erişin.';
          loginBtn.disabled = false;
        }
      }

      overlay.querySelector('[data-act="cancel"]').addEventListener('click', closeModal);
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeModal();
      });
      loginBtn.addEventListener('click', doLogin);
      inp.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') doLogin();
        if (ev.key === 'Escape') closeModal();
      });

      document.body.appendChild(overlay);
      inp.focus();
    }

    async function publishPending() {
      if (state.saving) return;
      const patchKeys = Object.keys(state.pendingPatch);
      const delKeys = Object.keys(state.pendingDeletes);
      if (patchKeys.length === 0 && delKeys.length === 0) {
        showToast('Kaydedilecek yeni değişiklik yok.');
        return;
      }
      state.saving = true;
      renderAdminChrome();
      try {
        const res = await fetch('/api/content', {
          method: 'POST',
          credentials: 'same-origin',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
          body: JSON.stringify({
            action: 'save',
            page: adapter.page,
            patch: state.pendingPatch,
            deleteKeys: delKeys
          })
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          state.isAdmin = false;
          state.editMode = false;
          refreshAll();
          openLoginModal();
          showToast('Oturum süresi doldu, lütfen tekrar giriş yapın.', true);
          return;
        }
        if (!res.ok) {
          const msg =
            data.error === 'storage_not_configured'
              ? 'Vercel üzerinde Redis veya Gist depolaması ayarlı değil.'
              : 'Kayıt başarısız: ' + (data.error || res.status);
          showToast(msg, true);
          return;
        }
        state.serverOverrides = data.overrides || {};
        state.pendingPatch = {};
        state.pendingDeletes = {};
        state.storageConfigured = true;
        state.storageBackend = data.storageBackend || state.storageBackend;
        refreshAll();
        showToast('✓ Kaydedildi ve tüm dünyada anında yayınlandı!');
      } catch (_) {
        showToast('Ağ hatası: Değişiklikler sunucuya gönderilemedi.', true);
      } finally {
        state.saving = false;
        renderAdminChrome();
      }
    }

    async function resetCurrentLangOnServer() {
      const lang = adapter.getCurrentLang();
      const ok = window.confirm(
        `Bu sayfadaki "${lang.toUpperCase()}" diline ait tüm özel düzenlemeler silinip orijinal varsayılan metinlere dönülsün mü?`
      );
      if (!ok) return;
      state.saving = true;
      renderAdminChrome();
      try {
        const res = await fetch('/api/content', {
          method: 'POST',
          credentials: 'same-origin',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
          body: JSON.stringify({
            action: 'reset',
            page: adapter.page,
            lang
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showToast('Sıfırlama başarısız: ' + (data.error || res.status), true);
          return;
        }
        state.serverOverrides = data.overrides || {};
        Object.keys(state.pendingPatch).forEach((k) => {
          if (k.startsWith(lang + '.')) delete state.pendingPatch[k];
        });
        Object.keys(state.pendingDeletes).forEach((k) => {
          if (k.startsWith(lang + '.')) delete state.pendingDeletes[k];
        });
        refreshAll();
        showToast(`✓ ${lang.toUpperCase()} metinleri varsayılana sıfırlandı.`);
      } catch (_) {
        showToast('Sıfırlama sırasında ağ hatası oluştu.', true);
      } finally {
        state.saving = false;
        renderAdminChrome();
      }
    }

    async function logoutAdmin() {
      try {
        await fetch('/api/content', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' })
        });
      } catch (_) {}
      setSessionStatsKey('');
      state.isAdmin = false;
      state.editMode = false;
      state.pendingPatch = {};
      state.pendingDeletes = {};
      // Clean ?admin=1 from URL cleanly
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.has('admin')) {
          u.searchParams.delete('admin');
          window.history.replaceState({}, '', u.toString());
        }
      } catch (_) {}
      refreshAll();
      showToast('Admin oturumu kapatıldı.');
    }

    function renderAdminChrome() {
      const oldBar = document.getElementById(BAR_ID);
      const oldPill = document.getElementById(PILL_ID);
      if (oldBar) oldBar.remove();
      if (oldPill) oldPill.remove();

      if (!state.isAdmin) return;
      injectAdminStyles();

      if (!state.editMode) {
        const pill = document.createElement('button');
        pill.id = PILL_ID;
        pill.type = 'button';
        pill.innerHTML = `${PENCIL_SVG} <span>Admin Düzenle</span>`;
        pill.addEventListener('click', () => {
          state.editMode = true;
          state.pencilsVisible = true;
          refreshAll();
        });
        document.body.appendChild(pill);
        return;
      }

      const dirty = dirtyCount();
      const lang = String(adapter.getCurrentLang() || 'tr').toUpperCase();
      const pageLabel = adapter.page === 'privacy' ? 'Gizlilik' : 'Vitrin';
      const otherHref = adapter.page === 'privacy' ? './index.html?admin=1' : './privacy.html?admin=1';
      const otherLabel = adapter.page === 'privacy' ? 'Vitrine Geç' : 'Gizlilik Sayfası';

      const bar = document.createElement('div');
      bar.id = BAR_ID;
      bar.innerHTML = `
        <span class="rqb-dock-badge">
          <span class="rqb-dock-dot${dirty > 0 ? ' dirty' : ''}"></span>
          <span>Admin • ${pageLabel} (${lang})</span>
          ${dirty > 0 ? `<span style="color:#FDE68A;">• ${dirty} taslak</span>` : ''}
        </span>
        <button type="button" data-a="save" class="rqb-btn-save" ${dirty === 0 || state.saving ? 'disabled' : ''}>
          ${state.saving ? 'Kaydediliyor...' : '💾 Kaydet & Yayınla'}
        </button>
        <button type="button" data-a="toggle">${state.pencilsVisible ? '👁️ Önizle' : '✏️ Kalemleri Göster'}</button>
        <button type="button" data-a="discard" ${dirty === 0 || state.saving ? 'disabled' : ''}>↩️ Geri Al</button>
        <button type="button" data-a="reset" class="rqb-btn-danger" ${state.saving ? 'disabled' : ''}>🔄 ${lang} Sıfırla</button>
        <button type="button" data-a="switch">↗ ${otherLabel}</button>
        <button type="button" data-a="hide">Küçült</button>
        <button type="button" data-a="logout" class="rqb-btn-danger">Çıkış</button>
      `;

      bar.querySelector('[data-a="save"]').addEventListener('click', publishPending);
      bar.querySelector('[data-a="toggle"]').addEventListener('click', () => {
        state.pencilsVisible = !state.pencilsVisible;
        refreshAll();
      });
      bar.querySelector('[data-a="discard"]').addEventListener('click', () => {
        state.pendingPatch = {};
        state.pendingDeletes = {};
        refreshAll();
        showToast('Kaydedilmemiş taslak değişiklikler geri alındı.');
      });
      bar.querySelector('[data-a="reset"]').addEventListener('click', resetCurrentLangOnServer);
      bar.querySelector('[data-a="switch"]').addEventListener('click', () => {
        if (dirtyCount() > 0 && !window.confirm('Kaydedilmemiş değişiklikler var. Sayfa değiştirilsin mi?')) return;
        window.location.href = otherHref;
      });
      bar.querySelector('[data-a="hide"]').addEventListener('click', () => {
        state.editMode = false;
        refreshAll();
      });
      bar.querySelector('[data-a="logout"]').addEventListener('click', logoutAdmin);

      document.body.appendChild(bar);
    }

    // Warn before leaving tab with unsaved edits
    window.addEventListener('beforeunload', (ev) => {
      if (state.isAdmin && dirtyCount() > 0) {
        ev.preventDefault();
        ev.returnValue = '';
      }
    });

    // Secret shortcut Ctrl+Shift+E to toggle Admin Login / Edit Mode
    document.addEventListener('keydown', (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === 'E' || ev.key === 'e')) {
        ev.preventDefault();
        if (!apiAvailable) {
          showToast('Canlı düzenleme yalnızca Vercel adresinde çalışır.', true);
          return;
        }
        if (state.isAdmin) {
          state.editMode = !state.editMode;
          state.pencilsVisible = true;
          refreshAll();
        } else {
          openLoginModal();
        }
      }
    });

    // Initial remote content & session fetch
    async function init() {
      const params = new URLSearchParams(window.location.search);
      const wantsAdmin = params.get('admin') === '1' || params.get('edit') === '1';

      if (!apiAvailable) {
        if (wantsAdmin) {
          injectAdminStyles();
          showToast('Canlı düzenleme yalnızca Vercel adresinde çalışır.', true);
        }
        return;
      }

      try {
        const res = await fetch('/api/content?page=' + encodeURIComponent(adapter.page), {
          credentials: 'same-origin',
          headers: authHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          state.serverOverrides = (data && data.overrides) || {};
          state.isAdmin = Boolean(data && data.isAdmin);
          state.storageConfigured = Boolean(data && data.storageConfigured);
          state.storageBackend = (data && data.storageBackend) || 'none';
          if (state.isAdmin && wantsAdmin) {
            state.editMode = true;
            state.pencilsVisible = true;
          }
          refreshAll();
          if (!state.isAdmin && wantsAdmin) {
            openLoginModal();
          }
        } else if (wantsAdmin) {
          openLoginModal();
        }
      } catch (_) {
        if (wantsAdmin) openLoginModal();
      }
    }

    init();

    return {
      onLanguageChanged: () => {
        if (state.isAdmin && state.editMode) {
          attachPencils();
          renderAdminChrome();
        }
      },
      refresh: () => refreshAll(),
      openLogin: () => openLoginModal()
    };
  }

  window.RaqibInlineEditor = { boot };
})();
