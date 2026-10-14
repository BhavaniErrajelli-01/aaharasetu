/**
 * Aahara Setu - Citizen User Portal
 * Implements Case 1 Urban Self-Service Verification & Citizen Pass
 */

class UserPortal {
  constructor(db) {
    this.db = db;
  }

  verifyBeneficiary(rationCard, fpsNumber, mobileNumber) {
    const cardClean = (rationCard || '').trim().toUpperCase();
    const fpsClean = (fpsNumber || '').trim().toUpperCase();
    const mobileClean = (mobileNumber || '').trim().replace(/\D/g, '');

    if (!cardClean) {
      return { success: false, error: "Please enter your Ration Card Number." };
    }

    if (!fpsClean) {
      return { success: false, error: "Please enter your Fair Price Shop (FPS) Number." };
    }

    const ben = this.db.getBeneficiaryByRationCard(cardClean);
    if (!ben) {
      return {
        success: false,
        error: `Ration Card "${cardClean}" is not found in the Aahara Setu PDS database. Please check the number or contact your local Civil Supplies office.`
      };
    }

    // Match FPS
    if (ben.fpsNumber.toUpperCase() !== fpsClean) {
      return {
        success: false,
        error: `Fair Price Shop mismatch! This card is linked to ${ben.fpsNumber}, not ${fpsClean}. Please enter your assigned FPS number.`
      };
    }

    // Optional Mobile match if beneficiary has mobile
    if (mobileClean && ben.mobile) {
      const benMobileClean = ben.mobile.replace(/\D/g, '');
      if (benMobileClean && benMobileClean !== mobileClean) {
        return {
          success: false,
          error: `Mobile number does not match registered records for this ration card.`
        };
      }
    }

    const fpsInfo = this.db.getFpsById(ben.fpsNumber) || {
      id: ben.fpsNumber,
      dealerName: "Government Authorized Dealer",
      location: "Designated Mandal PDS Center",
      timings: "08:00 AM - 05:00 PM"
    };

    return {
      success: true,
      beneficiary: ben,
      fps: fpsInfo,
      verificationTimestamp: new Date().toLocaleString('en-IN')
    };
  }

  // Generates itemized subsidized price receipt
  computeCommodityBill(commodities, cardCategory) {
    const priceTable = {
      rice: { name: "Fortified Rice (ఫోర్టిఫైడ్ బియ్యం)", rate: 1.0, unit: "kg" },
      wheat: { name: "Whole Wheat (గోధుమలు)", rate: 2.0, unit: "kg" },
      sugar: { name: "Refined Sugar (చక్కెర)", rate: 13.5, unit: "kg" },
      dal: { name: "Red Gram Dal (కందిపప్పు)", rate: 30.0, unit: "kg" },
      oil: { name: "Fortified Palm Oil (వంట నూనె)", rate: 25.0, unit: "L" }
    };

    const isAay = (cardCategory || '').includes('AAY');
    const items = [];
    let grandTotal = 0;

    if (commodities.riceKg) {
      const rate = isAay ? 0 : priceTable.rice.rate; // Free for AAY in many schemes
      const cost = commodities.riceKg * rate;
      items.push({ name: priceTable.rice.name, qty: `${commodities.riceKg} kg`, rate: `₹${rate}/kg`, cost: `₹${cost.toFixed(2)}` });
      grandTotal += cost;
    }

    if (commodities.wheatKg) {
      const cost = commodities.wheatKg * priceTable.wheat.rate;
      items.push({ name: priceTable.wheat.name, qty: `${commodities.wheatKg} kg`, rate: `₹${priceTable.wheat.rate}/kg`, cost: `₹${cost.toFixed(2)}` });
      grandTotal += cost;
    }

    if (commodities.sugarKg) {
      const cost = commodities.sugarKg * priceTable.sugar.rate;
      items.push({ name: priceTable.sugar.name, qty: `${commodities.sugarKg} kg`, rate: `₹${priceTable.sugar.rate}/kg`, cost: `₹${cost.toFixed(2)}` });
      grandTotal += cost;
    }

    if (commodities.dalKg) {
      const cost = commodities.dalKg * priceTable.dal.rate;
      items.push({ name: priceTable.dal.name, qty: `${commodities.dalKg} kg`, rate: `₹${priceTable.dal.rate}/kg`, cost: `₹${cost.toFixed(2)}` });
      grandTotal += cost;
    }

    if (commodities.oilLitre) {
      const cost = commodities.oilLitre * priceTable.oil.rate;
      items.push({ name: priceTable.oil.name, qty: `${commodities.oilLitre} L`, rate: `₹${priceTable.oil.rate}/L`, cost: `₹${cost.toFixed(2)}` });
      grandTotal += cost;
    }

    return { items, grandTotal: grandTotal.toFixed(2) };
  }
}

window.aaharaPortal = new UserPortal(window.aaharaDB);
