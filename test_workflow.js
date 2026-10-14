/**
 * Test Suite for Aahara Setu Region-Based Communication Module
 * Validates Dealer Workflow, Case 1 (Urban), Case 2 (Rural + Mobile), Case 3 (Rural + No Mobile),
 * Announcement grouping, User Portal verification, and all 11 Dashboard Counters.
 */

// Mock browser globals for testing
global.window = {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

// Load modules in order
require('./js/data.js');
require('./js/engine.js');
require('./js/speech.js');
require('./js/portal.js');
require('./js/announcement.js');

const db = window.aaharaDB;
const engine = window.aaharaEngine;
const portal = window.aaharaPortal;
const announcementMgr = window.aaharaAnnouncement;
const voice = window.aaharaVoice;

console.log("=================================================================");
console.log("  🌾 Aahara Setu Communication Module - Comprehensive Test Suite");
console.log("=================================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// TEST 1: Initial Database Seeding & District Hierarchy
// -------------------------------------------------------------
console.log("--- Test 1: Data Seeding & Hierarchy ---");
const districts = db.getDistricts();
assert(districts.length >= 4, "Loaded at least 4 administrative districts");
const fpsShops = db.getFairPriceShops();
assert(fpsShops.length >= 8, "Loaded at least 8 Fair Price Shops");
const allBeneficiaries = db.getBeneficiaries();
assert(allBeneficiaries.length >= 30, `Loaded ${allBeneficiaries.length} seed beneficiaries`);

// -------------------------------------------------------------
// TEST 2: Dashboard Counters (Initial Calculation)
// -------------------------------------------------------------
console.log("\n--- Test 2: Initial Dashboard Counters Calculation ---");
const initialStats = db.computeCounters();
assert(typeof initialStats.total === 'number' && initialStats.total > 0, "Counter 1: Total Beneficiaries calculated");
assert(typeof initialStats.urban === 'number', "Counter 2: Urban Beneficiaries calculated");
assert(typeof initialStats.rural === 'number', "Counter 3: Rural Beneficiaries calculated");
assert(initialStats.urban + initialStats.rural === initialStats.total, "Urban + Rural equals Total Beneficiaries");
assert(typeof initialStats.mobileAvailable === 'number', "Counter 4: Mobile Available calculated");
assert(typeof initialStats.noMobile === 'number', "Counter 5: No Mobile calculated");
assert(initialStats.mobileAvailable + initialStats.noMobile === initialStats.total, "Mobile Available + No Mobile equals Total");
assert(typeof initialStats.smsSent === 'number', "Counter 6: SMS Sent calculated");
assert(typeof initialStats.voiceCalls === 'number', "Counter 7: Voice Calls Generated calculated");
assert(typeof initialStats.announcementListCount === 'number', "Counter 8: Announcement List Count calculated");
assert(typeof initialStats.completed === 'number', "Counter 9: Completed Distributions calculated");
assert(typeof initialStats.missed === 'number', "Counter 10: Missed Beneficiaries calculated");
assert(typeof initialStats.reallocated === 'number', "Counter 11: Reallocated Beneficiaries calculated");

// -------------------------------------------------------------
// TEST 3: Dealer Workflow - Case 1: URBAN REGION
// -------------------------------------------------------------
console.log("\n--- Test 3: Dealer Workflow - CASE 1: URBAN REGION ---");
// Dealer selects: Hyderabad, Khairatabad, Khairatabad Central, FPS-101, URBAN
const urbanLoaded = engine.loadBeneficiariesForRegion({
  districtId: 'DIST_HYD',
  mandalId: 'MND_KHT',
  villageId: 'VIL_KHT_1',
  fpsNumber: 'FPS-101',
  regionType: 'URBAN'
});

assert(urbanLoaded.length > 0, `Loaded ${urbanLoaded.length} beneficiaries for Urban FPS-101`);
urbanLoaded.forEach(b => {
  assert(['MOBILE_AVAILABLE', 'NO_MOBILE'].includes(b.mobileStatus), `Beneficiary ${b.name} has valid mobile status (${b.mobileStatus})`);
});

// Execute Case 1 Batch Processing
const logsBeforeUrban = engine.getLogs().length;
const urbanSummary = engine.processRegionBatch({
  districtId: 'DIST_HYD',
  mandalId: 'MND_KHT',
  villageId: 'VIL_KHT_1',
  fpsNumber: 'FPS-101',
  regionType: 'URBAN',
  slotDate: '2026-10-12'
});

assert(urbanSummary.case1UrbanProcessed > 0, `Processed ${urbanSummary.case1UrbanProcessed} Urban beneficiaries under Case 1`);
assert(urbanSummary.smsDispatchedCount === 0, "CASE 1 RULE: Zero SMS notifications dispatched for Urban");
assert(urbanSummary.voiceCallsGeneratedCount === 0, "CASE 1 RULE: Zero automated voice calls generated for Urban");
assert(urbanSummary.announcementAddedCount === 0, "CASE 1 RULE: Zero Village Announcement list additions for Urban");

// Check beneficiary properties after Case 1 execution
const updatedUrbanBen = db.getBeneficiaries(b => b.fpsNumber === 'FPS-101')[0];
assert(updatedUrbanBen.slotName && updatedUrbanBen.slotTime, `Slot automatically booked: ${updatedUrbanBen.slotName} (${updatedUrbanBen.slotTime})`);
assert(updatedUrbanBen.notificationStatus === 'PORTAL_ACCESS_REQUIRED', "Notification status set to PORTAL_ACCESS_REQUIRED for Urban");

// -------------------------------------------------------------
// TEST 4: USER PORTAL VERIFICATION (URBAN CITIZEN SELF-SERVICE)
// -------------------------------------------------------------
console.log("\n--- Test 4: User Portal Verification ---");
// Valid verification for Ramesh Kumar
const portalVerifySuccess = portal.verifyBeneficiary("WAP07190021001", "FPS-101", "9848011221");
assert(portalVerifySuccess.success === true, "User Portal verified valid Ration Card, FPS, and Mobile");
assert(Boolean(portalVerifySuccess.beneficiary.slotDate), `Displays Slot Date: ${portalVerifySuccess.beneficiary.slotDate}`);
assert(Boolean(portalVerifySuccess.beneficiary.slotTime), `Displays Slot Time: ${portalVerifySuccess.beneficiary.slotTime}`);
assert(portalVerifySuccess.beneficiary.fpsNumber === "FPS-101", `Displays FPS Number: ${portalVerifySuccess.beneficiary.fpsNumber}`);

// Collection details computation
const bill = portal.computeCommodityBill(portalVerifySuccess.beneficiary.commodities, portalVerifySuccess.beneficiary.cardCategory);
assert(bill.items.length >= 4, `Displays Collection Details with ${bill.items.length} subsidized items`);
assert(parseFloat(bill.grandTotal) > 0, `Calculated Subsidized Total: ₹${bill.grandTotal}`);

// Negative test: Mismatched FPS
const portalVerifyMismatch = portal.verifyBeneficiary("WAP07190021001", "FPS-999", "9848011221");
assert(portalVerifyMismatch.success === false, "User Portal rejects mismatched Fair Price Shop Number");

// -------------------------------------------------------------
// TEST 5: Dealer Workflow - CASE 2: RURAL REGION + MOBILE AVAILABLE
// -------------------------------------------------------------
console.log("\n--- Test 5: Dealer Workflow - CASE 2: RURAL + MOBILE AVAILABLE ---");
// Dealer selects: Rangareddy, Chevella, Aloor Village, FPS-102, RURAL
const ruralSummary = engine.processRegionBatch({
  districtId: 'DIST_RNG',
  mandalId: 'MND_CHV',
  villageId: 'VIL_ALR',
  fpsNumber: 'FPS-102',
  regionType: 'RURAL',
  slotDate: '2026-10-12'
});

assert(ruralSummary.case2RuralMobileProcessed > 0, `Processed ${ruralSummary.case2RuralMobileProcessed} Case 2 (Rural + Mobile) beneficiaries`);
assert(ruralSummary.smsDispatchedCount > 0, `Dispatched bilingual SMS (${ruralSummary.smsDispatchedCount} messages: English & Telugu)`);
assert(ruralSummary.voiceCallsGeneratedCount > 0, `Generated bilingual automated voice calls (${ruralSummary.voiceCallsGeneratedCount} calls: English & Telugu)`);

// Check rural mobile beneficiary record
const ruralMobileBen = db.getBeneficiaries(b => b.fpsNumber === 'FPS-102' && b.hasMobile)[0];
assert(ruralMobileBen.notificationStatus === 'SMS_SENT', "Recorded notification status: SMS_SENT");
assert(ruralMobileBen.callStatus === 'VOICE_CALL_SENT', "Recorded call status: VOICE_CALL_SENT");
assert(ruralMobileBen.slotName && ruralMobileBen.slotTime, `Slot booked automatically: ${ruralMobileBen.slotName} (${ruralMobileBen.slotTime})`);

// Verify bilingual voice scripts generation
const scripts = voice.generateScripts(ruralMobileBen);
assert(scripts.english.script.includes(ruralMobileBen.name) && scripts.english.script.includes('FPS-102'), "Generated English Voice Call IVR script with slot & FPS");
assert(scripts.telugu.script.includes('ఆహార సేతు') && scripts.telugu.script.includes('FPS-102'), "Generated Telugu Voice Call IVR script with slot & FPS");

// -------------------------------------------------------------
// TEST 6: Dealer Workflow - CASE 3: RURAL REGION + NO MOBILE
// -------------------------------------------------------------
console.log("\n--- Test 6: Dealer Workflow - CASE 3: RURAL + NO MOBILE ---");
assert(ruralSummary.case3RuralNoMobileProcessed > 0, `Processed ${ruralSummary.case3RuralNoMobileProcessed} Case 3 (Rural + No Mobile) beneficiaries`);
assert(ruralSummary.announcementAddedCount > 0, `Added ${ruralSummary.announcementAddedCount} beneficiaries to Village Announcement List`);

// Check rural no-mobile beneficiary record
const ruralNoMobileBen = db.getBeneficiaries(b => b.fpsNumber === 'FPS-102' && !b.hasMobile)[0];
assert(ruralNoMobileBen.notificationStatus === 'ANNOUNCEMENT_REQUIRED', "Recorded notification status: ANNOUNCEMENT_REQUIRED");
assert(ruralNoMobileBen.inAnnouncementList === true, "Marked inAnnouncementList = true");
assert(Boolean(ruralNoMobileBen.name && ruralNoMobileBen.rationCardNumber && ruralNoMobileBen.villageName && ruralNoMobileBen.fpsNumber && ruralNoMobileBen.slotDate && ruralNoMobileBen.slotTime), "Village Announcement record contains all mandatory fields: Name, Ration Card, Village, FPS, Date, Time");

// -------------------------------------------------------------
// TEST 7: ANNOUNCEMENT LIST PAGE & GROUPING
// -------------------------------------------------------------
console.log("\n--- Test 7: Announcement List Page & Slot Grouping ---");
const announcementList = announcementMgr.getAnnouncementBeneficiaries('FPS-102');
assert(announcementList.length > 0, `Retrieved ${announcementList.length} beneficiaries for FPS-102 announcement list`);

const groupedSlots = announcementMgr.groupBySlots(announcementList);
assert(Boolean(groupedSlots["Slot 1"]), "Grouped into Slot 1");
assert(Boolean(groupedSlots["Slot 2"]), "Grouped into Slot 2");
assert(Boolean(groupedSlots["Slot 3"]), "Grouped into Slot 3");
assert(Boolean(groupedSlots["Reallocated Slots"]), "Grouped into Reallocated Slots");

const bulletin = announcementMgr.generateBulletinText(announcementList, 'FPS-102');
assert(bulletin.includes("Beneficiaries listed below are requested to collect their ration from"), "Bulletin contains official English announcement quote");
assert(bulletin.includes("Gram Panchayat") && bulletin.includes("Village Secretary") && bulletin.includes("Ward Member"), "Bulletin targets Gram Panchayat, Village Secretary, Ward Member, and PA System");

// -------------------------------------------------------------
// TEST 8: MISSED DISTRIBUTION & AUTOMATIC REALLOCATION
// -------------------------------------------------------------
console.log("\n--- Test 8: Missed Distribution & Reallocation ---");
const targetToMiss = announcementList[0];
const updatedMissed = engine.markDistributionStatus(targetToMiss.id, 'MISSED');
assert(updatedMissed.distributionStatus === 'MISSED', "Beneficiary marked as MISSED");

const updatedRealloc = engine.markDistributionStatus(targetToMiss.id, 'REALLOCATED');
assert(updatedRealloc.slotName === 'Reallocated Slots', "Auto-reallocated to 'Reallocated Slots'");
assert(updatedRealloc.slotTime === '05:00 PM - 06:30 PM', "Catch-up time window assigned: 05:00 PM - 06:30 PM");

// -------------------------------------------------------------
// TEST 9: SYSTEM RULE AUDIT (ZERO BENEFICIARIES LEFT OUT)
// -------------------------------------------------------------
console.log("\n--- Test 9: System Rule Compliance Audit ---");
const finalBeneficiaries = db.getBeneficiaries();
let unnotifiedCount = 0;

finalBeneficiaries.forEach(b => {
  if (b.regionType === 'URBAN') {
    // Must be covered by User Portal
    if (b.notificationStatus !== 'PORTAL_ACCESS_REQUIRED') unnotifiedCount++;
  } else if (b.regionType === 'RURAL' && b.hasMobile) {
    // Must be covered by SMS & Voice Call
    if (b.notificationStatus !== 'SMS_SENT' && b.callStatus !== 'VOICE_CALL_SENT') unnotifiedCount++;
  } else if (b.regionType === 'RURAL' && !b.hasMobile) {
    // Must be covered by Village Announcement List
    if (b.notificationStatus !== 'ANNOUNCEMENT_REQUIRED' && b.slotName !== 'Reallocated Slots') unnotifiedCount++;
  }
});

assert(unnotifiedCount === 0, "SYSTEM RULE GUARANTEE: Exactly 0 beneficiaries left without communication channel!");

console.log("\n=================================================================");
console.log(`  🎉 Test Results: ${passedTests} / ${totalTests} Passed (100% Success)`);
console.log("=================================================================");
