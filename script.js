/* ── Estado global ───────────────────────────────────────────────── */
let DATA      = null;
let completed = JSON.parse(localStorage.getItem('olimpico_done') || '[]');

/* ── Carregar dados ──────────────────────────────────────────────── */
fetch('./exercicios.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => { DATA = d; init(); })
  .catch(() => {
    document.getElementById('loading').innerHTML =
      '<p style="color:#e8547a;text-align:center">Não foi possível carregar <code>exercicios.json</code>.<br>Verifique se o arquivo está na mesma pasta.</p>';
  });

/* ── Init ────────────────────────────────────────────────────────── */
function init() {
  document.getElementById('loading').style.display = 'none';
  showHome();
}

/* ── Persistência (localStorage) ────────────────────────────────── */
function isDone(dia) {
  return completed.includes(dia);
}

function toggleDone(dia) {
  if (isDone(dia)) {
    completed = completed.filter(d => d !== dia);
  } else {
    completed.push(dia);
  }
  localStorage.setItem('olimpico_done', JSON.stringify(completed));
}

/* ── Classe CSS por tema ─────────────────────────────────────────── */
function temaClass(tema) {
  const t = tema.toLowerCase();
  if (t.includes('aritmética') || t.includes('teoria')) return 'aritmetica';
  if (t.includes('lógico') || t.includes('contagem') || t.includes('probabilidade')) return 'logica';
  if (t.includes('álgebra')) return 'algebra';
  if (t.includes('geometria')) return 'geometria';
  if (t.includes('prova')) return 'prova';
  return 'aritmetica';
}

/* ── Tela inicial ────────────────────────────────────────────────── */
function showHome() {
  document.getElementById('view-day').style.display  = 'none';
  document.getElementById('view-home').style.display = 'block';
  document.getElementById('header-nav').innerHTML    = '';

  const total = DATA.meta.totalDias;
  const done  = completed.length;
  const pct   = Math.round(done / total * 100);

  const grid = DATA.dias.map(d => {
    const tick = isDone(d.dia);
    return `
      <div class="day-card ${tick ? 'done' : ''}" onclick="showDay(${d.dia})">
        <div class="day-num">D${String(d.dia).padStart(2, '0')}</div>
        <div class="day-tema">${d.tema}</div>
        <div class="day-topico">${d.topico}</div>
      </div>`;
  }).join('');

  document.getElementById('view-home').innerHTML = `
    <div class="home-hero">
      <div>
        <h1>Matemática<br><em>Olímpica</em></h1>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:0.5rem">
          ${DATA.meta.serie} · Preparatório 20 dias
        </p>
        <div class="progress-bar-wrap" style="margin-top:1rem">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <p style="font-size:0.72rem;color:var(--muted);margin-top:0.4rem;font-family:'DM Mono',monospace">
          ${done}/${total} dias concluídos · ${pct}%
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-num">${done}</div>
          <div class="stat-label">Feitos</div>
        </div>
        <div class="stat">
          <div class="stat-num">${total - done}</div>
          <div class="stat-label">Restam</div>
        </div>
        <div class="stat">
          <div class="stat-num">${done * 3}</div>
          <div class="stat-label">Exercícios</div>
        </div>
      </div>
    </div>
    <div class="section-label">Selecione o dia</div>
    <div class="days-grid">${grid}</div>
  `;
}

/* ── Tela do dia ─────────────────────────────────────────────────── */
function showDay(num) {
  const d  = DATA.dias.find(x => x.dia === num);
  const tc = temaClass(d.tema);

  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-day').style.display  = 'block';

  // Header com botões de rascunho e impressão
  const semRascunho = document.body.classList.contains('sem-rascunho');
  document.getElementById('header-nav').innerHTML = `
    <button class="btn btn-ghost" onclick="showHome()">← Todos os dias</button>
    <button class="btn btn-ghost" id="btn-rascunho" onclick="toggleRascunho()">
      ${semRascunho ? '□ Sem rascunho' : '▭ Com rascunho'}
    </button>
    <button class="btn btn-primary" onclick="window.print()">⎙ Imprimir folha</button>
  `;

  // Exercícios
  const exHtml = d.exercicios.map((ex, i) => `
    <div class="exercicio tema-${tc}" id="ex-${num}-${i}">
      <div class="exercicio-header">
        <div class="ex-num">${i + 1}</div>
        <span class="ex-label">Exercício ${i + 1} de ${d.exercicios.length}</span>
      </div>
      <div class="ex-enunciado">${ex.enunciado}</div>
      <div class="toggle-extras">
        <button class="toggle-btn" onclick="toggleSection(${num},${i},'dica',this)">💡 Ver dica</button>
        <button class="toggle-btn" onclick="toggleSection(${num},${i},'gab',this)">✓ Ver gabarito</button>
        <button class="toggle-btn" onclick="toggleAll(${num},${i},this)">◈ Ver tudo</button>
      </div>
      <div class="ex-extras" id="extras-${num}-${i}">
        <div class="ex-dica">
          <div class="ex-section-label">💡 Dica</div>
          <p>${ex.dica}</p>
        </div>
        <div class="ex-gabarito">
          <div class="ex-section-label">✓ Gabarito</div>
          <p>${ex.gabarito}</p>
        </div>
      </div>
    </div>
  `).join('');

  const doneBtnClass = isDone(num) ? '' : 'pending';
  const doneBtnText  = isDone(num) ? '✓ Dia concluído' : '○ Marcar como feito';
  const prevDia      = num > 1                    ? num - 1 : null;
  const nextDia      = num < DATA.meta.totalDias  ? num + 1 : null;

  document.getElementById('view-day').innerHTML = `
    <div class="day-header">
      <div class="day-header-left">
        <h2>Dia ${num} — ${d.topico}</h2>
        <span class="tema-tag tag-${tc}">${d.tema}</span>
      </div>
      <div class="day-actions">
        <button class="done-toggle ${doneBtnClass}" id="done-btn-${num}" onclick="handleDone(${num})">
          ${doneBtnText}
        </button>
      </div>
    </div>
    ${exHtml}
    <div class="day-nav">
      ${prevDia ? `<button class="btn btn-ghost" onclick="showDay(${prevDia})">← Dia ${prevDia}</button>` : '<span></span>'}
      ${nextDia ? `<button class="btn btn-ghost" onclick="showDay(${nextDia})">Dia ${nextDia} →</button>` : '<span></span>'}
    </div>
  `;

  // Rodapé para impressão
  document.getElementById('print-footer').textContent =
    `Treino Olímpico de Matemática · ${DATA.meta.serie} · Dia ${num}: ${d.topico}`;

  window.scrollTo(0, 0);
}

/* ── Toggle dica / gabarito individualmente ──────────────────────── */
function toggleSection(dia, ex, tipo, btn) {
  const wrap = document.getElementById(`extras-${dia}-${ex}`);
  const dica = wrap.querySelector('.ex-dica');
  const gab  = wrap.querySelector('.ex-gabarito');

  if (tipo === 'dica') {
    const show = !dica.classList.contains('vis');
    dica.classList.toggle('vis', show);
    gab.classList.remove('vis');
  } else {
    const show = !gab.classList.contains('vis');
    gab.classList.toggle('vis', show);
    dica.classList.remove('vis');
  }

  const anyVisible = dica.classList.contains('vis') || gab.classList.contains('vis');
  wrap.classList.toggle('visible', anyVisible);

  // Mostra só o painel marcado como .vis
  [...wrap.children].forEach(el => {
    el.style.display = anyVisible
      ? (el.classList.contains('vis') ? '' : 'none')
      : '';
  });

  btn.classList.toggle('active');
}

/* ── Toggle dica + gabarito juntos ───────────────────────────────── */
function toggleAll(dia, ex, btn) {
  const wrap    = document.getElementById(`extras-${dia}-${ex}`);
  const showing = wrap.classList.contains('visible');

  wrap.classList.toggle('visible', !showing);
  [...wrap.children].forEach(el => {
    el.style.display = '';
    el.classList.remove('vis');
  });

  btn.classList.toggle('active', !showing);

  // Reset nos botões individuais
  wrap.parentElement.querySelectorAll('.toggle-btn').forEach((b, i) => {
    if (i < 2) b.classList.remove('active');
  });
}

/* ── Toggle espaço de rascunho na impressão ──────────────────────── */
function toggleRascunho() {
  document.body.classList.toggle('sem-rascunho');
  const sem = document.body.classList.contains('sem-rascunho');
  const btn = document.getElementById('btn-rascunho');
  if (btn) btn.textContent = sem ? '□ Sem rascunho' : '▭ Com rascunho';
}

/* ── Marcar dia como feito ───────────────────────────────────────── */
function handleDone(num) {
  toggleDone(num);
  const done = isDone(num);
  const btn  = document.getElementById(`done-btn-${num}`);
  btn.className   = `done-toggle ${done ? '' : 'pending'}`;
  btn.textContent = done ? '✓ Dia concluído' : '○ Marcar como feito';
}
