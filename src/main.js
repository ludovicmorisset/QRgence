import QRCode from 'qrcode'
import './style.css'

const state = {
  name: '',
  age: '',
  blood: '',
  allergies: '',
  conditions: '',
  medicines: '',
  notes: '',
  contacts: [{ name: '', relation: '', phone: '' }],
  doctor: '',
  doctorPhone: '',
  theme: 'coral',
  qr: '',
  resultData: null,
  step: 1,
}

const themes = {
  coral: { label: 'Corail', bg: '#e9694f', light: '#fff0e9', ink: '#48251f' },
  ocean: { label: 'Océan', bg: '#176b70', light: '#e4f3f1', ink: '#14383a' },
  lavender: { label: 'Lavande', bg: '#7669a8', light: '#f0edfb', ink: '#30294d' },
  night: { label: 'Nuit', bg: '#263653', light: '#e8eef7', ink: '#18263d' },
}

const app = document.querySelector('#app')

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function input(label, key, placeholder = '', type = 'text') {
  return `<label class="field"><span>${label}</span><input data-key="${key}" type="${type}" value="${escapeHtml(state[key])}" placeholder="${placeholder}" autocomplete="off" /></label>`
}

function textarea(label, key, placeholder = '') {
  return `<label class="field"><span>${label}</span><textarea data-key="${key}" rows="2" placeholder="${placeholder}">${escapeHtml(state[key])}</textarea></label>`
}

function contactFields(contact, index) {
  return `<div class="contact-fields"><label class="field"><span>${index === 0 ? 'Nom' : 'Nom du contact ' + (index + 1)}</span><input data-contact="${index}" data-property="name" value="${escapeHtml(contact.name)}" placeholder="Ex. Marie Dupont" autocomplete="off" /></label><label class="field"><span>Lien</span><input data-contact="${index}" data-property="relation" value="${escapeHtml(contact.relation)}" placeholder="Ex. maman" autocomplete="off" /></label><label class="field phone-field"><span>Téléphone</span><input data-contact="${index}" data-property="phone" type="tel" value="${escapeHtml(contact.phone)}" placeholder="06 12 34 56 78" autocomplete="off" /></label>${index ? `<button class="remove-contact" data-remove="${index}" aria-label="Supprimer ce contact">×</button>` : ''}</div>`
}

