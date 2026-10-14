"""
Test Suite for Keypad Phone SMS & Voice Call Feature (Dealer & User)
and Removal of Example Numbers / Prefills.
"""

import unittest
from app import app
import db

class TestKeypadPhoneFeature(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_01_login_page_has_no_example_numbers_or_prefills(self):
        """Verify login page has zero prefilled credentials or 'e.g.' text."""
        res = self.client.get('/login')
        html = res.data.decode('utf-8')
        
        # Check no dummy prefilled values
        self.assertNotIn('value="TSRC1000002"', html)
        self.assertNotIn('value="6465908538"', html)
        self.assertNotIn('value="ramesh.reddy01"', html)
        self.assertNotIn('value="Rm4829x"', html)
        self.assertNotIn('dataset-helper-box', html)
        self.assertNotIn('Quick Demo', html)
        
        # Check placeholders have no "e.g."
        self.assertNotIn('e.g.', html.lower())
        self.assertNotIn('ఉదాహరణ', html)
        
        print("\n[PASS] Test 01: Login page completely free of hardcoded example numbers and prefill values.")

    def test_02_citizen_portal_displays_keypad_sms_and_voice_call(self):
        """Verify Citizen Portal shows keypad SMS & Voice IVR card from dataset."""
        # Authenticate citizen from dataset
        login_res = self.client.post('/login', data={
            'login_type': 'citizen',
            'ration_card_number': 'TSRC1000002',
            'registered_mobile': '6465908538'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)
        html = login_res.data.decode('utf-8')

        # Check Government header & slot details
        self.assertIn('Government of Telangana', html)
        self.assertIn('TSRC1000002', html)
        self.assertIn('6465908538', html)

        # Check Keypad Phone Alert Service section
        self.assertIn('keypad-portal-alert-card', html)
        self.assertTrue('Keypad Phone Alert Service' in html or 'సాధారణ కీప్యాడ్ ఫోన్ సేవ' in html)
        self.assertTrue('Dispatched SMS Message' in html or 'ద్విభాషా SMS' in html)
        self.assertTrue('Automated Voice Call' in html or 'స్వయంచాలక వాయిస్ కాల్' in html)
        self.assertIn('cit-voice-icon', html)
        self.assertIn('playCitizenVoice', html)

        print("[PASS] Test 02: Citizen portal correctly displays Keypad Phone SMS & Automated Voice Call section from dataset.")

    def test_03_dealer_dashboard_displays_keypad_kpis_and_actions(self):
        """Verify Dealer Dashboard shows Keypad KPI cards, table column, badges, and inspection modal."""
        # Authenticate dealer
        login_res = self.client.post('/login', data={
            'login_type': 'dealer',
            'username': 'dealer',
            'password': 'dealer123'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)
        html = login_res.data.decode('utf-8')

        # 1. KPI cards for Keypad phones
        self.assertIn('comm-metrics-card', html)
        self.assertIn('comm-kpi-grid', html)
        self.assertTrue('Keypad Phone Users' in html or 'కీప్యాడ్ ఫోన్ వినియోగదారులు' in html)
        self.assertTrue('Bilingual SMS Dispatched' in html or 'ద్విభాషా SMS పంపబడ్డాయి' in html)
        self.assertTrue('Automated Voice IVR Calls' in html or 'ఆటోమేటెడ్ వాయిస్ కాల్స్' in html)
        self.assertTrue('Village Announcements' in html or 'గ్రామ చాటింపు జాబితా' in html)

        # 2. Table Column
        self.assertTrue('Keypad Phone Alerts' in html or 'కీప్యాడ్ ఫోన్ అలర్ట్‌లు' in html)

        # 3. Badges and action buttons in table
        self.assertIn('tag-sms', html)
        self.assertIn('btn-inspect-alert', html)
        self.assertIn('openKeypadModal', html)

        # 4. Keypad Modal with Audio Controls and Resend Action
        self.assertIn('keypad-alert-modal', html)
        self.assertIn('btn-play-voice-call', html)
        self.assertIn('speech-wave-box', html)
        self.assertIn('btn-resend-now', html)
        self.assertIn('resendKeypadAlert', html)
        self.assertIn('togglePlayVoiceCall', html)

        print("[PASS] Test 03: Dealer dashboard displays Keypad Multimodal KPIs, table badges, interactive audio player modal, and resend action.")

    def test_04_dataset_integration_keypad_payloads(self):
        """Verify backend db queries correctly enrich beneficiaries with keypad phone payloads."""
        fps = "FPS-HNK-332"
        data = db.get_dealer_shop_data(fps)
        self.assertIsNotNone(data)
        self.assertIn('counts', data)
        counts = data['counts']
        self.assertIn('keypad_users', counts)
        self.assertIn('sms_dispatched', counts)
        self.assertIn('voice_calls_made', counts)
        self.assertIn('no_mobile', counts)

        # Verify beneficiaries have keypad fields
        beneficiaries = data['beneficiaries']
        self.assertGreater(len(beneficiaries), 0)
        first_ben = beneficiaries[0]
        self.assertIn('is_keypad_phone', first_ben)
        self.assertIn('has_mobile', first_ben)
        self.assertIn('sms_en', first_ben)
        self.assertIn('sms_te', first_ben)
        self.assertIn('voice_en', first_ben)
        self.assertIn('voice_te', first_ben)
        self.assertTrue(len(first_ben['sms_en']) > 10)
        self.assertTrue(len(first_ben['voice_en']) > 10)

        print(f"[PASS] Test 04: Dataset query returned {len(beneficiaries)} beneficiaries for {fps} with keypad payloads. Keypad KPI users: {counts['keypad_users']}.")

if __name__ == '__main__':
    unittest.main()
