/**
 * Aahara Setu - Region-Based Communication Module
 * Seed Database & State Management
 */

const SEED_DATA = {
  districts: [
    {
      id: "DIST_HYD",
      name: "Hyderabad (హైదరాబాద్)",
      type: "URBAN",
      mandals: [
        {
          id: "MND_KHT",
          name: "Khairatabad",
          villages: [
            { id: "VIL_KHT_1", name: "Khairatabad Central", type: "URBAN", defaultFps: "FPS-101" },
            { id: "VIL_KHT_2", name: "Somajiguda Sector-3", type: "URBAN", defaultFps: "FPS-101" },
            { id: "VIL_KHT_3", name: "Panjagutta Colony", type: "URBAN", defaultFps: "FPS-101" }
          ]
        },
        {
          id: "MND_CHR",
          name: "Charminar",
          villages: [
            { id: "VIL_CHR_1", name: "Moghalpura North", type: "URBAN", defaultFps: "FPS-104" },
            { id: "VIL_CHR_2", name: "Shah Ali Banda", type: "URBAN", defaultFps: "FPS-104" }
          ]
        },
        {
          id: "MND_SEC",
          name: "Secunderabad",
          villages: [
            { id: "VIL_SEC_1", name: "Marredpally West", type: "URBAN", defaultFps: "FPS-107" },
            { id: "VIL_SEC_2", name: "Begumpet Circle", type: "URBAN", defaultFps: "FPS-107" }
          ]
        }
      ]
    },
    {
      id: "DIST_RNG",
      name: "Rangareddy (రంగారెడ్డి)",
      type: "MIXED",
      mandals: [
        {
          id: "MND_CHV",
          name: "Chevella",
          villages: [
            { id: "VIL_ALR", name: "Aloor Village (ఆలూర్ గ్రామం)", type: "RURAL", defaultFps: "FPS-102" },
            { id: "VIL_DMR", name: "Damaragidda (దామరగిద్ద)", type: "RURAL", defaultFps: "FPS-102" },
            { id: "VIL_CHV_C", name: "Chevella Town Center", type: "URBAN", defaultFps: "FPS-108" }
          ]
        },
        {
          id: "MND_IBP",
          name: "Ibrahimpatnam",
          villages: [
            { id: "VIL_PLK", name: "Polkampally (పోల్కంపల్లి)", type: "RURAL", defaultFps: "FPS-103" },
            { id: "VIL_PCH", name: "Pocharam Rural (పోచారం)", type: "RURAL", defaultFps: "FPS-103" },
            { id: "VIL_IBP_HQ", name: "Ibrahimpatnam Main Colony", type: "URBAN", defaultFps: "FPS-109" }
          ]
        },
        {
          id: "MND_SHM",
          name: "Shamshabad",
          villages: [
            { id: "VIL_SHM_V", name: "Nanakramguda Rural Zone", type: "RURAL", defaultFps: "FPS-110" },
            { id: "VIL_SHM_U", name: "Shamshabad Municipal Ward 2", type: "URBAN", defaultFps: "FPS-110" }
          ]
        }
      ]
    },
    {
      id: "DIST_NLG",
      name: "Nalgonda (నల్గొండ)",
      type: "RURAL",
      mandals: [
        {
          id: "MND_MRG",
          name: "Marriguda",
          villages: [
            { id: "VIL_MRG_1", name: "Marriguda Kendra (మర్రిగూడ)", type: "RURAL", defaultFps: "FPS-105" },
            { id: "VIL_KNGL", name: "Kanagal Grama (కనగల్)", type: "RURAL", defaultFps: "FPS-105" }
          ]
        },
        {
          id: "MND_CHND",
          name: "Chandur",
          villages: [
            { id: "VIL_CHND_1", name: "Chandur Tanda (చండూరు)", type: "RURAL", defaultFps: "FPS-112" },
            { id: "VIL_GATT", name: "Gattuppal Village (గట్టుప్పల్)", type: "RURAL", defaultFps: "FPS-112" }
          ]
        }
      ]
    },
    {
      id: "DIST_MED",
      name: "Medchal-Malkajgiri (మేడ్చల్-మల్కాజ్‌గిరి)",
      type: "MIXED",
      mandals: [
        {
          id: "MND_GTK",
          name: "Ghatkesar",
          villages: [
            { id: "VIL_GTK_R", name: "Kondapur Thanda Rural", type: "RURAL", defaultFps: "FPS-106" },
            { id: "VIL_GTK_U", name: "Ghatkesar Town Ward 4", type: "URBAN", defaultFps: "FPS-106" }
          ]
        },
        {
          id: "MND_UPP",
          name: "Uppal",
          villages: [
            { id: "VIL_UPP_1", name: "Uppal Ring Road Sector", type: "URBAN", defaultFps: "FPS-111" },
            { id: "VIL_UPP_2", name: "Nacharam Industrial Colony", type: "URBAN", defaultFps: "FPS-111" }
          ]
        }
      ]
    }
  ],

  fairPriceShops: [
    {
      id: "FPS-101",
      dealerName: "K. Satyanarayana (కె. సత్యనారాయణ)",
      phone: "9440112233",
      location: "Khairatabad Community Centre, Hyderabad",
      regionType: "URBAN",
      timings: "08:00 AM - 05:00 PM"
    },
    {
      id: "FPS-102",
      dealerName: "M. Ramulu (ఎం. రాములు)",
      phone: "9848055667",
      location: "Grama Panchayat Office Compound, Aloor, Chevella",
      regionType: "RURAL",
      timings: "08:00 AM - 06:30 PM"
    },
    {
      id: "FPS-103",
      dealerName: "P. Venkataiah (పి. వెంకటయ్య)",
      phone: "9866123456",
      location: "Zilla Parishad High School Road, Polkampally",
      regionType: "RURAL",
      timings: "08:00 AM - 06:00 PM"
    },
    {
      id: "FPS-104",
      dealerName: "Mohd. Azharuddin (మొహమ్మద్ అజారుద్దీన్)",
      phone: "9988776655",
      location: "Moghalpura Main Bazaar, Old City, Charminar",
      regionType: "URBAN",
      timings: "08:30 AM - 05:30 PM"
    },
    {
      id: "FPS-105",
      dealerName: "G. Narsimha (జి. నరసింహ)",
      phone: "9701239876",
      location: "Marriguda Chowrasta, Nalgonda",
      regionType: "RURAL",
      timings: "07:30 AM - 06:30 PM"
    },
    {
      id: "FPS-106",
      dealerName: "T. Malleshwar Rao (టి. మల్లేశ్వరరావు)",
      phone: "9490123456",
      location: "Ghatkesar Mandal Complex, Medchal",
      regionType: "RURAL",
      timings: "08:00 AM - 05:30 PM"
    },
    {
      id: "FPS-107",
      dealerName: "S. Anuradha (ఎస్. అనురాధ)",
      phone: "9849988776",
      location: "Marredpally Civil Supplies Depot, Secunderabad",
      regionType: "URBAN",
      timings: "08:00 AM - 05:00 PM"
    },
    {
      id: "FPS-108",
      dealerName: "B. Balraj (బి. బలరాజ్)",
      phone: "9618012345",
      location: "Chevella Town Bus Station Road",
      regionType: "URBAN",
      timings: "08:30 AM - 05:30 PM"
    },
    {
      id: "FPS-109",
      dealerName: "Ch. Laxma Reddy (సిహెచ్. లక్ష్మారెడ్డి)",
      phone: "9704512398",
      location: "Ibrahimpatnam Municipal Office Line",
      regionType: "URBAN",
      timings: "08:00 AM - 05:00 PM"
    },
    {
      id: "FPS-110",
      dealerName: "D. Srinivas (డి. శ్రీనివాస్)",
      phone: "9441199887",
      location: "Shamshabad Sub-Post Office Lane",
      regionType: "RURAL",
      timings: "08:00 AM - 06:00 PM"
    },
    {
      id: "FPS-111",
      dealerName: "R. Surekha (ఆర్. సురేఖ)",
      phone: "9848123789",
      location: "Uppal Depot No. 4, Hyderabad",
      regionType: "URBAN",
      timings: "08:00 AM - 05:00 PM"
    },
    {
      id: "FPS-112",
      dealerName: "K. Yadagiri (కె. యాదగిరి)",
      phone: "9959088776",
      location: "Chandur Rythu Vedika Complex",
      regionType: "RURAL",
      timings: "08:00 AM - 06:30 PM"
    }
  ],

  // 42 realistic beneficiaries seeded across Urban & Rural
  beneficiaries: [
    // --- URBAN HYDERABAD FPS-101 (Khairatabad) ---
    {
      id: "BEN-001",
      rationCardNumber: "WAP07190021001",
      name: "Ramesh Kumar Gupta",
      nameTe: "రమేష్ కుమార్ గుప్తా",
      mobile: "9848011221",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_KHT",
      villageId: "VIL_KHT_1",
      villageName: "Khairatabad Central",
      fpsNumber: "FPS-101",
      regionType: "URBAN",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-002",
      rationCardNumber: "WAP07190021002",
      name: "Fatima Begum",
      nameTe: "ఫాతిమా బేగం",
      mobile: "9848022334",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_KHT",
      villageId: "VIL_KHT_1",
      villageName: "Khairatabad Central",
      fpsNumber: "FPS-101",
      regionType: "URBAN",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "COMPLETED"
    },
    {
      id: "BEN-003",
      rationCardNumber: "WAP07190021003",
      name: "P. V. Sai Krishna",
      nameTe: "పి. వి. సాయి కృష్ణ",
      mobile: "9988112244",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_KHT",
      villageId: "VIL_KHT_2",
      villageName: "Somajiguda Sector-3",
      fpsNumber: "FPS-101",
      regionType: "URBAN",
      familyMembers: 3,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-12",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-004",
      rationCardNumber: "WAP07190021004",
      name: "Anand Raj Verma",
      nameTe: "ఆనంద్ రాజ్ వర్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_HYD",
      mandalId: "MND_KHT",
      villageId: "VIL_KHT_3",
      villageName: "Panjagutta Colony",
      fpsNumber: "FPS-101",
      regionType: "URBAN",
      familyMembers: 2,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 10, wheatKg: 2, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-12",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-005",
      rationCardNumber: "WAP07190021005",
      name: "Syed Abdul Rahman",
      nameTe: "సయ్యద్ అబ్దుల్ రెహమాన్",
      mobile: "9949112200",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_CHR",
      villageId: "VIL_CHR_1",
      villageName: "Moghalpura North",
      fpsNumber: "FPS-104",
      regionType: "URBAN",
      familyMembers: 6,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 30, wheatKg: 5, sugarKg: 2, dalKg: 2, oilLitre: 2 },
      slotName: "Slot 1",
      slotDate: "2026-10-13",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },

    // --- RURAL RANGAREDDY FPS-102 (Aloor Village, Chevella) ---
    // With Mobile:
    {
      id: "BEN-006",
      rationCardNumber: "WAP07190022001",
      name: "Gundla Balreddy",
      nameTe: "గుండ్ల బాలరెడ్డి",
      mobile: "9440556677",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "COMPLETED"
    },
    {
      id: "BEN-007",
      rationCardNumber: "WAP07190022002",
      name: "Lakshmi Narayana Reddy",
      nameTe: "లక్ష్మీ నారాయణ రెడ్డి",
      mobile: "9848123450",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-008",
      rationCardNumber: "WAP07190022003",
      name: "Banda Anjaneyulu",
      nameTe: "బండ ఆంజనేయులు",
      mobile: "9866099881",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-12",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-009",
      rationCardNumber: "WAP07190022004",
      name: "Chityala Sammaiah",
      nameTe: "చిత్యాల సమ్మయ్య",
      mobile: "9491223344",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-12",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "MISSED"
    },
    {
      id: "BEN-010",
      rationCardNumber: "WAP07190022005",
      name: "Kommula Pochamma",
      nameTe: "కొమ్ముల పోచమ్మ",
      mobile: "9618556611",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 2,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 3, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-12",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },

    // RURAL NO MOBILE (Aloor Village -> Added to Announcement List):
    {
      id: "BEN-011",
      rationCardNumber: "WAP07190022006",
      name: "Vaddepalli Mallamma",
      nameTe: "వడ్డేపల్లి మల్లమ్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 15, wheatKg: 3, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-012",
      rationCardNumber: "WAP07190022007",
      name: "Kotha Venkatamma",
      nameTe: "కొత్త వెంకటమ్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 2,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 2, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-12",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "COMPLETED"
    },
    {
      id: "BEN-013",
      rationCardNumber: "WAP07190022008",
      name: "Mangali Shankaraiah",
      nameTe: "మంగలి శంకరాయ్య",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-12",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-014",
      rationCardNumber: "WAP07190022009",
      name: "Chintakuntla Buchamma",
      nameTe: "చింతకుంట బుచ్చమ్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 1,
      cardCategory: "AAY (Single Elder)",
      commodities: { riceKg: 35, wheatKg: 2, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-12",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-015",
      rationCardNumber: "WAP07190022010",
      name: "Golconda Narasimhulu",
      nameTe: "గోల్కొండ నరసింహులు",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-12",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-016",
      rationCardNumber: "WAP07190022011",
      name: "Kurva Lingaiah",
      nameTe: "కుర్వ లింగయ్య",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 15, wheatKg: 3, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-12",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },

    // REALLOCATED BENEFICIARIES (Missed Slot 1 or 2 earlier -> Now assigned to Reallocated Slots)
    {
      id: "BEN-017",
      rationCardNumber: "WAP07190022012",
      name: "Durgam Sayamma",
      nameTe: "దుర్గం సాయమ్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Reallocated Slots",
      slotDate: "2026-10-12",
      slotTime: "05:00 PM - 06:30 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "REALLOCATED",
      reallocationReason: "Missed morning harvest window; rescheduled to evening catch-up slot"
    },
    {
      id: "BEN-018",
      rationCardNumber: "WAP07190022013",
      name: "Nimmala Yadagiri",
      nameTe: "నిమ్మల యాదగిరి",
      mobile: "9440889912",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_CHV",
      villageId: "VIL_ALR",
      villageName: "Aloor Village (ఆలూర్ గ్రామం)",
      fpsNumber: "FPS-102",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 15, wheatKg: 3, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Reallocated Slots",
      slotDate: "2026-10-12",
      slotTime: "05:00 PM - 06:30 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "REALLOCATED",
      reallocationReason: "Missed Slot 1 due to medical visit; SMS and call resent for catch-up slot"
    },

    // --- RURAL IBRAHIMPATNAM FPS-103 (Polkampally) ---
    {
      id: "BEN-019",
      rationCardNumber: "WAP07190023001",
      name: "Kethavath Chandu Naik",
      nameTe: "కేతావత్ చందు నాయక్",
      mobile: "9908123456",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_IBP",
      villageId: "VIL_PLK",
      villageName: "Polkampally (పోల్కంపల్లి)",
      fpsNumber: "FPS-103",
      regionType: "RURAL",
      familyMembers: 6,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 30, wheatKg: 5, sugarKg: 2, dalKg: 2, oilLitre: 2 },
      slotName: "Slot 1",
      slotDate: "2026-10-13",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-020",
      rationCardNumber: "WAP07190023002",
      name: "Mudavath Manjula",
      nameTe: "ముదావత్ మంజుల",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_IBP",
      villageId: "VIL_PLK",
      villageName: "Polkampally (పోల్కంపల్లి)",
      fpsNumber: "FPS-103",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-13",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-021",
      rationCardNumber: "WAP07190023003",
      name: "Nenavath Somla",
      nameTe: "నేనావత్ సోమ్లా",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_RNG",
      mandalId: "MND_IBP",
      villageId: "VIL_PLK",
      villageName: "Polkampally (పోల్కంపల్లి)",
      fpsNumber: "FPS-103",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 3, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-13",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-022",
      rationCardNumber: "WAP07190023004",
      name: "Bantu Ramulamma",
      nameTe: "బంటు రాములమ్మ",
      mobile: "9492887766",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_RNG",
      mandalId: "MND_IBP",
      villageId: "VIL_PLK",
      villageName: "Polkampally (పోల్కంపల్లి)",
      fpsNumber: "FPS-103",
      regionType: "RURAL",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-13",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "COMPLETED"
    },

    // --- RURAL NALGONDA FPS-105 (Marriguda) ---
    {
      id: "BEN-023",
      rationCardNumber: "WAP07190024001",
      name: "Alimineti Madhusudhan Rao",
      nameTe: "అలిమినేటి మధుసూధనరావు",
      mobile: "9848554433",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_NLG",
      mandalId: "MND_MRG",
      villageId: "VIL_MRG_1",
      villageName: "Marriguda Kendra (మర్రిగూడ)",
      fpsNumber: "FPS-105",
      regionType: "RURAL",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-14",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-024",
      rationCardNumber: "WAP07190024002",
      name: "Kondaveeti Gouramma",
      nameTe: "కొండవీటి గౌరమ్మ",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_NLG",
      mandalId: "MND_MRG",
      villageId: "VIL_MRG_1",
      villageName: "Marriguda Kendra (మర్రిగూడ)",
      fpsNumber: "FPS-105",
      regionType: "RURAL",
      familyMembers: 2,
      cardCategory: "AAY (Antyodaya)",
      commodities: { riceKg: 35, wheatKg: 2, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-14",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-025",
      rationCardNumber: "WAP07190024003",
      name: "Talla Mallikarjun",
      nameTe: "తాళ్ల మల్లికార్జున్",
      mobile: "",
      hasMobile: false,
      mobileStatus: "NO_MOBILE",
      districtId: "DIST_NLG",
      mandalId: "MND_MRG",
      villageId: "VIL_MRG_1",
      villageName: "Marriguda Kendra (మర్రిగూడ)",
      fpsNumber: "FPS-105",
      regionType: "RURAL",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-14",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "ANNOUNCEMENT_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-026",
      rationCardNumber: "WAP07190024004",
      name: "Pasupuleti Sailaja",
      nameTe: "పసుపులేటి శైలజ",
      mobile: "9490128765",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_NLG",
      mandalId: "MND_MRG",
      villageId: "VIL_MRG_1",
      villageName: "Marriguda Kendra (మర్రిగూడ)",
      fpsNumber: "FPS-105",
      regionType: "RURAL",
      familyMembers: 3,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 15, wheatKg: 3, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-14",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "SMS_SENT",
      callStatus: "VOICE_CALL_SENT",
      distributionStatus: "PENDING"
    },

    // --- ADDITIONAL URBAN BENEFICIARIES (Secunderabad / Uppal) ---
    {
      id: "BEN-027",
      rationCardNumber: "WAP07190025001",
      name: "Deepak Shinde",
      nameTe: "దీపక్ షిండే",
      mobile: "9849200112",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_SEC",
      villageId: "VIL_SEC_1",
      villageName: "Marredpally West",
      fpsNumber: "FPS-107",
      regionType: "URBAN",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 1",
      slotDate: "2026-10-15",
      slotTime: "08:00 AM - 10:30 AM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-028",
      rationCardNumber: "WAP07190025002",
      name: "V. Padmavathi",
      nameTe: "వి. పద్మావతి",
      mobile: "9959114422",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_MED",
      mandalId: "MND_UPP",
      villageId: "VIL_UPP_1",
      villageName: "Uppal Ring Road Sector",
      fpsNumber: "FPS-111",
      regionType: "URBAN",
      familyMembers: 5,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 25, wheatKg: 5, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-15",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-029",
      rationCardNumber: "WAP07190025003",
      name: "Mohammed Farhan",
      nameTe: "మొహమ్మద్ ఫర్హాన్",
      mobile: "9703445566",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_HYD",
      mandalId: "MND_CHR",
      villageId: "VIL_CHR_2",
      villageName: "Shah Ali Banda",
      fpsNumber: "FPS-104",
      regionType: "URBAN",
      familyMembers: 3,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 15, wheatKg: 3, sugarKg: 1, dalKg: 1, oilLitre: 1 },
      slotName: "Slot 2",
      slotDate: "2026-10-13",
      slotTime: "10:45 AM - 01:15 PM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    },
    {
      id: "BEN-030",
      rationCardNumber: "WAP07190025004",
      name: "K. Sunitha",
      nameTe: "కె. సునీత",
      mobile: "9866778899",
      hasMobile: true,
      mobileStatus: "MOBILE_AVAILABLE",
      districtId: "DIST_MED",
      mandalId: "MND_UPP",
      villageId: "VIL_UPP_2",
      villageName: "Nacharam Industrial Colony",
      fpsNumber: "FPS-111",
      regionType: "URBAN",
      familyMembers: 4,
      cardCategory: "PHH (White Card)",
      commodities: { riceKg: 20, wheatKg: 4, sugarKg: 1, dalKg: 2, oilLitre: 1 },
      slotName: "Slot 3",
      slotDate: "2026-10-15",
      slotTime: "02:00 PM - 04:30 PM",
      notificationStatus: "PORTAL_ACCESS_REQUIRED",
      distributionStatus: "PENDING"
    }
  ]
};

class StateManager {
  constructor() {
    this.STORAGE_KEY = 'aahara_setu_db_v1';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage load error, falling back to seed", e);
    }
    // Clone seed data
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  }

  resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(SEED_DATA));
    this.saveState();
    return this.state;
  }

  getDistricts() {
    return this.state.districts;
  }

  getDistrictById(id) {
    return this.state.districts.find(d => d.id === id);
  }

  getFairPriceShops() {
    return this.state.fairPriceShops;
  }

  getFpsById(id) {
    return this.state.fairPriceShops.find(f => f.id === id);
  }

  getBeneficiaries(filterFn = null) {
    if (filterFn) {
      return this.state.beneficiaries.filter(filterFn);
    }
    return this.state.beneficiaries;
  }

  getBeneficiaryByRationCard(cardNo) {
    if (!cardNo) return null;
    const cleanNo = cardNo.trim().toUpperCase();
    return this.state.beneficiaries.find(b => b.rationCardNumber.toUpperCase() === cleanNo);
  }

  updateBeneficiary(id, updates) {
    const idx = this.state.beneficiaries.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.state.beneficiaries[idx] = { ...this.state.beneficiaries[idx], ...updates };
      this.saveState();
      return this.state.beneficiaries[idx];
    }
    return null;
  }

  addBeneficiary(beneficiary) {
    this.state.beneficiaries.push(beneficiary);
    this.saveState();
    return beneficiary;
  }

  // Dashboard calculation engine
  computeCounters() {
    const list = this.state.beneficiaries;
    const total = list.length;
    const urban = list.filter(b => b.regionType === 'URBAN').length;
    const rural = list.filter(b => b.regionType === 'RURAL').length;
    const mobileAvailable = list.filter(b => b.hasMobile && b.mobile && b.mobile.trim().length > 0).length;
    const noMobile = total - mobileAvailable;

    // Rural + Mobile eligible for SMS and Voice
    const smsSent = list.filter(b => b.regionType === 'RURAL' && b.hasMobile && (b.notificationStatus === 'SMS_SENT' || b.notificationStatus === 'SMS_AND_VOICE_SENT')).length;
    const voiceCalls = list.filter(b => b.regionType === 'RURAL' && b.hasMobile && (b.callStatus === 'VOICE_CALL_SENT' || b.notificationStatus === 'SMS_AND_VOICE_SENT' || b.notificationStatus === 'SMS_SENT')).length;

    // Rural + No Mobile = Announcement Required
    const announcementListCount = list.filter(b => b.regionType === 'RURAL' && (!b.hasMobile || !b.mobile) && (b.notificationStatus === 'ANNOUNCEMENT_REQUIRED' || b.slotName === 'Reallocated Slots')).length;

    const completed = list.filter(b => b.distributionStatus === 'COMPLETED').length;
    const missed = list.filter(b => b.distributionStatus === 'MISSED').length;
    const reallocated = list.filter(b => b.distributionStatus === 'REALLOCATED' || b.slotName === 'Reallocated Slots').length;

    return {
      total,
      urban,
      rural,
      mobileAvailable,
      noMobile,
      smsSent,
      voiceCalls,
      announcementListCount,
      completed,
      missed,
      reallocated
    };
  }
  // FPS Stock inventory calculation based on allocated goods
  getFpsStockInventory(fpsId) {
    const bens = this.state.beneficiaries.filter(b => b.fpsNumber === fpsId);
    
    // Baseline stock buffers for the shop
    const inventory = {
      rice: { nameEn: "Fortified Rice", nameTe: "ఫోర్టిఫైడ్ బియ్యం", unit: "kg", total: 0, distributed: 0, remaining: 0 },
      wheat: { nameEn: "Whole Wheat", nameTe: "గోధుమలు", unit: "kg", total: 0, distributed: 0, remaining: 0 },
      sugar: { nameEn: "Refined Sugar", nameTe: "చక్కెర", unit: "kg", total: 0, distributed: 0, remaining: 0 },
      dal: { nameEn: "Red Gram Dal", nameTe: "కందిపప్పు", unit: "kg", total: 0, distributed: 0, remaining: 0 },
      oil: { nameEn: "Cooking Oil", nameTe: "వంట నూనె", unit: "L", total: 0, distributed: 0, remaining: 0 }
    };

    bens.forEach(b => {
      const isCollected = b.distributionStatus === 'COMPLETED';
      const c = b.commodities || {};

      if (c.riceKg) {
        inventory.rice.total += c.riceKg;
        if (isCollected) inventory.rice.distributed += c.riceKg;
      }
      if (c.wheatKg) {
        inventory.wheat.total += c.wheatKg;
        if (isCollected) inventory.wheat.distributed += c.wheatKg;
      }
      if (c.sugarKg) {
        inventory.sugar.total += c.sugarKg;
        if (isCollected) inventory.sugar.distributed += c.sugarKg;
      }
      if (c.dalKg) {
        inventory.dal.total += c.dalKg;
        if (isCollected) inventory.dal.distributed += c.dalKg;
      }
      if (c.oilLitre) {
        inventory.oil.total += c.oilLitre;
        if (isCollected) inventory.oil.distributed += c.oilLitre;
      }
    });

    // Provide baseline minimum display buffer if no beneficiaries yet
    Object.keys(inventory).forEach(k => {
      if (inventory[k].total === 0) {
        inventory[k].total = k === 'rice' ? 500 : k === 'wheat' ? 100 : k === 'sugar' ? 30 : k === 'dal' ? 50 : 30;
      }
      inventory[k].remaining = Math.max(0, inventory[k].total - inventory[k].distributed);
    });

    return inventory;
  }

  // Toggle user collection status: COMPLETED <-> PENDING
  toggleBeneficiaryCollection(id) {
    const ben = this.state.beneficiaries.find(b => b.id === id);
    if (!ben) return null;

    const newStatus = ben.distributionStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    ben.distributionStatus = newStatus;
    this.saveState();
    return ben;
  }

  // Check beneficiary by card and optional mobile
  getBeneficiaryByCardAndMobile(cardNo, mobileNo) {
    if (!cardNo) return null;
    const cleanCard = cardNo.trim().toUpperCase();
    const ben = this.state.beneficiaries.find(b => b.rationCardNumber.toUpperCase() === cleanCard);
    if (!ben) return null;

    if (mobileNo && mobileNo.trim()) {
      const cleanInput = mobileNo.trim().replace(/\D/g, '');
      const cleanBenMobile = (ben.mobile || '').replace(/\D/g, '');
      if (cleanBenMobile && cleanInput && cleanBenMobile !== cleanInput) {
        return { error: 'MOBILE_MISMATCH', beneficiary: ben };
      }
    }

    return { beneficiary: ben };
  }
}

// Global instance
window.aaharaDB = new StateManager();

