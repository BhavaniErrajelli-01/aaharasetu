/**
 * Aahara Setu - Minimal UI Controller
 * Handles Language Selection, Dealer & User Navigation, Slot Verification,
 * and Dealer Goods & Collection Status Tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.aaharaDB;
  const I18N = window.I18N;

  // State
  let currentLang = localStorage.getItem('aahara_lang') || 'te'; // default to Telugu
  let currentView = 'landing'; // 'landing', 'user', 'dealer'
  let selectedDistrictId = '';
  let selectedMandalId = '';
  let selectedVillageId = '';
  let selectedFpsId = '';
  let currentDealerFilter = 'ALL'; // 'ALL', 'COLLECTED', 'NOT_COLLECTED'

  // DOM Elements - Views
  const viewLanding = document.getElementById('view-landing');
  const viewUser = document.getElementById('view-user');
  const viewDealer = document.getElementById('view-dealer');

  // Brand / Home
  document.getElementById('brand-home-btn').addEventListener('click', () => switchView('landing'));

  // Single Language Dropdown (Either English or Telugu)
  const singleLangSelect = document.getElementById('single-lang-select');
  if (singleLangSelect) {
    singleLangSelect.value = currentLang;
    singleLangSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Role Navigation
  const btnNavDealer = document.getElementById('btn-nav-dealer');
  const btnNavUser = document.getElementById('btn-nav-user');
  const btnUserBack = document.getElementById('btn-user-back');
  const btnDealerBack = document.getElementById('btn-dealer-back');

  // User Flow Elements
  const formUserLookup = document.getElementById('form-user-lookup');
  const inputRationCard = document.getElementById('input-ration-card');
  const inputMobileNumber = document.getElementById('input-mobile-number');
  const userSlotResultArea = document.getElementById('user-slot-result-area');

  // Dealer Flow Elements
  const selectDistrict = document.getElementById('select-district');
  const selectMandal = document.getElementById('select-mandal');
  const selectVillage = document.getElementById('select-village');
  const selectFps = document.getElementById('select-fps');
  const goodsInventoryContainer = document.getElementById('goods-inventory-container');
  const dealerUsersTbody = document.getElementById('dealer-users-tbody');
  const badgeSelectedFpsName = document.getElementById('badge-selected-fps-name');
  const userStatusCountSummary = document.getElementById('user-status-count-summary');

  // Filter Buttons
  const btnFilterAll = document.getElementById('btn-filter-all');
  const btnFilterCollected = document.getElementById('btn-filter-collected');
  const btnFilterNotCollected = document.getElementById('btn-filter-not-collected');

  // =================================================================
  // 1. Language Controller & String Localizer
  // =================================================================
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('aahara_lang', lang);

    document.documentElement.lang = lang;
    if (singleLangSelect) singleLangSelect.value = lang;

    applyTranslations();

    // Re-render user result if active
    if (currentView === 'user' && inputRationCard.value.trim()) {
      handleUserSlotLookup(false);
    }

    // Re-render dealer goods and table if active
    if (currentView === 'dealer' && selectFps.value) {
      renderDealerGoodsAndUsers();
    }
  }

  function t(key) {
    const dict = I18N[currentLang] || I18N.te;
    return dict[key] || key;
  }

  function applyTranslations() {
    const dict = I18N[currentLang];

    // Landing Page
    setText('lbl-select-lang', currentLang === 'te' ? 'భాషను ఎంచుకోండి / Select Language' : 'Select Language / భాషను ఎంచుకోండి');
    setText('lbl-select-role', currentLang === 'te' ? 'మీ విభాగాన్ని ఎంచుకోండి / Select Your Role' : 'Select Your Role / మీ విభాగాన్ని ఎంచుకోండి');
    setText('txt-role-dealer', currentLang === 'te' ? 'డీలర్ (Dealer)' : 'Dealer (డీలర్)');
    setText('txt-role-dealer-desc', dict.dealerBtnDesc);
    setText('txt-role-user', currentLang === 'te' ? 'వినియోగదారు (User)' : 'User (వినియోగదారు)');
    setText('txt-role-user-desc', dict.userBtnDesc);

    // User Flow
    setText('txt-user-back-label', dict.backHome);
    setText('txt-user-form-title', dict.userTitle);
    setText('txt-user-form-desc', dict.userDesc);
    setText('lbl-ration-card', dict.rationCardLabel);
    inputRationCard.placeholder = dict.rationCardPlaceholder;
    setText('lbl-mobile-number', dict.mobileLabel);
    inputMobileNumber.placeholder = dict.mobilePlaceholder;
    setText('txt-btn-check-slot', dict.checkSlotBtn);
    setText('lbl-quick-chips', dict.quickDemoLabel);

    // Dealer Flow
    setText('txt-dealer-back-label', dict.backHome);
    setText('txt-dealer-dash-title', dict.dealerTitle);
    setText('txt-dealer-dash-desc', dict.dealerDesc);
    setText('lbl-dealer-district', dict.districtLabel);
    setText('lbl-dealer-mandal', dict.mandalLabel);
    setText('lbl-dealer-village', dict.villageLabel);
    setText('lbl-dealer-fps', dict.fpsLabel);
    setText('txt-goods-stock-title', dict.stockTitle);
    setText('txt-user-collection-title', dict.userStatusTitle);

    // Filter Buttons
    setText('btn-filter-all', dict.allUsers);
    setText('btn-filter-collected', dict.collectedUsers);
    setText('btn-filter-not-collected', dict.notCollectedUsers);

    // Table Headers
    setText('th-index', dict.userTableIndex);
    setText('th-name', dict.userTableName);
    setText('th-card', dict.userTableCard);
    setText('th-mobile', dict.userTableMobile);
    setText('th-slot', dict.userTableSlot);
    setText('th-keypad', dict.userTableKeypad || (currentLang === 'te' ? 'కీప్యాడ్ ఫోన్ అలర్ట్‌లు (SMS & కాల్)' : 'Keypad Alerts (SMS & Call)'));
    setText('th-goods', dict.userTableGoods);
    setText('th-status', dict.userTableStatus);
    setText('th-action', dict.userTableAction);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  btnLangTe.addEventListener('click', () => setLanguage('te'));
  btnLangEn.addEventListener('click', () => setLanguage('en'));

  // =================================================================
  // 2. Navigation Router
  // =================================================================
  function switchView(viewName) {
    currentView = viewName;
    viewLanding.classList.toggle('active', viewName === 'landing');
    viewUser.classList.toggle('active', viewName === 'user');
    viewDealer.classList.toggle('active', viewName === 'dealer');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'dealer') {
      initDealerDropdowns();
    }
  }

  btnNavDealer.addEventListener('click', () => switchView('dealer'));
  btnNavUser.addEventListener('click', () => switchView('user'));
  btnUserBack.addEventListener('click', () => switchView('landing'));
  btnDealerBack.addEventListener('click', () => switchView('landing'));

  // =================================================================
  // 3. User Flow: Ask Card & Mobile -> Display Allocated Slot
  // =================================================================
  formUserLookup.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserSlotLookup(true);
  });

  // Quick Demo Chips
  document.querySelectorAll('.demo-btn-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      inputRationCard.value = chip.dataset.card;
      inputMobileNumber.value = chip.dataset.mobile || '';
      handleUserSlotLookup(true);
    });
  });

  function handleUserSlotLookup(shouldScroll = true) {
    const card = inputRationCard.value.trim();
    const mobile = inputMobileNumber.value.trim();

    if (!card) {
      alert(t('errorEnterCard'));
      return;
    }

    const ben = db.getBeneficiaryByRationCard(card);
    if (!ben) {
      userSlotResultArea.innerHTML = `
        <div class="clean-card" style="border: 2px solid #fecdd3; background: #fff1f2; text-align: center; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
          <h3 style="color: #9f1239; margin-bottom: 0.4rem;">${t('errorCardNotFound')}</h3>
          <p style="color: #be123c; font-size: 0.88rem;">${card}</p>
        </div>
      `;
      if (shouldScroll) userSlotResultArea.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Match FPS info
    const fps = db.getFpsById(ben.fpsNumber) || {
      id: ben.fpsNumber,
      dealerName: "Government Authorized Dealer",
      location: "Designated Mandal PDS Center",
      timings: "08:00 AM - 05:00 PM"
    };

    renderUserSlotResult(ben, fps);
    if (shouldScroll) userSlotResultArea.scrollIntoView({ behavior: 'smooth' });
  }

  function renderUserSlotResult(ben, fps) {
    const isTe = currentLang === 'te';
    const isCollected = ben.distributionStatus === 'COMPLETED';

    // Commodity rows (Rice price set to zero)
    const c = ben.commodities || { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 };
    const items = [
      { name: isTe ? "ఫోర్టిఫైడ్ బియ్యం" : "Fortified Rice", qty: `${c.riceKg || 20} kg`, rate: isTe ? "₹0.00/కిలో (ఉచితం)" : "₹0.00/kg (Free)", cost: "₹0.00" },
      { name: isTe ? "గోధుమలు" : "Whole Wheat", qty: `${c.wheatKg || 4} kg`, rate: "₹2.00/kg", cost: `₹${((c.wheatKg || 4) * 2.0).toFixed(2)}` },
      { name: isTe ? "చక్కెర" : "Refined Sugar", qty: `${c.sugarKg || 1} kg`, rate: "₹13.50/kg", cost: `₹${((c.sugarKg || 1) * 13.5).toFixed(2)}` },
      { name: isTe ? "కందిపప్పు" : "Red Gram Dal", qty: `${c.dalKg || 2} kg`, rate: "₹30.00/kg", cost: `₹${((c.dalKg || 2) * 30.0).toFixed(2)}` },
      { name: isTe ? "వంట నూనె" : "Cooking Oil", qty: `${c.oilLitre || 1} L`, rate: "₹25.00/L", cost: `₹${((c.oilLitre || 1) * 25.0).toFixed(2)}` }
    ];

    const totalCost = items.reduce((sum, item) => sum + (parseFloat(item.cost.replace('₹', '')) || 0), 0);

    const displayName = isTe && ben.nameTe ? ben.nameTe : ben.name;
    const statusText = isCollected ? t('statusCollected') : t('statusNotCollected');
    const statusMsg = isCollected ? t('statusCollectedMsg') : t('statusNotCollectedMsg');

    userSlotResultArea.innerHTML = `
      <div class="slot-result-card" id="assigned-slot-details-card">
        <!-- Display ONLY 'Government of Telangana' at top -->
        <div class="slot-result-header" style="text-align: center; justify-content: center; border-bottom: 2px solid var(--primary-600); padding: 1.25rem 1rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 700; color: var(--navy-900); margin: 0;">
            ${isTe ? 'తెలంగాణ ప్రభుత్వం' : 'Government of Telangana'}
          </h3>
        </div>

        <div class="slot-result-body" style="padding: 1.5rem;">
          
          <!-- Key Slot Info -->
          <div class="slot-key-info-grid">
            <div class="slot-info-item">
              <span class="slot-info-label">${t('beneficiaryName')}</span>
              <span class="slot-info-value">${displayName}</span>
              <span style="font-size: 0.76rem; color: #64748b;">${ben.mobile ? '📱 ' + ben.mobile : (isTe ? 'మొబైల్ లేదు' : 'No Mobile')}</span>
            </div>

            <div class="slot-info-item">
              <span class="slot-info-label">${t('allocatedDate')}</span>
              <span class="slot-info-value highlight-time">📅 ${ben.slotDate || '2026-10-12'}</span>
              <span style="font-size: 0.76rem; color: #64748b;">${isTe ? 'పంపిణీ రోజు' : 'Distribution Day'}</span>
            </div>

            <div class="slot-info-item">
              <span class="slot-info-label">${t('allocatedTime')}</span>
              <span class="slot-info-value highlight-time">⏰ ${ben.slotTime || '08:00 AM - 10:30 AM'}</span>
              <span style="font-size: 0.76rem; color: #64748b;">${ben.slotName || 'Slot 1'}</span>
            </div>

            <div class="slot-info-item">
              <span class="slot-info-label">${t('fpsNameLabel')}</span>
              <span class="slot-info-value">🏪 ${fps.id}</span>
              <span style="font-size: 0.76rem; color: #64748b;">${fps.dealerName} &bull; ${fps.location}</span>
            </div>
          </div>

          <!-- Collection Status Notice -->
          <div class="collection-status-callout ${isCollected ? 'collected' : 'not-collected'}">
            <div style="font-size: 1.5rem;">${isCollected ? '✅' : '📢'}</div>
            <div style="flex: 1;">
              <strong>${t('collectionStatusLabel')}: ${statusText}</strong>
              <div style="font-size: 0.84rem; margin-top: 0.15rem;">${statusMsg}</div>
            </div>
          </div>

          <!-- Keypad Phone Multimodal Alert Banner -->
          <div class="keypad-portal-alert-card ${ben.mobile ? '' : 'announcement-style'}" style="margin-top: 1.25rem;">
            <div class="keypad-portal-header">
              <div class="keypad-portal-icon">${ben.mobile ? '📱' : '📢'}</div>
              <div>
                <h4 class="keypad-portal-title">
                  ${ben.mobile 
                    ? (isTe ? 'సాధారణ కీప్యాడ్ ఫోన్ సేవ (SMS & వాయిస్ కాల్ పంపబడింది)' : 'Keypad Phone Alert Service (SMS & Voice Call Dispatched)')
                    : (isTe ? 'గ్రామ పంచాయతీ చాటింపు సేవ (ఫోన్ లేని వారికి)' : 'Gram Panchayat Broadcast Service (No Mobile)')
                  }
                </h4>
                <p class="keypad-portal-desc">
                  ${ben.mobile 
                    ? (isTe 
                        ? `స్మార్ట్‌ఫోన్లు లేదా ఇంటర్నెట్ లేని వినియోగదారుల కోసం: మీ నమోదిత మొబైల్ సంఖ్య (<strong>${ben.mobile}</strong>) కు స్లాట్ కేటాయింపు వివరాలతో ద్విభాషా SMS మరియు ఆటోమేటెడ్ వాయిస్ కాల్ పంపబడ్డాయి.` 
                        : `For citizens using basic keypad phones without smartphones: Automated bilingual SMS and voice IVR calls have been dispatched to your phone (<strong>${ben.mobile}</strong>).`)
                    : (isTe 
                        ? 'మీ రేషన్ కార్డుకు మొబైల్ ఫోన్ నమోదు కానందున, మీ స్లాట్ వివరాలు గ్రామ పంచాయతీ లావుడ్‌స్పీకర్ చాటింపు మరియు నోటీస్ బోర్డు జాబితాలో చేర్చబడ్డాయి.'
                        : 'Since no mobile is registered, your slot details are published in the village loudspeaker announcement roster.')
                  }
                </p>
              </div>
            </div>
            ${ben.mobile ? `
              <div class="keypad-portal-box">
                <div class="keypad-portal-sms">
                  <span class="sms-title-badge">💬 ${isTe ? 'ద్విభాషా SMS' : 'Bilingual SMS'}</span>
                  <div class="sms-quote">"${isTe ? `ఆహార సేతు: ప్రియమైన ${displayName} గారు, మీ రేషన్ స్లాట్ ${ben.slotDate || '2026-10-12'} (${ben.slotTime || '08:00 AM - 10:30 AM'}) న ${fps.id} వద్ద కేటాయించబడింది. కార్డు: ${ben.rationCardNumber}.` : `Aahara Setu PDS: Dear ${displayName}, your ration collection slot at ${fps.id} is booked for ${ben.slotDate || '2026-10-12'} (${ben.slotTime || '08:00 AM - 10:30 AM'}). Card: ${ben.rationCardNumber}.`}"</div>
                </div>
                <div class="keypad-portal-voice">
                  <span class="voice-title-badge">📞 ${isTe ? 'ఆటోమేటెడ్ వాయిస్ కాల్ (IVR)' : 'Automated Voice Call (IVR)'}</span>
                  <div class="voice-quote">"${isTe ? `నమస్కారం ${displayName} గారు. ఇది ఆహార సేతు ప్రజా పంపిణీ శాఖ నుండి స్వయంచాలక వాయిస్ కాల్. మీ రేషన్ స్లాట్ ${ben.slotDate || '2026-10-12'} న ${fps.id} వద్ద కేటాయించబడింది.` : `Hello ${displayName}. This is an automated voice call from Aahara Setu Food Civil Supplies. Your ration distribution slot has been reserved at Fair Price Shop ${fps.id} on ${ben.slotDate || '2026-10-12'}.`}"</div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Goods Details with Quantity -->
          <div style="margin-top: 1.5rem;">
            <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--navy-900);">
              🛒 ${t('goodsDetailsTitle')}
            </h4>
            <div style="overflow-x: auto;">
              <table class="goods-table">
                <thead>
                  <tr>
                    <th>${t('commodity')}</th>
                    <th>${t('quantity')}</th>
                    <th>${t('subsidizedPrice')}</th>
                    <th>${isTe ? 'మొత్తం' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(it => `
                    <tr>
                      <td><strong>${it.name}</strong></td>
                      <td><span class="badge-status badge-collected">${it.qty}</span></td>
                      <td><span style="${it.rate.includes('0.00') ? 'color: var(--primary-700); font-weight: 700;' : ''}">${it.rate}</span></td>
                      <td><strong style="${it.cost === '₹0.00' ? 'color: var(--primary-700);' : ''}">${it.cost}</strong></td>
                    </tr>
                  `).join('')}
                  <tr style="background: #f8fafc; font-weight: 700;">
                    <td colspan="3" style="text-align: right; padding-right: 1.5rem;">${t('totalPayable')}:</td>
                    <td style="color: var(--primary-700); font-size: 1.1rem;">₹${totalCost.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sign Out at the bottom of the Check Assigned Slot Details section -->
          <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: center;">
            <button type="button" class="btn-back" id="btn-citizen-signout" onclick="window.location.reload()" style="background: #ffffff; border: 1px solid #fca5a5; color: #b91c1c; padding: 0.65rem 1.8rem; border-radius: 9999px; font-weight: 600; cursor: pointer;">
              🚪 ${isTe ? 'నిష్క్రమించండి (Sign Out)' : 'Sign Out'}
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // =================================================================
  // 4. Dealer Flow: Dropdowns, Goods Details & Collection Status
  // =================================================================
  function initDealerDropdowns() {
    const districts = db.getDistricts();

    // 1. Populate District
    selectDistrict.innerHTML = `<option value="">${t('selectDistrict')}</option>`;
    districts.forEach(d => {
      selectDistrict.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });

    // Populate FPS Shops
    populateFpsDropdown();

    // Default Selection: Rangareddy -> Chevella -> Aloor Village (FPS-102)
    selectedDistrictId = 'DIST_RNG';
    selectDistrict.value = 'DIST_RNG';
    updateMandals('DIST_RNG');

    selectedMandalId = 'MND_CHV';
    selectMandal.value = 'MND_CHV';
    updateVillages('DIST_RNG', 'MND_CHV');

    selectedVillageId = 'VIL_ALR';
    selectVillage.value = 'VIL_ALR';

    selectedFpsId = 'FPS-102';
    selectFps.value = 'FPS-102';

    renderDealerGoodsAndUsers();
  }

  function updateMandals(distId) {
    selectMandal.innerHTML = `<option value="">${t('selectMandal')}</option>`;
    selectVillage.innerHTML = `<option value="">${t('selectVillage')}</option>`;

    if (!distId) return;
    const dist = db.getDistrictById(distId);
    if (dist && dist.mandals) {
      dist.mandals.forEach(m => {
        selectMandal.innerHTML += `<option value="${m.id}">${m.name}</option>`;
      });
    }
  }

  function updateVillages(distId, mandId) {
    selectVillage.innerHTML = `<option value="">${t('selectVillage')}</option>`;
    if (!distId || !mandId) return;

    const dist = db.getDistrictById(distId);
    if (dist) {
      const m = dist.mandals.find(item => item.id === mandId);
      if (m && m.villages) {
        m.villages.forEach(v => {
          selectVillage.innerHTML += `<option value="${v.id}" data-fps="${v.defaultFps}">${v.name}</option>`;
        });
      }
    }
  }

  function populateFpsDropdown() {
    const shops = db.getFairPriceShops();
    selectFps.innerHTML = `<option value="">${t('selectFps')}</option>`;
    shops.forEach(s => {
      selectFps.innerHTML += `<option value="${s.id}">${s.id} - ${s.dealerName} (${s.location})</option>`;
    });
  }

  // Dropdowns Change Listeners
  selectDistrict.addEventListener('change', (e) => {
    selectedDistrictId = e.target.value;
    updateMandals(e.target.value);
  });

  selectMandal.addEventListener('change', (e) => {
    selectedMandalId = e.target.value;
    updateVillages(selectedDistrictId, e.target.value);
  });

  selectVillage.addEventListener('change', (e) => {
    selectedVillageId = e.target.value;
    const opt = e.target.selectedOptions[0];
    if (opt && opt.dataset.fps) {
      selectFps.value = opt.dataset.fps;
      selectedFpsId = opt.dataset.fps;
      renderDealerGoodsAndUsers();
    }
  });

  selectFps.addEventListener('change', (e) => {
    selectedFpsId = e.target.value;
    renderDealerGoodsAndUsers();
  });

  // Filter Buttons Listeners
  btnFilterAll.addEventListener('click', () => setDealerFilter('ALL'));
  btnFilterCollected.addEventListener('click', () => setDealerFilter('COLLECTED'));
  btnFilterNotCollected.addEventListener('click', () => setDealerFilter('NOT_COLLECTED'));

  function setDealerFilter(filterType) {
    currentDealerFilter = filterType;
    btnFilterAll.classList.toggle('active', filterType === 'ALL');
    btnFilterCollected.classList.toggle('active', filterType === 'COLLECTED');
    btnFilterNotCollected.classList.toggle('active', filterType === 'NOT_COLLECTED');
    renderDealerUsersTable();
  }

  // Render Goods Stock & Users for Selected FPS
  function renderDealerGoodsAndUsers() {
    const fpsId = selectFps.value;
    if (!fpsId) {
      goodsInventoryContainer.innerHTML = `<div style="color: #64748b; font-size: 0.88rem;">${t('errorSelectShop')}</div>`;
      dealerUsersTbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b;">${t('errorSelectShop')}</td></tr>`;
      return;
    }

    const fpsInfo = db.getFpsById(fpsId);
    badgeSelectedFpsName.textContent = fpsInfo ? `${fpsInfo.id} - ${fpsInfo.dealerName}` : fpsId;

    // 1. Render Goods Details with Quantity
    renderGoodsStockInventory(fpsId);

    // 2. Render Keypad Phone Multimodal Communication KPI Cards
    renderDealerCommKpis(fpsId);

    // 3. Render User Collection Status
    renderDealerUsersTable();
  }

  function renderDealerCommKpis(fpsId) {
    const isTe = currentLang === 'te';
    const commContainer = document.getElementById('dealer-comm-kpi-container');
    if (!commContainer) return;

    const allUsers = db.getBeneficiaries(b => b.fpsNumber === fpsId);
    const keypadUsers = allUsers.filter(b => b.mobile && b.mobile.trim().length === 10).length;
    const noMobileUsers = allUsers.length - keypadUsers;
    const smsCount = keypadUsers * 2;
    const voiceCount = keypadUsers * 2;

    commContainer.innerHTML = `
      <div class="comm-kpi-box box-blue">
        <div class="comm-kpi-icon">📟</div>
        <div class="comm-kpi-data">
          <div class="comm-kpi-val">${keypadUsers}</div>
          <div class="comm-kpi-label">${isTe ? 'కీప్యాడ్ ఫోన్ వినియోగదారులు' : 'Keypad Phone Users'}</div>
          <small class="comm-kpi-sub">${isTe ? 'స్మార్ట్‌ఫోన్ లేని సాధారణ ఫోన్లు' : 'Basic phones without smartphone'}</small>
        </div>
      </div>

      <div class="comm-kpi-box box-emerald">
        <div class="comm-kpi-icon">💬</div>
        <div class="comm-kpi-data">
          <div class="comm-kpi-val">${smsCount}</div>
          <div class="comm-kpi-label">${isTe ? 'ద్విభాషా SMS పంపబడ్డాయి' : 'Bilingual SMS Dispatched'}</div>
          <small class="comm-kpi-sub">${isTe ? 'తెలుగు & English టెక్స్ట్ మెసేజ్‌లు' : 'Telugu & English text alerts'}</small>
        </div>
      </div>

      <div class="comm-kpi-box box-purple">
        <div class="comm-kpi-icon">📞</div>
        <div class="comm-kpi-data">
          <div class="comm-kpi-val">${voiceCount}</div>
          <div class="comm-kpi-label">${isTe ? 'ఆటోమేటెడ్ వాయిస్ కాల్స్' : 'Automated Voice IVR Calls'}</div>
          <small class="comm-kpi-sub">${isTe ? 'కీప్యాడ్ ఫోన్లకు నేరుగా కాల్స్' : 'Automated phone broadcasts'}</small>
        </div>
      </div>

      <div class="comm-kpi-box box-amber">
        <div class="comm-kpi-icon">📢</div>
        <div class="comm-kpi-data">
          <div class="comm-kpi-val">${noMobileUsers}</div>
          <div class="comm-kpi-label">${isTe ? 'గ్రామ చాటింపు జాబితా' : 'Village Announcements'}</div>
          <small class="comm-kpi-sub">${isTe ? 'మొబైల్ లేని వారి కోసం చాటింపు' : 'Loudspeaker roster for no-phone'}</small>
          <div style="margin-top: 0.5rem;">
            <button type="button" class="btn-kpi-announcement-link" onclick="openIndexAnnouncementModal('${fpsId}')" style="cursor: pointer; border: none;">
              📢 ${isTe ? 'చాటింపు జాబితా &amp; ప్రింట్' : 'View &amp; Print Speaker List'} &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderGoodsStockInventory(fpsId) {
    const isTe = currentLang === 'te';
    const inventory = db.getFpsStockInventory(fpsId);

    goodsInventoryContainer.innerHTML = '';

    const commodities = [
      { key: 'rice', icon: '🌾', ...inventory.rice },
      { key: 'wheat', icon: '🌾', ...inventory.wheat },
      { key: 'sugar', icon: '🍬', ...inventory.sugar },
      { key: 'dal', icon: '🍲', ...inventory.dal },
      { key: 'oil', icon: '🫒', ...inventory.oil }
    ];

    commodities.forEach(c => {
      const name = isTe ? c.nameTe : c.nameEn;
      const card = document.createElement('div');
      card.className = 'goods-stock-card';
      card.innerHTML = `
        <div>
          <div class="commodity-name-header">
            ${c.icon} ${name}
          </div>
          <div class="commodity-total-qty">
            ${c.total} <span style="font-size: 0.95rem; font-weight: 600; color: #64748b;">${c.unit}</span>
          </div>
        </div>
        <div class="commodity-sub-counts">
          <span style="color: #047857;"><strong>${c.distributed} ${c.unit}</strong> ${isTe ? 'సేకరించారు' : 'Collected'}</span>
          <span style="color: #b45309;"><strong>${c.remaining} ${c.unit}</strong> ${isTe ? 'మిగిలింది' : 'Remaining'}</span>
        </div>
      `;
      goodsInventoryContainer.appendChild(card);
    });
  }

  function renderDealerUsersTable() {
    const fpsId = selectFps.value;
    const isTe = currentLang === 'te';
    let users = db.getBeneficiaries(b => b.fpsNumber === fpsId);

    // Count statistics
    const totalCount = users.length;
    const collectedCount = users.filter(b => b.distributionStatus === 'COMPLETED').length;
    const notCollectedCount = totalCount - collectedCount;

    userStatusCountSummary.innerHTML = `
      ${isTe ? 'మొత్తం' : 'Total'}: <strong>${totalCount}</strong> | 
      <span style="color: #047857;">${isTe ? 'సేకరించిన వారు' : 'Collected'}: <strong>${collectedCount}</strong></span> | 
      <span style="color: #b45309;">${isTe ? 'సేకరించని వారు' : 'Not Collected'}: <strong>${notCollectedCount}</strong></span>
    `;

    // Filter
    if (currentDealerFilter === 'COLLECTED') {
      users = users.filter(b => b.distributionStatus === 'COMPLETED');
    } else if (currentDealerFilter === 'NOT_COLLECTED') {
      users = users.filter(b => b.distributionStatus !== 'COMPLETED');
    }

    dealerUsersTbody.innerHTML = '';

    if (users.length === 0) {
      dealerUsersTbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 2rem; color: #64748b;">
            ${t('noRecords')}
          </td>
        </tr>
      `;
      return;
    }

    users.forEach((b, idx) => {
      const isCollected = b.distributionStatus === 'COMPLETED';
      const name = isTe && b.nameTe ? b.nameTe : b.name;
      const c = b.commodities || {};
      const goodsSummary = `${c.riceKg || 20}kg Rice, ${c.wheatKg || 4}kg Wheat, ${c.sugarKg || 1}kg Sugar`;

      const statusBadge = isCollected
        ? `<span class="badge-status badge-collected">✅ ${t('statusCollected')}</span>`
        : `<span class="badge-status badge-not-collected">⏳ ${t('statusNotCollected')}</span>`;

      const actionBtnText = isCollected ? t('markNotCollected') : t('markCollected');

      const keypadCell = b.mobile ? `
        <div class="keypad-cell-content">
          <div class="keypad-channel-tags">
            <span class="tag-sms">💬 SMS</span>
            <span class="tag-call">📞 కాల్</span>
          </div>
          <div class="keypad-status-ok">
            <span class="dot-green"></span>
            <small>${isTe ? 'డెలివరీ అయింది' : 'Delivered'}</small>
          </div>
          <button type="button" class="btn-inspect-alert" onclick="openIndexKeypadModal('${b.id}')" title="View SMS and Listen to Voice Call">
            👁️ ${isTe ? 'చూడండి & వినండి' : 'View & Listen'}
          </button>
        </div>
      ` : `
        <div class="keypad-cell-content">
          <span class="tag-announcement">📢 ${isTe ? 'గ్రామ చాటింపు' : 'Village Broadcast'}</span>
          <small class="text-muted">${isTe ? 'చాటింపు జాబితాలో ఉంది' : 'In Loudspeaker Roster'}</small>
        </div>
      `;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>
          <strong>${name}</strong>
          <div style="font-size: 0.74rem; color: #64748b;">${b.nameTe && !isTe ? b.nameTe : ''}</div>
        </td>
        <td><code>${b.rationCardNumber}</code></td>
        <td>${b.mobile ? '<span class="phone-num-pill">📱 ' + b.mobile + '</span>' : `<span class="no-phone-pill">${isTe ? 'ఫోన్ లేదు' : 'No Mobile'}</span>`}</td>
        <td>
          <div style="font-weight: 600;">${b.slotName || 'Slot 1'}</div>
          <div style="font-size: 0.74rem; color: #64748b;">${b.slotDate || '2026-10-12'} (${b.slotTime || '08:00 AM - 10:30 AM'})</div>
        </td>
        <td>${keypadCell}</td>
        <td><small>${goodsSummary}</small></td>
        <td>${statusBadge}</td>
        <td>
          <button type="button" class="btn-toggle-status" onclick="handleToggleCollection('${b.id}')">
            ${isCollected ? '↩️ ' : '✅ '} ${actionBtnText}
          </button>
        </td>
      `;
      dealerUsersTbody.appendChild(tr);
    });
  }

  // Global handler for toggling collection status
  window.handleToggleCollection = (id) => {
    const updated = db.toggleBeneficiaryCollection(id);
    if (updated) {
      renderDealerGoodsAndUsers();
      showToast(t('statusUpdatedToast'));
    }
  };

  // Keypad Alert Modal & Speech for index.html
  let currentIdxBen = null;
  let isIdxSpeechPlaying = false;
  let activeIdxUtterance = null;

  window.openIndexKeypadModal = (id) => {
    const ben = db.getBeneficiaries().find(b => b.id === id);
    if (!ben) return;
    currentIdxBen = ben;
    const isTe = currentLang === 'te';
    const displayName = isTe && ben.nameTe ? ben.nameTe : ben.name;
    const fps = db.getFpsById(ben.fpsNumber) || { id: ben.fpsNumber };

    document.getElementById('idx-modal-ben-name').textContent = displayName + (ben.villageName ? ` (${ben.villageName})` : '');
    document.getElementById('idx-modal-card-no').textContent = ben.rationCardNumber;
    document.getElementById('idx-modal-mobile-no').textContent = ben.mobile || 'No Mobile';
    document.getElementById('idx-modal-slot-time').textContent = `${ben.slotDate || '2026-10-12'} (${ben.slotTime || '08:00 AM - 10:30 AM'})`;

    const smsTe = `ఆహార సేతు: ప్రియమైన ${ben.nameTe || ben.name} గారు, మీ రేషన్ స్లాట్ ${ben.slotDate || '2026-10-12'} (${ben.slotTime || '08:00 AM - 10:30 AM'}) న ${fps.id} వద్ద కేటాయించబడింది. కార్డు: ${ben.rationCardNumber}.`;
    const smsEn = `Aahara Setu PDS: Dear ${ben.name}, your ration collection slot at ${fps.id} is booked for ${ben.slotDate || '2026-10-12'} (${ben.slotTime || '08:00 AM - 10:30 AM'}). Card: ${ben.rationCardNumber}.`;
    const voiceTe = `నమస్కారం ${ben.nameTe || ben.name} గారు. ఇది ఆహార సేతు ప్రజా పంపిణీ శాఖ నుండి స్వయంచాలక వాయిస్ కాల్. మీ రేషన్ సేకరణ స్లాట్ ${ben.slotDate || '2026-10-12'} న ${fps.id} దుకాణంలో కేటాయించబడింది. దయచేసి మీ రేషన్ కార్డు తీసుకురండి.`;
    const voiceEn = `Hello ${ben.name}. This is an automated voice call from Aahara Setu Food Civil Supplies. Your ration distribution slot has been reserved at Fair Price Shop ${fps.id} on ${ben.slotDate || '2026-10-12'}. Please bring your Ration Card ${ben.rationCardNumber}.`;

    currentIdxBen.smsTe = smsTe;
    currentIdxBen.smsEn = smsEn;
    currentIdxBen.voiceTe = voiceTe;
    currentIdxBen.voiceEn = voiceEn;

    document.getElementById('idx-modal-sms-te').textContent = smsTe;
    document.getElementById('idx-modal-sms-en').textContent = smsEn;
    document.getElementById('idx-modal-voice-te').textContent = voiceTe;
    document.getElementById('idx-modal-voice-en').textContent = voiceEn;

    stopIndexVoiceSpeech();
    document.getElementById('index-keypad-modal').style.display = 'flex';
  };

  window.closeIndexKeypadModal = (e) => {
    if (e && e.target && e.target !== document.getElementById('index-keypad-modal') && !e.target.classList.contains('btn-modal-close') && !e.target.classList.contains('btn-modal-dismiss')) {
      return;
    }
    stopIndexVoiceSpeech();
    document.getElementById('index-keypad-modal').style.display = 'none';
  };

  window.toggleIndexPlayVoiceCall = () => {
    if (isIdxSpeechPlaying) {
      stopIndexVoiceSpeech();
    } else {
      startIndexVoiceSpeech();
    }
  };

  window.onIndexVoiceLangChange = () => {
    if (isIdxSpeechPlaying) {
      stopIndexVoiceSpeech();
      startIndexVoiceSpeech();
    }
  };

  function startIndexVoiceSpeech() {
    if (!('speechSynthesis' in window) || !currentIdxBen) {
      showToast('Web Speech API is not supported in this browser.');
      return;
    }

    const lang = document.getElementById('idx-select-voice-lang').value;
    const textToSpeak = lang === 'te' ? (currentIdxBen.voiceTe || '') : (currentIdxBen.voiceEn || '');

    window.speechSynthesis.cancel();
    activeIdxUtterance = new SpeechSynthesisUtterance(textToSpeak);
    activeIdxUtterance.lang = lang === 'te' ? 'te-IN' : 'en-IN';
    activeIdxUtterance.rate = 0.95;

    activeIdxUtterance.onstart = () => {
      isIdxSpeechPlaying = true;
      document.getElementById('idx-speech-icon').textContent = '⏹️';
      document.getElementById('idx-speech-label').textContent = 'ఆపండి (Stop Voice Call)';
      document.getElementById('idx-speech-wave-box').style.display = 'inline-flex';
    };

    activeIdxUtterance.onend = () => {
      stopIndexVoiceSpeech();
    };

    activeIdxUtterance.onerror = () => {
      stopIndexVoiceSpeech();
    };

    window.speechSynthesis.speak(activeIdxUtterance);
  }

  function stopIndexVoiceSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isIdxSpeechPlaying = false;
    const icon = document.getElementById('idx-speech-icon');
    const label = document.getElementById('idx-speech-label');
    const wave = document.getElementById('idx-speech-wave-box');
    if (icon) icon.textContent = '🔊';
    if (label) label.textContent = 'వాయిస్ కాల్ వినండి (Play Voice Call)';
    if (wave) wave.style.display = 'none';
  }

  window.resendIndexKeypadAlert = () => {
    if (!currentIdxBen) return;
    showToast('✓ SMS మరియు ఆటోమేటెడ్ వాయిస్ కాల్ విజయవంతంగా తిరిగి పంపబడ్డాయి! (Alert Dispatched to ' + (currentIdxBen.mobile || '') + ')');
  };

  // Gram Panchayat Speaker Announcement Modal Controller
  window.openIndexAnnouncementModal = (fpsId) => {
    const isTe = currentLang === 'te';
    const allUsers = db.getBeneficiaries(b => b.fpsNumber === fpsId);
    const noMobileUsers = allUsers.filter(b => !b.mobile || b.mobile.trim().length !== 10 || b.mobileStatus === 'NO_MOBILE');
    const fpsInfo = db.getFpsById(fpsId) || { dealerName: 'Government Authorized Dealer', village: 'Village' };

    const modalBody = document.getElementById('idx-announcement-modal-body');
    if (!modalBody) return;

    let rowsHtml = '';
    noMobileUsers.forEach((b, idx) => {
      rowsHtml += `
        <tr>
          <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
          <td><strong style="font-family: monospace; color: #1e3a8a;">${b.rationCardNumber}</strong></td>
          <td><strong>${b.name}</strong> <span class="no-mob-tag">🚫 ${isTe ? 'మొబైల్ లేదు' : 'No Mobile'}</span></td>
          <td>${b.villageName || 'Village'}</td>
          <td>${b.slotDate || '2026-10-12'} &bull; ${b.slotTime || '08:00 AM - 10:30 AM'}</td>
          <td style="text-align: center;">${b.riceRequiredKg || 20} kg <small style="color: #16a34a;">(${isTe ? 'ఉచితం' : 'Free'})</small></td>
          <td style="height: 32px;"><div class="sign-dotted-placeholder"></div></td>
        </tr>
      `;
    });

    if (noMobileUsers.length === 0) {
      rowsHtml = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">${isTe ? 'మొబైల్ లేని లబ్ధిదారులు లేరు.' : 'No beneficiaries without mobile found for this shop.'}</td></tr>`;
    }

    modalBody.innerHTML = `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
        <div><span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">FPS:</span> <strong>${fpsId}</strong></div>
        <div><span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Dealer:</span> <strong>${fpsInfo.dealerName}</strong></div>
        <div><span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Location:</span> <strong>${fpsInfo.village || 'Habitation'}</strong></div>
        <div><span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">No Mobile Count:</span> <strong style="color: #0284c7;">${noMobileUsers.length} Citizens</strong></div>
      </div>

      <div class="announcer-bulletin-card" style="margin-bottom: 1rem;">
        <div class="bulletin-header">
          <span>📢 <strong>${isTe ? 'గ్రామ పంచాయతీ లౌడ్‌స్పీకర్ మైక్ చాటింపు స్క్రిప్ట్' : 'Official Loudspeaker Announcement Script'}</strong></span>
        </div>
        <div class="bulletin-text-box">
          <p style="font-weight: 600; color: #713f12;">
            "గ్రామ ప్రజలకు ముఖ్య గమనిక: మన గ్రామ పంచాయతీ పరిధిలోని రేషన్ కార్డుదారులలో మొబైల్ ఫోన్ లేని లబ్ధిదారులకు తెలియజేయడమైనది. ఆహార సేతు ప్రజా పంపిణీ పథకం క్రింద మీ రేషన్ సరుకుల పంపిణీ స్లాట్ కేటాయించబడింది. రేషన్ దుకాణం నంబర్: ${fpsId}. కింది రేషన్ కార్డు నంబర్లు కలిగిన లబ్ధిదారులు తమకు కేటాయించిన నిర్ణీత తేదీ మరియు సమయాల్లో రేషన్ దుకాణానికి వచ్చి తమ ఉచిత బియ్యం మరియు నిత్యావసర సరుకులను సేకరించుకోవలసిందిగా కోరడమైనది."
          </p>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="roster-table" style="width: 100%;">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>రేషన్ కార్డు (Ration Card)</th>
              <th>లబ్ధిదారుని పేరు (Name)</th>
              <th>గ్రామం (Village)</th>
              <th>కేటాయించిన సమయం (Slot Time)</th>
              <th>బియ్యం (Rice Quota)</th>
              <th style="width: 120px;">సంతకం / వేలిముద్ర</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div class="roster-signatures-block" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid #0f172a;">
        <div class="sign-column"><div class="sign-line"></div><strong>సర్పంచ్</strong><small>Gram Panchayat</small></div>
        <div class="sign-column"><div class="sign-line"></div><strong>కార్యదర్శి</strong><small>Secretary</small></div>
        <div class="sign-column"><div class="sign-line"></div><strong>డీలర్</strong><small>${fpsId}</small></div>
        <div class="sign-column"><div class="sign-line"></div><strong>మైక్ చాటింపుదారుడు</strong><small>PA Announcer</small></div>
      </div>
    `;

    document.getElementById('index-announcement-modal').style.display = 'flex';
  };

  window.closeIndexAnnouncementModal = (e) => {
    if (e && e.target && e.target !== document.getElementById('index-announcement-modal') && !e.target.classList.contains('btn-modal-close') && !e.target.classList.contains('btn-modal-dismiss')) {
      return;
    }
    document.getElementById('index-announcement-modal').style.display = 'none';
  };

  // Toast
  function showToast(msg) {
    const wrapper = document.getElementById('toast-wrapper');
    const toast = document.createElement('div');
    toast.className = 'minimal-toast';
    toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
    wrapper.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 250ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  // Initialize
  setLanguage(currentLang);
  switchView('landing');
});
