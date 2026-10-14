/**
 * Aahara Setu - Bilingual Translation Dictionary
 * English and Telugu text strings for Minimal UI
 */

const I18N = {
  en: {
    // Header
    brandTitle: "Aahara Setu",
    brandSubtitle: "Public Distribution System",
    
    // Landing Page
    selectLanguage: "Select Language",
    selectRole: "Select Your Role",
    dealerBtn: "Dealer",
    dealerBtnDesc: "Fair Price Shop Management",
    userBtn: "User",
    userBtnDesc: "Check Allocated Ration Slot",
    
    // Navigation
    backHome: "Back to Home",
    back: "Back",

    // User Flow
    userTitle: "Citizen Slot Verification",
    userDesc: "Enter your Ration Card Number and Registered Mobile Number to view your allocated slot details.",
    rationCardLabel: "Ration Card Number",
    rationCardPlaceholder: "Enter Ration Card Number",
    mobileLabel: "Registered Mobile Number",
    mobilePlaceholder: "Enter Registered Mobile Number",
    checkSlotBtn: "Check Allocated Slot",
    quickDemoLabel: "Quick Demo Cards:",
    demo1: "Ramesh Kumar (FPS-101)",
    demo2: "Fatima Begum (FPS-101)",
    demo3: "G. Balreddy (FPS-102)",
    demo4: "V. Mallamma (FPS-102)",

    // Slot Result
    slotDetailsTitle: "Your Allocated Ration Slot",
    beneficiaryName: "Beneficiary Name",
    cardCategory: "Card Type",
    fpsNameLabel: "Fair Price Shop (FPS)",
    dealerNameLabel: "Dealer Name",
    locationLabel: "Shop Location",
    allocatedDate: "Allocated Date",
    allocatedTime: "Allocated Time Slot",
    collectionStatusLabel: "Collection Status",
    statusCollected: "Collected",
    statusNotCollected: "Not Collected",
    statusCollectedMsg: "Ration commodities have already been collected for this month.",
    statusNotCollectedMsg: "Please visit your Fair Price Shop during your allocated slot time to collect ration.",
    goodsDetailsTitle: "Allocated Goods & Quantity",
    commodity: "Commodity",
    quantity: "Allotted Quantity",
    subsidizedPrice: "Subsidized Price",
    rice: "Fortified Rice",
    wheat: "Whole Wheat",
    sugar: "Refined Sugar",
    dal: "Red Gram Dal",
    oil: "Cooking Oil",
    totalPayable: "Estimated Subsidized Payable",
    checkAnotherBtn: "Check Another Card",

    // Dealer Flow
    dealerTitle: "Dealer Dashboard",
    dealerDesc: "Select your jurisdiction to manage stock and view beneficiary collection status.",
    selectDistrict: "-- Select District --",
    selectMandal: "-- Select Mandal --",
    selectVillage: "-- Select Village / Region --",
    selectFps: "-- Select Fair Price Shop --",
    districtLabel: "District",
    mandalLabel: "Mandal",
    villageLabel: "Village / Region",
    fpsLabel: "Fair Price Shop Name",
    
    // Dealer Stock & Inventory
    stockTitle: "Goods Details & Available Quantity",
    totalStockAvailable: "Total FPS Stock",
    distributedStock: "Distributed",
    remainingStock: "In Stock",
    
    // Dealer Collection Status
    userStatusTitle: "User Collection Status",
    allUsers: "All Users",
    collectedUsers: "Collected",
    notCollectedUsers: "Not Collected",
    searchPlaceholder: "Search by Name or Card Number...",
    userTableIndex: "Sl No",
    userTableName: "Beneficiary Name",
    userTableCard: "Ration Card",
    userTableMobile: "Mobile",
    userTableSlot: "Allocated Slot",
    userTableKeypad: "Keypad Alerts (SMS & Call)",
    userTableGoods: "Allotted Goods",
    userTableStatus: "Collection Status",
    userTableAction: "Action",
    markCollected: "Mark as Collected",
    markNotCollected: "Mark as Not Collected",
    noRecords: "No beneficiaries found for this Fair Price Shop.",
    
    // Alerts & Errors
    errorCardNotFound: "Ration Card not found. Please verify the card number.",
    errorEnterCard: "Please enter your Ration Card Number.",
    errorSelectShop: "Please select a Fair Price Shop to view goods details and collection status.",
    statusUpdatedToast: "Collection status updated successfully."
  },

  te: {
    // Header
    brandTitle: "ఆహార సేతు",
    brandSubtitle: "ప్రజా పంపిణీ వ్యవస్థ",

    // Landing Page
    selectLanguage: "భాషను ఎంచుకోండి",
    selectRole: "మీ విభాగాన్ని ఎంచుకోండి",
    dealerBtn: "డీలర్",
    dealerBtnDesc: "రేషన్ దుకాణ నిర్వహణ",
    userBtn: "వినియోగదారు",
    userBtnDesc: "కేటాయించిన స్లాట్ వివరాలు చూడండి",

    // Navigation
    backHome: "హోమ్‌కు వెళ్లండి",
    back: "వెనుకకు",

    // User Flow
    userTitle: "పౌర స్లాట్ ధృవీకరణ",
    userDesc: "మీకు కేటాయించిన స్లాట్ వివరాలు చూడటానికి మీ రేషన్ కార్డు సంఖ్య మరియు నమోదిత మొబైల్ సంఖ్యను నమోదు చేయండి.",
    rationCardLabel: "రేషన్ కార్డు సంఖ్య",
    rationCardPlaceholder: "రేషన్ కార్డు సంఖ్యను నమోదు చేయండి",
    mobileLabel: "నమోదిత మొబైల్ సంఖ్య",
    mobilePlaceholder: "నమోదిత మొబైల్ సంఖ్యను నమోదు చేయండి",
    checkSlotBtn: "కేటాయించిన స్లాట్ వివరాలు చూడండి",
    quickDemoLabel: "నమూనా కార్డులు:",
    demo1: "రమేష్ కుమార్ (FPS-101)",
    demo2: "ఫాతిమా బేగం (FPS-101)",
    demo3: "జి. బాలరెడ్డి (FPS-102)",
    demo4: "వి. మల్లమ్మ (FPS-102)",

    // Slot Result
    slotDetailsTitle: "మీకు కేటాయించిన రేషన్ స్లాట్ వివరాలు",
    beneficiaryName: "లబ్ధిదారుని పేరు",
    cardCategory: "కార్డు రకం",
    fpsNameLabel: "రేషన్ దుకాణం (FPS)",
    dealerNameLabel: "డీలర్ పేరు",
    locationLabel: "దుకాణం చిరునామా",
    allocatedDate: "కేటాయించిన తేదీ",
    allocatedTime: "కేటాయించిన సమయం / స్లాట్",
    collectionStatusLabel: "రేషన్ సేకరణ స్థితి",
    statusCollected: "సేకరించబడింది",
    statusNotCollected: "ఇంకా సేకరించలేదు",
    statusCollectedMsg: "ఈ నెల కోటా రేషన్ సరుకులు ఇప్పటికే సేకరించబడ్డాయి.",
    statusNotCollectedMsg: "దయచేసి మీకు కేటాయించిన సమయంలో మీ రేషన్ దుకాణాన్ని సందర్శించి సరుకులు సేకరించండి.",
    goodsDetailsTitle: "కేటాయించిన సరుకుల వివరాలు & పరిమాణం",
    commodity: "సరుకు పేరు",
    quantity: "కేటాయించిన పరిమాణం",
    subsidizedPrice: "రాయితీ ధర",
    rice: "ఫోర్టిఫైడ్ బియ్యం",
    wheat: "గోధుమలు",
    sugar: "చక్కెర",
    dal: "కందిపప్పు",
    oil: "వంట నూనె",
    totalPayable: "చెల్లించవలసిన రాయితీ మొత్తం",
    checkAnotherBtn: "మరొక కార్డు చూడండి",

    // Dealer Flow
    dealerTitle: "డీలర్ డాష్‌బోర్డ్",
    dealerDesc: "సరుకుల నిల్వ మరియు లబ్ధిదారుల సేకరణ స్థితిని చూడటానికి మీ ప్రాంతాన్ని ఎంచుకోండి.",
    selectDistrict: "-- జిల్లాను ఎంచుకోండి --",
    selectMandal: "-- మండలాన్ని ఎంచుకోండి --",
    selectVillage: "-- గ్రామం / ప్రాంతాన్ని ఎంచుకోండి --",
    selectFps: "-- రేషన్ దుకాణం పేరును ఎంచుకోండి --",
    districtLabel: "జిల్లా",
    mandalLabel: "మండలం",
    villageLabel: "గ్రామం / ప్రాంతం",
    fpsLabel: "రేషన్ దుకాణం పేరు (FPS)",

    // Dealer Stock & Inventory
    stockTitle: "సరుకుల వివరాలు & లభ్యత పరిమాణం",
    totalStockAvailable: "మొత్తం నిల్వ",
    distributedStock: "పంపిణీ చేసినది",
    remainingStock: "మిగిలిన నిల్వ",

    // Dealer Collection Status
    userStatusTitle: "లబ్ధిదారుల సేకరణ స్థితి (ఎవరు తీసుకున్నారు, ఎవరు తీసుకోలేదు)",
    allUsers: "అందరూ",
    collectedUsers: "సేకరించిన వారు",
    notCollectedUsers: "సేకరించని వారు",
    searchPlaceholder: "పేరు లేదా కార్డు సంఖ్య ద్వారా వెతకండి...",
    userTableIndex: "వరుస సంఖ్య",
    userTableName: "లబ్ధిదారుని పేరు",
    userTableCard: "రేషన్ కార్డు సంఖ్య",
    userTableMobile: "మొబైల్",
    userTableSlot: "కేటాయించిన స్లాట్",
    userTableKeypad: "కీప్యాడ్ ఫోన్ అలర్ట్‌లు (SMS & కాల్)",
    userTableGoods: "కేటాయించిన సరుకులు",
    userTableStatus: "సేకరణ స్థితి",
    userTableAction: "చర్య",
    markCollected: "సేకరించినట్లు గుర్తించండి",
    markNotCollected: "సేకరించనట్లు గుర్తించండి",
    noRecords: "ఈ రేషన్ దుకాణానికి లబ్ధిదారుల రికార్డులు కనిపించలేదు.",

    // Alerts & Errors
    errorCardNotFound: "రేషన్ కార్డు కనుగొనబడలేదు. దయచేసి కార్డు సంఖ్యను సరిచూడండి.",
    errorEnterCard: "దయచేసి మీ రేషన్ కార్డు సంఖ్యను నమోదు చేయండి.",
    errorSelectShop: "దయచేసి సరుకుల వివరాలు మరియు సేకరణ స్థితి చూడటానికి రేషన్ దుకాణాన్ని ఎంచుకోండి.",
    statusUpdatedToast: "సేకరణ స్థితి విజయవంతంగా నవీకరించబడింది."
  }
};

window.I18N = I18N;