function render() {
  const theme = themes[state.theme]
  const resultVisible = document.querySelector('#result')?.classList.contains('visible') ?? false
  app.innerHTML = `<header class="topbar"><a class="brand" href="#"><span class="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M13 5h6v8h8v6h-8v8h-6v-8H5v-6h8z" /></svg></span><span>QRgence<span class="brand-dot">.</span></span></a><span class="privacy-pill"><span class="lock-icon">⌑</span> 100 % privé</span></header>
  <main><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-line"></span> PRÉVOIR, C'EST PROTÉGER</div><h1>En cas d'urgence,<br /><em>les bonnes infos.</em></h1><p class="hero-text">Une carte qui parle pour vous quand vous ne le pouvez pas. Vos informations sont dans le QR code, jamais sur nos serveurs.</p><div class="hero-points"><span><b class="check">✓</b> Sans compte</span><span><b class="check">✓</b> Sans stockage</span><span><b class="check">✓</b> Gratuite</span></div><a href="#creation" class="primary-button">Créer ma carte <span>↗</span></a><div class="hero-note"><span class="note-icon">✳</span> Prête en 2 minutes. À imprimer ou à garder dans votre portefeuille.</div></div><div class="hero-art"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="spark spark-a">✳</div><div class="spark spark-b">·</div><div class="card-shadow"></div><div class="sample-card"><div class="sample-top"><span>POCHE <i>·</i> CARTE D'URGENCE</span><span class="sample-plus">+</span></div><div class="sample-title">Je m'appelle</div><div class="sample-name">Alex Martin</div><div class="sample-line"></div><div class="sample-detail"><span>GROUPE SANGUIN</span><strong>A+</strong></div><div class="sample-qr"><span class="qr-demo">▦</span><span>Scannez<br />pour m'aider</span></div><div class="sample-bottom">SI JE NE PEUX PAS PARLER, SCANNEZ ICI</div></div><div class="art-caption"><span class="caption-dot"></span> Vos infos. Votre QR code. Point.</div></div></section>
  <section class="privacy-banner"><span class="privacy-symbol">⌑</span><div><strong>Vos données ne quittent jamais votre appareil.</strong><p>Tout est encodé dans votre QR code, directement dans votre navigateur. Rien n'est envoyé ni enregistré sur ce serveur.</p></div><span class="privacy-arrow">↓</span></section>
  <section class="creator" id="creation"><div class="section-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> VOTRE CARTE, VOS RÈGLES</div><h2>On s'en occupe <em>ensemble.</em></h2></div><div class="step-count"><span id="step-label">ÉTAPE 1 / 4</span><div class="step-progress"><i class="progress-fill" style="width:${state.step * 25}%"></i></div></div></div><div class="builder"><div class="form-panel"><div class="step-tabs">${['Identité', 'Santé', 'Contacts', 'Design'].map((tab, index) => `<button class="step-tab ${state.step === index + 1 ? 'active' : ''} ${state.step > index + 1 ? 'done' : ''}" data-step="${index + 1}"><span class="tab-number">${state.step > index + 1 ? '✓' : '0' + (index + 1)}</span><span>${tab}</span></button>`).join('')}</div><div class="form-content">${state.step === 1 ? `<div class="form-intro"><span class="form-icon">✳</span><div><h3>Qui êtes-vous ?</h3><p>Juste l'essentiel pour qu'on puisse vous identifier.</p></div></div><div class="form-grid">${input('Prénom et nom', 'name', 'Ex. Alex Martin')}<label class="field"><span>Groupe sanguin <small>facultatif</small></span><select data-key="blood"><option value="">Je ne sais pas</option>${['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(value => `<option ${state.blood === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>${input('Âge', 'age', 'Ex. 34', 'number')}</div><p class="gentle-note"><span>↳</span> Vous pouvez laisser les champs facultatifs vides.</p>` : ''}${state.step === 2 ? `<div class="form-intro"><span class="form-icon">✚</span><div><h3>Les infos santé utiles</h3><p>Ce qu'un secouriste devrait savoir. Rien de plus.</p></div></div><div class="form-grid single">${textarea('Allergies', 'allergies', 'Ex. pénicilline, arachides')}${textarea('Conditions médicales', 'conditions', 'Ex. asthme, diabète')}${textarea('Médicaments', 'medicines', 'Ex. Ventoline — dans mon sac')}${textarea('Autre information utile', 'notes', 'Une information qui pourrait aider')}</div><p class="gentle-note"><span>↳</span> Laissez vide ce que vous préférez ne pas partager.</p>` : ''}${state.step === 3 ? `<div class="form-intro"><span class="form-icon">♡</span><div><h3>Qui appeler ?</h3><p>Ajoutez au moins un numéro. Le premier sera visible sur la carte.</p></div></div><div class="contacts-list">${state.contacts.map(contactFields).join('')}</div><button class="add-contact" id="add-contact"><span>+</span> Ajouter un contact</button><div class="form-grid doctor-fields">${input('Médecin traitant', 'doctor', 'Ex. Dr. Bernard')}${input('Téléphone du médecin', 'doctorPhone', '06 12 34 56 78', 'tel')}</div>` : ''}${state.step === 4 ? `<div class="form-intro"><span class="form-icon">✳</span><div><h3>Un peu de vous.</h3><p>Choisissez une couleur pour votre carte.</p></div></div><div class="theme-options">${Object.entries(themes).map(([key, item]) => `<button data-theme="${key}" class="theme-option ${state.theme === key ? 'selected' : ''}"><span class="theme-swatch" style="--swatch:${item.bg}"></span>${item.label}<span class="theme-check">${state.theme === key ? '✓' : ''}</span></button>`).join('')}</div><div class="final-note"><span>⌑</span><div><strong>Petit rappel avant de créer</strong><p>Toute personne qui scanne votre carte peut lire ces infos. Partagez uniquement ce qui est utile en cas d'urgence.</p></div></div>` : ''}</div><div class="form-footer"><button class="back-button" id="back" ${state.step === 1 ? 'disabled' : ''}>← Retour</button><button class="next-button" id="next">${state.step === 4 ? 'Générer ma carte' : 'Continuer'} <span>→</span></button></div></div>
  <aside class="preview-panel"><div class="preview-top"><span>APERÇU EN DIRECT</span><span class="live-dot"></span></div><div class="preview-card" style="--card-bg:${theme.bg};--card-light:${theme.light};--card-ink:${theme.ink}"><div class="preview-card-top"><span>POCHE <i>·</i> CARTE D'URGENCE</span><span>+</span></div><div class="preview-label">Je m'appelle</div><div class="preview-name">${escapeHtml(state.name || 'Votre nom ici')}</div><div class="preview-divider"></div><div class="preview-info"><div><span>GROUPE SANGUIN</span><strong>${escapeHtml(state.blood || '—')}</strong></div><div class="preview-contact"><span>À PRÉVENIR</span><strong>${escapeHtml(state.contacts[0]?.name || 'Votre contact')}<br />${escapeHtml(state.contacts[0]?.phone || 'Son numéro')}</strong></div></div><div class="preview-qr-area">${state.qr ? `<img src="${state.qr}" alt="QR code de la carte" />` : `<div class="fake-qr">${Array.from({ length: 49 }, (_, i) => `<i class="${[0, 1, 2, 4, 5, 6, 7, 8, 13, 14, 20, 21, 27, 28, 34, 35, 40, 41, 42, 43, 45, 46, 47, 48].includes(i) ? 'dark' : ''}"></i>`).join('')}</div>`}<span>Scannez<br />pour m'aider</span></div><div class="preview-card-bottom">SI JE NE PEUX PAS PARLER, SCANNEZ ICI</div></div><div class="preview-foot"><span class="preview-lock">⌑</span><span>Le QR code est généré sur votre appareil.<br /><strong>Aucune donnée n'est transmise.</strong></span></div></aside></div></section>
  <section class="how-it-works"><div class="eyebrow"><span class="eyebrow-line"></span> SIMPLE COMME BONJOUR</div><h2>Trois étapes. <em>Pas de compte.</em></h2><div class="how-grid"><article><span class="how-number">01</span><span class="how-icon">✎</span><h3>Remplissez</h3><p>Ajoutez les infos qu'un proche ou un secouriste aurait besoin de connaître.</p></article><article><span class="how-number">02</span><span class="how-icon">▦</span><h3>Imprimez</h3><p>Téléchargez votre carte avec son QR code, prête à glisser dans votre portefeuille.</p></article><article><span class="how-number">03</span><span class="how-icon">♡</span><h3>Respirez</h3><p>En cas de besoin, un scan révèle les infos importantes. Nulle part ailleurs.</p></article></div></section>
  <footer><a class="brand footer-brand" href="#"><span class="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M13 5h6v8h8v6h-8v8h-6v-8H5v-6h8z" /></svg></span><span>QRgence<span class="brand-dot">.</span></span></a><span>Un peu de prévoyance. Beaucoup de tranquillité.</span><span>Vos données restent les vôtres.</span></footer></main>
  <div class="result-overlay ${resultVisible ? 'visible' : ''}" id="result" aria-hidden="${resultVisible ? 'false' : 'true'}"><div class="result-dialog"><button class="close-result" id="close-result" aria-label="Fermer">×</button><div class="result-mark">✓</div><div class="eyebrow"><span class="eyebrow-line"></span> C'EST PRÊT</div><h2>Votre carte est <em>prête.</em></h2><p>Votre QR code a été créé dans votre navigateur. Téléchargez ou imprimez votre carte maintenant.</p><div class="result-card" id="result-card"></div><div class="result-actions"><button class="next-button" id="print-card">Imprimer la carte <span>↗</span></button><button class="secondary-button" id="download-card">Télécharger en image</button></div><div class="result-security">⌑ Vos informations ne sont stockées nulle part. Gardez une copie de votre carte.</div></div></div>`
  bindEvents()
}

function bindEvents() {
  document.querySelectorAll('[data-key]').forEach(el => el.addEventListener('input', event => {
    state[event.target.dataset.key] = event.target.value
    state.qr = ''
    if (state.resultData) {
      state.resultData = null
      closeResult()
    }
    refreshPreview()
  }))
  document.querySelectorAll('[data-contact]').forEach(el => el.addEventListener('input', event => {
    state.contacts[Number(event.target.dataset.contact)][event.target.dataset.property] = event.target.value
    state.qr = ''
    if (state.resultData) {
      state.resultData = null
      closeResult()
    }
    refreshPreview()
  }))
  document.querySelectorAll('[data-step]').forEach(el => el.addEventListener('click', () => { state.step = Number(el.dataset.step); render() }))
  document.querySelectorAll('[data-theme]').forEach(el => el.addEventListener('click', () => { state.theme = el.dataset.theme; render() }))
  document.querySelectorAll('[data-remove]').forEach(el => el.addEventListener('click', () => { state.contacts.splice(Number(el.dataset.remove), 1); render() }))
  document.querySelector('#add-contact')?.addEventListener('click', () => { state.contacts.push({ name: '', relation: '', phone: '' }); render() })
  document.querySelector('#back').addEventListener('click', () => { if (state.step > 1) { state.step--; render() } })
  document.querySelector('#next').addEventListener('click', createCard)
  document.querySelector('#close-result').addEventListener('click', closeResult)
  document.querySelector('#result').addEventListener('click', event => { if (event.target.id === 'result') closeResult() })
  document.querySelector('#print-card').addEventListener('click', () => window.print())
  document.querySelector('#download-card').addEventListener('click', downloadCard)
}

function refreshPreview() {
  const name = document.querySelector('.preview-name')
  const blood = document.querySelector('.preview-info > div > strong')
  const contact = document.querySelector('.preview-contact strong')
  if (name) name.textContent = state.name || 'Votre nom ici'
  if (blood) blood.textContent = state.blood || '—'
  if (contact) contact.innerHTML = `${escapeHtml(state.contacts[0]?.name || 'Votre contact')}<br />${escapeHtml(state.contacts[0]?.phone || 'Son numéro')}`
}

async function createCard() {
  if (state.step < 4) {
    if (state.step === 3 && !state.contacts.some(contact => contact.phone.trim())) {
      const phone = document.querySelector('[data-contact="0"][data-property="phone"]')
      phone?.focus()
      phone?.setCustomValidity('Ajoutez au moins un numéro de téléphone.')
      phone?.reportValidity()
      phone?.addEventListener('input', () => phone.setCustomValidity(''), { once: true })
      return
    }
    state.step++
    render()
    return
  }
  if (!state.name.trim()) {
    state.step = 1
    render()
    const name = document.querySelector('[data-key="name"]')
    name?.setCustomValidity('Ajoutez votre prénom et votre nom.')
    name?.reportValidity()
    name?.addEventListener('input', () => name.setCustomValidity(''), { once: true })
    return
  }
  const cardData = {
    v: 1,
    n: state.name.trim(),
    a: state.age.trim() || undefined,
    b: state.blood || undefined,
    al: state.allergies.trim() || undefined,
    c: state.conditions.trim() || undefined,
    m: state.medicines.trim() || undefined,
    x: state.notes.trim() || undefined,
    e: state.contacts.filter(contact => contact.phone.trim()).map(contact => ({ n: contact.name.trim() || undefined, r: contact.relation.trim() || undefined, p: contact.phone.trim() })),
    d: state.doctor.trim() || undefined,
    dp: state.doctorPhone.trim() || undefined,
  }
  if (!cardData.e.length) {
    state.step = 3
    render()
    const phone = document.querySelector('[data-contact="0"][data-property="phone"]')
    phone?.setCustomValidity('Ajoutez au moins un numéro de téléphone.')
    phone?.reportValidity()
    phone?.addEventListener('input', () => phone.setCustomValidity(''), { once: true })
    return
  }
  const qrText = [
    'POCHE — CARTE D’URGENCE',
    `NOM : ${cardData.n}`,
    cardData.a ? `ÂGE : ${cardData.a} ans` : '',
    `GROUPE SANGUIN : ${cardData.b || 'non renseigné'}`,
    cardData.al ? `ALLERGIES : ${cardData.al}` : '',
    cardData.c ? `CONDITIONS : ${cardData.c}` : '',
    cardData.m ? `MÉDICAMENTS : ${cardData.m}` : '',
    cardData.x ? `AUTRE : ${cardData.x}` : '',
    ...cardData.e.map((contact, index) => `CONTACT ${index + 1} : ${[contact.n, contact.r].filter(Boolean).join(' — ')}${contact.p ? ` · ${contact.p}` : ''}`),
    cardData.d ? `MÉDECIN : ${cardData.d}${cardData.dp ? ` · ${cardData.dp}` : ''}` : '',
  ].filter(Boolean).join('\n')
  if (qrText.length > 1800) {
    window.alert('Les informations sont trop longues pour un QR code fiable. Raccourcissez les champs santé puis réessayez.')
    return
  }
  try {
    state.qr = await QRCode.toDataURL(qrText, { errorCorrectionLevel: 'M', margin: 2, width: 320, color: { dark: '#18261f', light: '#ffffff' } })
    state.resultData = cardData
    render()
    showResult(cardData)
  } catch {
    window.alert('Impossible de générer le QR code. Essayez de raccourcir les informations saisies.')
  }
}

function cardMarkup(data, large = false) {
  const theme = themes[state.theme]
  return `<div class="print-card ${large ? 'large-card' : ''}" style="--card-bg:${theme.bg};--card-light:${theme.light};--card-ink:${theme.ink}"><div class="print-card-head"><span>POCHE <i>·</i> CARTE D'URGENCE</span><span class="medical-cross">+</span></div><div class="print-card-label">En cas d'urgence, je m'appelle</div><div class="print-card-name">${escapeHtml(data.n)}</div><div class="print-card-rule"></div><div class="print-card-meta">${data.a ? `<span>${escapeHtml(data.a)} ans</span>` : ''}<span>Groupe sanguin <strong>${escapeHtml(data.b || 'Non renseigné')}</strong></span></div><div class="print-card-contact"><span>À PRÉVENIR</span><strong>${escapeHtml(data.e[0]?.n || 'Contact d’urgence')} ${data.e[0]?.r ? `· ${escapeHtml(data.e[0].r)}` : ''}</strong><b>${escapeHtml(data.e[0]?.p || '')}</b></div><div class="print-card-qr"><img src="${state.qr}" alt="QR code contenant les informations d'urgence" /><span>Scannez pour<br />les infos santé</span></div><div class="print-card-bottom">SI JE NE PEUX PAS PARLER, SCANNEZ ICI</div></div>`
}

function showResult(data) {
  state.resultData = data
  document.querySelector('#result-card').innerHTML = cardMarkup(data, true)
  document.querySelector('#result').classList.add('visible')
  document.querySelector('#result').setAttribute('aria-hidden', 'false')
}

function closeResult() {
  document.querySelector('#result').classList.remove('visible')
  document.querySelector('#result').setAttribute('aria-hidden', 'true')
}

async function downloadCard() {
  const theme = themes[state.theme]
  const data = {
    name: state.resultData.n,
    age: state.resultData.a,
    blood: state.resultData.b,
    contact: state.resultData.e[0] || { name: 'Contact d’urgence', phone: '' },
  }
  const image = new Image()
  image.src = state.qr
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = theme.ink
  ctx.font = '700 27px Arial'
  ctx.fillText('POCHE  ·  CARTE D’URGENCE', 64, 72)
  ctx.fillStyle = theme.light
  ctx.font = '500 27px Arial'
  ctx.fillText('En cas d’urgence, je m’appelle', 64, 166)
  ctx.fillStyle = '#fff'
  ctx.font = '700 67px Arial'
  ctx.fillText(data.name, 64, 245, 660)
  ctx.fillStyle = 'rgba(255,255,255,.35)'
  ctx.fillRect(64, 280, 872, 2)
  ctx.fillStyle = theme.ink
  ctx.font = '700 20px Arial'
  ctx.fillText('GROUPE SANGUIN', 64, 337)
  ctx.font = '700 45px Arial'
  ctx.fillText(data.blood || '—', 64, 392)
  ctx.font = '600 24px Arial'
  ctx.fillText(`À PRÉVENIR  ·  ${data.contact.name || 'Contact d’urgence'}`, 64, 462, 600)
  ctx.font = '500 24px Arial'
  ctx.fillText(data.contact.phone, 64, 502)
  ctx.drawImage(image, 742, 320, 184, 184)
  ctx.fillStyle = '#fff'
  ctx.font = '700 17px Arial'
  ctx.fillText('SI JE NE PEUX PAS PARLER, SCANNEZ ICI', 64, 580)
  const link = document.createElement('a')
  link.download = `carte-urgence-${data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

render()
