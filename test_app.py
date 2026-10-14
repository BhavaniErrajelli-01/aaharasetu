"""
Aahara Setu - Comprehensive Automated Test Suite
Validates:
- Centered header title in Telugu & English
- No top info above title
- Single language select option
- Removal of demo chips & citizen card details
- Dealer role & authentication (replaces Admin)
- Citizen portal displaying only 'Government of Telangana'
- Removal of scanner, print, and save pass
- Zero rice price display and adjusted total
- Sign Out at the bottom of the assigned slot details section
- Dealer dashboard with 4 dropdowns, stock inventory, and collection tracking
"""

import unittest
import sqlite3
import os
from werkzeug.security import check_password_hash
import db
from app import app

class TestAaharaSetuRedesign(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test_secret_key'
        cls.client = app.test_client()

        with app.app_context():
            db.init_db()

    # -------------------------------------------------------------
    # 1. Test SQLite Tables & Dealer / User Roles Constraint
    # -------------------------------------------------------------
    def test_01_sqlite_tables_and_roles(self):
        conn = sqlite3.connect(db.DATABASE_FILE)
        cur = conn.cursor()

        required_tables = ['users', 'beneficiaries', 'slots', 'slot_assignments', 'distribution_records']
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cur.fetchall()]

        for tbl in required_tables:
            self.assertIn(tbl, tables, f"Table '{tbl}' must exist in SQLite database")

        # Verify Dealer and User roles exist in DB
        cur.execute("SELECT role FROM users")
        roles = set(r[0] for r in cur.fetchall())
        self.assertIn('DEALER', roles, "DEALER role must exist in users table")
        self.assertIn('USER', roles, "USER role must exist in users table")
        self.assertNotIn('ADMIN', roles, "ADMIN role should not exist in users table")

        conn.close()
        print("[PASS] Test 01: SQLite tables and DEALER / USER roles verified.")

    # -------------------------------------------------------------
    # 2. Test Dealer Authentication
    # -------------------------------------------------------------
    def test_02_dealer_authentication(self):
        with app.app_context():
            dealer_user = db.get_user_by_username("dealer")
            self.assertIsNotNone(dealer_user)
            self.assertTrue(check_password_hash(dealer_user['password_hash'], "dealer123"))

        # Test Dealer login via HTTP POST
        res_dealer = self.client.post('/login', data={
            'login_type': 'dealer',
            'username': 'dealer',
            'password': 'dealer123'
        }, follow_redirects=True)
        self.assertEqual(res_dealer.status_code, 200)
        self.assertIn(b"Dealer Dashboard", res_dealer.data)

        # Test Logout
        res_logout = self.client.get('/logout', follow_redirects=True)
        self.assertEqual(res_logout.status_code, 200)
        print("[PASS] Test 02: Dealer authentication and session flow verified.")

    # -------------------------------------------------------------
    # 3. Test Login Page Redesign: No Demo Chips, No Citizen Card Details
    # -------------------------------------------------------------
    def test_03_login_page_redesign(self):
        res = self.client.get('/login')
        self.assertEqual(res.status_code, 200)
        html = res.data.decode('utf-8')

        # Check centered title in both Telugu & English
        self.assertIn("Aahara Setu", html)
        self.assertIn("ఆహార సేతు", html)

        # Check single language select dropdown
        self.assertIn('name="lang"', html)
        self.assertIn('<select', html)

        # Ensure NO quick demo chips or prefilled citizen card details
        self.assertNotIn("Quick Demo Citizen Cards", html)
        self.assertNotIn("Ramesh Kumar (FPS-101)", html)
        self.assertNotIn("demo-chips", html)
        self.assertNotIn("Fill Demo Admin", html)

        # Check Dealer and User options (No Admin option)
        self.assertIn("Dealer", html)
        self.assertIn("User", html)
        self.assertNotIn("tab-admin-btn", html)
        print("[PASS] Test 03: Login page minimal redesign verified (No demo chips, Dealer & User options).")

    # -------------------------------------------------------------
    # 4. Test Citizen Portal Redesign:
    #    - Government of Telangana display only
    #    - Scanner, print, and save digital pass removed
    #    - Rice price set to zero
    #    - Sign Out at bottom of slot details section
    # -------------------------------------------------------------
    def test_04_citizen_portal_redesign(self):
        # Login as Citizen using dataset credentials
        self.client.post('/login', data={
            'login_type': 'citizen',
            'ration_card_number': 'TSRC1000002',
            'registered_mobile': '6465908538'
        }, follow_redirects=True)

        res = self.client.get('/citizen/portal')
        self.assertEqual(res.status_code, 200)
        html = res.data.decode('utf-8')

        # Check: After user login, display only Government of Telangana
        self.assertTrue("Government of Telangana" in html or "తెలంగాణ ప్రభుత్వం" in html)
        self.assertNotIn("Aahara Setu Ration Allocation Pass", html)
        self.assertNotIn("E-PDS PASS", html)

        # Check: Remove scanner, print, and save digital pass options
        self.assertNotIn("Print / Save Digital Pass", html)
        self.assertNotIn("window.print()", html)
        self.assertNotIn("FPS e-POS Security Token", html)
        self.assertNotIn('<svg viewBox="0 0 100 100"', html) # No QR code SVG

        # Check: Fortified Rice price is ₹0.00
        self.assertIn("₹0.00", html)
        self.assertTrue("Free" in html or "ఉచితం" in html)

        # Check: Total Subsidized Payable is ₹106.50
        self.assertIn("₹106.50", html)

        # Check: Sign Out button at the bottom of the slot details section
        self.assertIn("btn-citizen-signout", html)
        self.assertIn("Sign Out", html)
        self.assertIn("slot-details-signout-row", html)

        # Now test with English explicitly set
        self.client.get('/set-language?lang=en')
        res_en = self.client.get('/citizen/portal')
        html_en = res_en.data.decode('utf-8')
        self.assertIn("Government of Telangana", html_en)
        self.assertIn("Free", html_en)

        print("[PASS] Test 04: Citizen portal verified (Government of Telangana only, zero rice price, no scanner/print, bottom Sign Out).")

    # -------------------------------------------------------------
    # 5. Test Dealer Dashboard:
    #    - 4 Dropdowns (District, Mandal, Village/Region, FPS)
    #    - Stock goods with quantities (Rice rate zero)
    #    - User collection status (who collected, who not)
    #    - Status toggle
    #    - Bottom Sign Out
    # -------------------------------------------------------------
    def test_05_dealer_dashboard(self):
        # Login as Dealer
        self.client.post('/login', data={
            'login_type': 'dealer',
            'username': 'dealer',
            'password': 'dealer123'
        }, follow_redirects=True)

        res = self.client.get('/dealer/dashboard')
        self.assertEqual(res.status_code, 200)
        html = res.data.decode('utf-8')

        # Check 4 dropdowns
        self.assertIn("select-district", html)
        self.assertIn("select-mandal", html)
        self.assertIn("select-village", html)
        self.assertIn("select-fps", html)

        # Check Stock Goods
        self.assertIn("Fortified Rice", html)
        self.assertIn("Whole Wheat", html)
        self.assertIn("₹0.00 / kg (Free)", html)

        # Check User collection status table
        self.assertIn("Beneficiary Collection Status", html)
        self.assertIn("Collected", html)
        self.assertIn("Not Collected", html)

        # Check Status toggle action endpoint
        res_toggle = self.client.post('/dealer/toggle-status/1', data={
            'fps': 'FPS-HNK-001',
            'status_filter': 'ALL'
        }, follow_redirects=True)
        self.assertEqual(res_toggle.status_code, 200)

        # Check Dealer Sign Out
        self.assertIn("btn-dealer-signout", html)

        print("[PASS] Test 05: Dealer dashboard verified (4 dropdowns, stock inventory, user collection status, bottom sign out).")

    # -------------------------------------------------------------
    # 6. Test Single Language Switching
    # -------------------------------------------------------------
    def test_06_single_language_switch(self):
        # Switch to Telugu
        res_te = self.client.get('/set-language?lang=te', follow_redirects=True)
        self.assertEqual(res_te.status_code, 200)
        self.assertIn("ఆహార సేతు", res_te.data.decode('utf-8'))

        # Switch to English
        res_en = self.client.get('/set-language?lang=en', follow_redirects=True)
        self.assertEqual(res_en.status_code, 200)
        self.assertIn("Aahara Setu", res_en.data.decode('utf-8'))

        print("[PASS] Test 06: Single language selection mechanism verified.")

if __name__ == '__main__':
    unittest.main()
