"""
Test Suite for Gram Panchayat Speaker Announcement List & Print Feature
Verifies:
1. Filter: ONLY beneficiaries without mobile numbers are included.
2. Official Loudspeaker Announcement bulletin scripts (Telugu & English).
3. Dealer route /dealer/announcement-list loads correctly with print button (window.print).
4. Printable roster table contains Ration Card, Name, Slot Date, Slot Time, and Signatures.
5. Dealer dashboard links to the Gram Panchayat speaker roster.
"""

import unittest
from app import app
import db

class TestAnnouncementPrintFeature(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_01_backend_no_mobile_filter_accuracy(self):
        """Verify get_announcement_beneficiaries strictly filters for citizens with NO mobile phone."""
        fps = "FPS-HNK-332"
        data = db.get_announcement_beneficiaries(fps)
        self.assertIsNotNone(data)
        self.assertGreater(data['total_count'], 0)
        self.assertEqual(data['fps_shop_number'], fps)

        # Check every single beneficiary has NO valid mobile
        for b in data['beneficiaries']:
            mob = b.get('registered_mobile')
            status = b.get('mobile_status')
            self.assertTrue(
                status == 'NO_MOBILE' or not mob or mob in ('No Mobile', 'None', ''),
                f"Beneficiary {b['name']} ({b['ration_card_number']}) has mobile {mob} but was included in announcement list!"
            )
            # Must have ration card number, slot date, and slot time
            self.assertTrue(bool(b.get('ration_card_number')))
            self.assertTrue(bool(b.get('slot_date')))
            self.assertTrue(bool(b.get('start_time')))
            self.assertTrue(bool(b.get('end_time')))

        # Check bulletin scripts exist
        self.assertIn("గ్రామ ప్రజలకు ముఖ్య గమనిక", data['bulletin_te'])
        self.assertIn(fps, data['bulletin_te'])
        self.assertIn("Attention Village Residents", data['bulletin_en'])
        self.assertIn(fps, data['bulletin_en'])

        print(f"\n[PASS] Test 01: Succeeded. {data['total_count']} citizens strictly without mobile phones filtered for {fps}.")

    def test_02_dealer_announcement_list_route_and_print_elements(self):
        """Verify /dealer/announcement-list requires dealer login, renders printable roster, and contains window.print."""
        # Unauthenticated request should redirect
        res_unauth = self.client.get('/dealer/announcement-list')
        self.assertEqual(res_unauth.status_code, 302)

        # Authenticate as Dealer
        self.client.post('/login', data={
            'login_type': 'dealer',
            'username': 'dealer',
            'password': 'dealer123'
        }, follow_redirects=True)

        # Access announcement list
        res = self.client.get('/dealer/announcement-list?fps=FPS-HNK-332')
        self.assertEqual(res.status_code, 200)
        html = res.data.decode('utf-8')

        # 1. Government and Gram Panchayat headers
        self.assertTrue('గ్రామ పంచాయతీ' in html or 'LOUDSPEAKER' in html)
        self.assertIn('GOVERNMENT OF TELANGANA', html.upper())

        # 2. Print action
        self.assertIn('window.print()', html)
        self.assertTrue('Print Announcement List' in html or 'ప్రింట్ చేయండి' in html)

        # 3. Loudspeaker audio test
        self.assertIn('toggleSpeakerAudio', html)
        self.assertIn('btn-speaker-test', html)

        # 4. Table structure
        self.assertIn('roster-table', html)
        self.assertIn('no-mob-tag', html)
        self.assertIn('print-sign-col', html)

        # 5. Official Signatories block
        self.assertIn('roster-signatures-block', html)
        self.assertTrue('సర్పంచ్' in html or 'Sarpanch' in html)
        self.assertTrue('కార్యదర్శి' in html or 'Secretary' in html)

        print("[PASS] Test 02: Dealer announcement list route loaded with official government roster, print action, and signatures.")

    def test_03_dealer_dashboard_links_to_announcement_roster(self):
        """Verify Dealer Dashboard has prominent buttons and links to the Gram Panchayat Announcement List."""
        # Authenticate as Dealer
        self.client.post('/login', data={
            'login_type': 'dealer',
            'username': 'dealer',
            'password': 'dealer123'
        }, follow_redirects=True)

        res = self.client.get('/dealer/dashboard?fps=FPS-HNK-332')
        self.assertEqual(res.status_code, 200)
        html = res.data.decode('utf-8')

        # Check links to /dealer/announcement-list exist
        self.assertIn('/dealer/announcement-list', html)
        self.assertIn('btn-kpi-announcement-link', html)
        self.assertIn('btn-announcement-pill', html)
        self.assertIn('link-speaker-view', html)

        print("[PASS] Test 03: Dealer Dashboard prominently links to Gram Panchayat Speaker Announcement List.")

if __name__ == '__main__':
    unittest.main()
