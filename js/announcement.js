/**
 * Aahara Setu - Village Announcement Engine
 * Handles Case 3 (Rural + No Mobile) & Reallocated Slots
 * Groups by Slot 1, Slot 2, Slot 3, Reallocated Slots
 * Implements View, Print, and Export (CSV / Text)
 */

class AnnouncementManager {
  constructor(db) {
    this.db = db;
  }

  /**
   * Retrieves beneficiaries for the announcement list.
   * Criteria: Rural + No Mobile OR explicitly in announcement list OR Reallocated Slots
   */
  getAnnouncementBeneficiaries(filterFps = null) {
    const all = this.db.getBeneficiaries();
    return all.filter(b => {
      // Must be Rural AND (No Mobile OR marked ANNOUNCEMENT_REQUIRED OR Reallocated Slots)
      const isRural = b.regionType === 'RURAL';
      const isNoMobile = !b.hasMobile || !b.mobile;
      const isAnnouncementStatus = b.notificationStatus === 'ANNOUNCEMENT_REQUIRED';
      const isReallocated = b.slotName === 'Reallocated Slots' || b.distributionStatus === 'REALLOCATED';

      const eligible = isRural && (isNoMobile || isAnnouncementStatus || isReallocated);
      if (!eligible) return false;

      if (filterFps && filterFps !== 'ALL' && b.fpsNumber !== filterFps) {
        return false;
      }
      return true;
    });
  }

  /**
   * Group beneficiaries into:
   * 1. Slot 1
   * 2. Slot 2
   * 3. Slot 3
   * 4. Reallocated Slots
   */
  groupBySlots(beneficiaries) {
    const groups = {
      "Slot 1": {
        title: "Slot 1 (Morning Batch: 08:00 AM - 10:30 AM)",
        timing: "08:00 AM - 10:30 AM",
        items: []
      },
      "Slot 2": {
        title: "Slot 2 (Midday Batch: 10:45 AM - 01:15 PM)",
        timing: "10:45 AM - 01:15 PM",
        items: []
      },
      "Slot 3": {
        title: "Slot 3 (Afternoon Batch: 02:00 PM - 04:30 PM)",
        timing: "02:00 PM - 04:30 PM",
        items: []
      },
      "Reallocated Slots": {
        title: "Reallocated Slots (Catch-Up Evening Batch: 05:00 PM - 06:30 PM)",
        timing: "05:00 PM - 06:30 PM",
        items: []
      }
    };

    beneficiaries.forEach(ben => {
      const slot = ben.slotName || 'Slot 1';
      if (groups[slot]) {
        groups[slot].items.push(ben);
      } else if (slot.toLowerCase().includes('realloc')) {
        groups["Reallocated Slots"].items.push(ben);
      } else {
        groups["Slot 1"].items.push(ben);
      }
    });

    return groups;
  }

  /**
   * Generates formatted CSV for download
   */
  exportToCsv(beneficiaries, fpsNumber = "FPS-102") {
    const headers = [
      "Sl No",
      "Beneficiary Name",
      "Telugu Name",
      "Ration Card Number",
      "Village",
      "FPS Number",
      "Assigned Date",
      "Assigned Time",
      "Slot Group",
      "Mobile Status",
      "Family Members",
      "Target Authority Dispatch"
    ];

    const rows = beneficiaries.map((b, index) => [
      index + 1,
      `"${b.name}"`,
      `"${b.nameTe || ''}"`,
      `"${b.rationCardNumber}"`,
      `"${b.villageName || b.villageId}"`,
      `"${b.fpsNumber}"`,
      `"${b.slotDate || '2026-10-12'}"`,
      `"${b.slotTime || '08:00 AM - 10:30 AM'}"`,
      `"${b.slotName || 'Slot 1'}"`,
      `"${b.mobileStatus || 'NO_MOBILE'}"`,
      b.familyMembers || 4,
      `"Gram Panchayat / Village Secretary / Ward Member / PA System"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Aahara_Setu_Announcement_List_${fpsNumber}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates printable announcement bulletin text for PA loudspeaker or notice board
   */
  generateBulletinText(beneficiaries, fpsNumber = "FPS-102") {
    const grouped = this.groupBySlots(beneficiaries);
    let txt = `=======================================================================\n`;
    txt += `          AAHARA SETU - GOVERNMENT OF TELANGANA / ANDHRA PRADESH        \n`;
    txt += `                 CIVIL SUPPLIES & ESSENTIAL COMMODITIES                \n`;
    txt += `                       VILLAGE ANNOUNCEMENT LIST                       \n`;
    txt += `=======================================================================\n\n`;
    txt += `OFFICIAL NOTICE / అధికారిక ప్రకటన:\n`;
    txt += `"Beneficiaries listed below are requested to collect their ration from\n`;
    txt += ` ${fpsNumber} during their allotted time slot."\n`;
    txt += `"దిగువ పేర్కొన్న లబ్ధిదారులు తమకు కేటాయించిన సమయాలలో ${fpsNumber} నుండి\n`;
    txt += ` తమ రేషన్‌ను తీసుకోవాల్సిందిగా కోరడమైనది."\n\n`;
    txt += `Distribution Center: ${fpsNumber}\n`;
    txt += `Dispatch Target: Gram Panchayat | Village Secretary | Ward Member | PA System\n`;
    txt += `Generated On: ${new Date().toLocaleString('en-IN')}\n\n`;

    Object.entries(grouped).forEach(([slotKey, group]) => {
      txt += `-----------------------------------------------------------------------\n`;
      txt += `>>> ${group.title} (Total: ${group.items.length})\n`;
      txt += `-----------------------------------------------------------------------\n`;
      if (group.items.length === 0) {
        txt += `   (No beneficiaries assigned to this slot)\n\n`;
      } else {
        group.items.forEach((b, i) => {
          txt += `   ${i + 1}. [${b.rationCardNumber}] ${b.name} (${b.nameTe || ''}) | Village: ${b.villageName} | Date: ${b.slotDate} | Time: ${b.slotTime}\n`;
        });
        txt += `\n`;
      }
    });

    txt += `=======================================================================\n`;
    txt += `Authorized Signatories:\n`;
    txt += `[ ] Village Secretary     [ ] Sarpanch / Gram Panchayat     [ ] Ward Member\n`;
    txt += `=======================================================================\n`;
    return txt;
  }
}

window.aaharaAnnouncement = new AnnouncementManager(window.aaharaDB);
