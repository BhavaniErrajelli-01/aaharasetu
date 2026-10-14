/**
 * Aahara Setu - Region-Based Communication Engine
 * Implements Dealer Workflow Step 1 & 2, Case 1 (Urban), Case 2 (Rural + Mobile), Case 3 (Rural + No Mobile)
 */

class CommunicationEngine {
  constructor(db) {
    this.db = db;
    this.communicationLogs = this.loadLogs();
  }

  loadLogs() {
    try {
      const logs = localStorage.getItem('aahara_setu_logs_v1');
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  saveLogs() {
    try {
      localStorage.setItem('aahara_setu_logs_v1', JSON.stringify(this.communicationLogs));
    } catch (e) {}
  }

  addLog(entry) {
    const logItem = {
      id: 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      ...entry
    };
    this.communicationLogs.unshift(logItem);
    if (this.communicationLogs.length > 200) {
      this.communicationLogs.pop();
    }
    this.saveLogs();
    return logItem;
  }

  getLogs() {
    return this.communicationLogs;
  }

  clearLogs() {
    this.communicationLogs = [];
    this.saveLogs();
  }

  /**
   * Dealer Step 2: System loads beneficiaries belonging to selected region.
   * Checks mobile status (MOBILE_AVAILABLE, NO_MOBILE)
   */
  loadBeneficiariesForRegion({ districtId, mandalId, villageId, fpsNumber, regionType }) {
    let list = this.db.getBeneficiaries();

    // Match criteria
    list = list.filter(b => {
      let matches = true;
      if (districtId && b.districtId !== districtId) matches = false;
      if (mandalId && b.mandalId !== mandalId) matches = false;
      if (villageId && b.villageId !== villageId) matches = false;
      if (fpsNumber && b.fpsNumber !== fpsNumber) matches = false;
      return matches;
    });

    // If regionType specified, verify or normalize
    return list.map(b => {
      const hasMobile = Boolean(b.mobile && b.mobile.trim().length === 10);
      const mobileStatus = hasMobile ? 'MOBILE_AVAILABLE' : 'NO_MOBILE';
      return {
        ...b,
        hasMobile,
        mobileStatus,
        regionType: regionType || b.regionType
      };
    });
  }

  /**
   * Process and allocate slots & trigger rule-based communications
   * for all beneficiaries loaded in the dealer selection
   */
  processRegionBatch({ districtId, mandalId, villageId, fpsNumber, regionType, slotDate }) {
    const beneficiaries = this.loadBeneficiariesForRegion({
      districtId,
      mandalId,
      villageId,
      fpsNumber,
      regionType
    });

    const executionSummary = {
      timestamp: new Date().toISOString(),
      districtId,
      mandalId,
      villageId,
      fpsNumber,
      regionType,
      slotDate: slotDate || '2026-10-15',
      totalLoaded: beneficiaries.length,
      case1UrbanProcessed: 0,
      case2RuralMobileProcessed: 0,
      case3RuralNoMobileProcessed: 0,
      smsDispatchedCount: 0,
      voiceCallsGeneratedCount: 0,
      announcementAddedCount: 0,
      results: []
    };

    const slotsAvailable = [
      { name: "Slot 1", time: "08:00 AM - 10:30 AM" },
      { name: "Slot 2", time: "10:45 AM - 01:15 PM" },
      { name: "Slot 3", time: "02:00 PM - 04:30 PM" }
    ];

    beneficiaries.forEach((ben, index) => {
      // Slot allocation round-robin if not already set or reassigned
      const slotIndex = index % slotsAvailable.length;
      const assignedSlot = slotsAvailable[slotIndex];
      const targetDate = slotDate || ben.slotDate || '2026-10-15';

      let updatePayload = {
        regionType: regionType,
        slotName: ben.slotName === 'Reallocated Slots' ? 'Reallocated Slots' : assignedSlot.name,
        slotDate: targetDate,
        slotTime: ben.slotName === 'Reallocated Slots' ? '05:00 PM - 06:30 PM' : assignedSlot.time,
        fpsNumber: fpsNumber || ben.fpsNumber
      };

      const hasMobile = Boolean(ben.mobile && ben.mobile.trim().length === 10);
      updatePayload.hasMobile = hasMobile;
      updatePayload.mobileStatus = hasMobile ? 'MOBILE_AVAILABLE' : 'NO_MOBILE';

      // ==========================================
      // CASE 1: URBAN REGION
      // ==========================================
      if (regionType === 'URBAN') {
        updatePayload.notificationStatus = 'PORTAL_ACCESS_REQUIRED';
        updatePayload.callStatus = 'NOT_APPLICABLE_URBAN';
        updatePayload.inAnnouncementList = false;

        executionSummary.case1UrbanProcessed++;

        // Audit Log
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          regionType: 'URBAN',
          caseType: 'CASE_1_URBAN',
          channel: 'USER_PORTAL',
          status: 'SLOT_ALLOCATED_PORTAL_ONLY',
          smsSent: false,
          voiceCallSent: false,
          announcementList: false,
          message: `Slot booked (${updatePayload.slotName}, ${updatePayload.slotTime}). STRICT RULE: SMS, voice call, & announcement suppressed for Urban. Citizen must check Aahara Setu User Portal.`
        });

        executionSummary.results.push({
          beneficiary: ben,
          case: 'CASE 1: URBAN REGION',
          action: 'Slot booked & allocated. SMS/Calls/Announcement suppressed. Must use User Portal.',
          status: 'PORTAL_ACCESS_REQUIRED'
        });
      }
      // ==========================================
      // CASE 2: RURAL REGION + MOBILE AVAILABLE
      // ==========================================
      else if (regionType === 'RURAL' && hasMobile) {
        updatePayload.notificationStatus = 'SMS_SENT';
        updatePayload.callStatus = 'VOICE_CALL_SENT';
        updatePayload.inAnnouncementList = false;

        executionSummary.case2RuralMobileProcessed++;
        executionSummary.smsDispatchedCount += 2; // English + Telugu
        executionSummary.voiceCallsGeneratedCount += 2; // English + Telugu

        // Bilingual message templates
        const smsEnglish = `Aahara Setu PDS: Dear ${ben.name}, your ration collection slot at ${updatePayload.fpsNumber} is booked for ${updatePayload.slotDate} (${updatePayload.slotName}: ${updatePayload.slotTime}). Card: ${ben.rationCardNumber}.`;
        const smsTelugu = `ఆహార సేతు: ప్రియమైన ${ben.nameTe || ben.name}, ${updatePayload.fpsNumber} వద్ద మీ రేషన్ స్లాట్ ${updatePayload.slotDate} (${updatePayload.slotName}: ${updatePayload.slotTime}) న కేటాయించబడింది. కార్డు: ${ben.rationCardNumber}.`;

        const voiceEnglishScript = `Hello ${ben.name}. This is an automated voice call from Aahara Setu Food Civil Supplies. Your ration distribution slot has been reserved at Fair Price Shop ${updatePayload.fpsNumber} on ${updatePayload.slotDate} between ${updatePayload.slotTime}. Please bring your Ration Card ${ben.rationCardNumber}.`;
        const voiceTeluguScript = `నమస్కారం ${ben.nameTe || ben.name} గారు. ఇది ఆహార సేతు ప్రజా పంపిణీ శాఖ నుండి స్వయంచాలక వాయిస్ కాల్. మీ రేషన్ సేకరణ స్లాట్ ${updatePayload.slotDate} న ${updatePayload.slotTime} సమయంలో FPS-${updatePayload.fpsNumber} దుకాణంలో కేటాయించబడింది. దయచేసి మీ రేషన్ కార్డు తీసుకురండి.`;

        // Audit Log for English SMS
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          mobile: ben.mobile,
          regionType: 'RURAL',
          caseType: 'CASE_2_RURAL_MOBILE',
          channel: 'SMS_ENGLISH',
          status: 'SMS_SENT',
          content: smsEnglish
        });

        // Audit Log for Telugu SMS
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          mobile: ben.mobile,
          regionType: 'RURAL',
          caseType: 'CASE_2_RURAL_MOBILE',
          channel: 'SMS_TELUGU',
          status: 'SMS_SENT',
          content: smsTelugu
        });

        // Audit Log for Automated Voice Call English
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          mobile: ben.mobile,
          regionType: 'RURAL',
          caseType: 'CASE_2_RURAL_MOBILE',
          channel: 'VOICE_CALL_ENGLISH',
          status: 'VOICE_CALL_SENT',
          content: voiceEnglishScript
        });

        // Audit Log for Automated Voice Call Telugu
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          mobile: ben.mobile,
          regionType: 'RURAL',
          caseType: 'CASE_2_RURAL_MOBILE',
          channel: 'VOICE_CALL_TELUGU',
          status: 'VOICE_CALL_SENT',
          content: voiceTeluguScript
        });

        executionSummary.results.push({
          beneficiary: ben,
          case: 'CASE 2: RURAL REGION + MOBILE AVAILABLE',
          action: 'Slot booked. Sent SMS (English & Telugu) & Voice Calls (English & Telugu). Status: SMS_SENT, VOICE_CALL_SENT.',
          status: 'SMS_SENT & VOICE_CALL_SENT'
        });
      }
      // ==========================================
      // CASE 3: RURAL REGION + MOBILE NOT AVAILABLE
      // ==========================================
      else {
        // RURAL + NO_MOBILE
        updatePayload.notificationStatus = 'ANNOUNCEMENT_REQUIRED';
        updatePayload.callStatus = 'NOT_APPLICABLE_NO_MOBILE';
        updatePayload.inAnnouncementList = true;

        executionSummary.case3RuralNoMobileProcessed++;
        executionSummary.announcementAddedCount++;

        // Audit Log
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          regionType: 'RURAL',
          caseType: 'CASE_3_RURAL_NO_MOBILE',
          channel: 'VILLAGE_ANNOUNCEMENT_LIST',
          status: 'ANNOUNCEMENT_REQUIRED',
          message: `Slot booked (${updatePayload.slotName}, ${updatePayload.slotTime}). Added to Village Announcement List for Gram Panchayat, Village Secretary, Ward Member & PA System.`
        });

        executionSummary.results.push({
          beneficiary: ben,
          case: 'CASE 3: RURAL REGION + NO MOBILE',
          action: 'Slot booked. Enrolled in Village Announcement List. Status: ANNOUNCEMENT_REQUIRED.',
          status: 'ANNOUNCEMENT_REQUIRED'
        });
      }

      // Commit to Database
      this.db.updateBeneficiary(ben.id, updatePayload);
    });

    return executionSummary;
  }

  /**
   * Action to mark distribution as MISSED or COMPLETED
   */
  markDistributionStatus(beneficiaryId, newStatus) {
    const ben = this.db.getBeneficiaries(b => b.id === beneficiaryId)[0];
    if (!ben) return null;

    let updates = { distributionStatus: newStatus };

    // If marked MISSED, automatically reallocate slot to evening catch-up window
    if (newStatus === 'MISSED') {
      updates.slotName = 'Reallocated Slots';
      updates.slotTime = '05:00 PM - 06:30 PM';
      updates.distributionStatus = 'MISSED';

      this.addLog({
        beneficiaryId: ben.id,
        beneficiaryName: ben.name,
        rationCardNumber: ben.rationCardNumber,
        channel: 'SYSTEM_ALLOCATOR',
        status: 'DISTRIBUTION_MISSED',
        message: `Beneficiary marked MISSED. Slot eligible for immediate reallocation.`
      });
    } else if (newStatus === 'REALLOCATED') {
      updates.slotName = 'Reallocated Slots';
      updates.slotTime = '05:00 PM - 06:30 PM';
      updates.distributionStatus = 'REALLOCATED';

      // Resend notifications based on region rules
      if (ben.regionType === 'RURAL' && ben.hasMobile) {
        updates.notificationStatus = 'SMS_SENT';
        updates.callStatus = 'VOICE_CALL_SENT';
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          channel: 'SMS_AND_VOICE_RESENT',
          status: 'REALLOCATED_NOTIFIED',
          message: `Resent SMS and Voice notification for Reallocated Slot (05:00 PM - 06:30 PM).`
        });
      } else if (ben.regionType === 'RURAL' && !ben.hasMobile) {
        updates.notificationStatus = 'ANNOUNCEMENT_REQUIRED';
        this.addLog({
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          rationCardNumber: ben.rationCardNumber,
          channel: 'VILLAGE_ANNOUNCEMENT_LIST',
          status: 'REALLOCATED_ANNOUNCEMENT',
          message: `Added to Reallocated Slots group on Village Announcement List.`
        });
      }
    } else if (newStatus === 'COMPLETED') {
      this.addLog({
        beneficiaryId: ben.id,
        beneficiaryName: ben.name,
        rationCardNumber: ben.rationCardNumber,
        channel: 'FPS_POS_DEVICE',
        status: 'RATION_DISPENSED_SUCCESS',
        message: `Commodities biometric authentication verified. Ration dispensed successfully.`
      });
    }

    return this.db.updateBeneficiary(beneficiaryId, updates);
  }
}

window.aaharaEngine = new CommunicationEngine(window.aaharaDB);
