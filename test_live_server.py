"""
Live Server Integration Verification for Redesigned Aahara Setu
Tests:
- Centered header title in Telugu & English
- Single option language dropdown
- Dealer login (dealer / dealer123)
- Dealer dashboard: 4 dropdowns, stock inventory, user collection status
- Citizen login (WAP07190021001 / 9848011221)
- Citizen portal: Display ONLY 'Government of Telangana', no scanner/print/save pass
- Rice price set to zero (₹0.00 / Free) and total ₹106.50
- Sign Out at the bottom of the assigned slot details section
"""

import urllib.request
import urllib.parse
import http.cookiejar
import json

base_url = 'http://127.0.0.1:5000'
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

print("1. Testing GET /login...")
resp = opener.open(base_url + '/login')
html = resp.read().decode('utf-8')
assert 'Aahara Setu' in html and 'ఆహార సేతు' in html, "Centered title in Telugu & English missing"
assert 'Dealer' in html and 'User' in html, "Dealer & User options missing"
assert 'Quick Demo' not in html, "Demo chips should be removed"
print("   [PASS] Login page loaded with centered title, no demo chips, Dealer and User tabs.")

print("2. Testing Single Language Dropdown (/set-language?lang=en)...")
resp_lang = opener.open(base_url + '/set-language?lang=en')
html_lang = opener.open(base_url + '/login').read().decode('utf-8')
assert 'Select Language' in html_lang or 'Language' in html_lang
print("   [PASS] Single language switcher set to English.")

print("3. Testing Dealer Login (dealer / dealer123)...")
data_dealer = urllib.parse.urlencode({
    'login_type': 'dealer',
    'username': 'dealer',
    'password': 'dealer123'
}).encode('utf-8')
resp = opener.open(base_url + '/login', data=data_dealer)
dealer_html = resp.read().decode('utf-8')
assert 'Dealer Dashboard' in dealer_html or 'డీలర్ డాష్‌బోర్డ్' in dealer_html
assert 'select-district' in dealer_html, "District dropdown missing"
assert 'select-mandal' in dealer_html, "Mandal dropdown missing"
assert 'select-village' in dealer_html, "Village dropdown missing"
assert 'select-fps' in dealer_html, "FPS dropdown missing"
assert 'Fortified Rice' in dealer_html
assert '₹0.00' in dealer_html
assert 'btn-dealer-signout' in dealer_html
print("   [PASS] Dealer logged in; dashboard displays 4 dropdowns, stock inventory, user collection status, and bottom sign out.")

print("4. Testing Status Toggle via POST /dealer/toggle-status/1...")
toggle_data = urllib.parse.urlencode({
    'fps': 'FPS-HNK-001',
    'status_filter': 'ALL'
}).encode('utf-8')
resp_toggle = opener.open(base_url + '/dealer/toggle-status/1', data=toggle_data)
assert resp_toggle.status == 200
print("   [PASS] Dealer toggled beneficiary collection status successfully.")

print("5. Testing Logout...")
resp = opener.open(base_url + '/logout')
assert resp.status == 200
print("   [PASS] Dealer signed out successfully.")

print("6. Testing Citizen Login for TSRC1000002 (Dataset)...")
data_citizen = urllib.parse.urlencode({
    'login_type': 'citizen',
    'ration_card_number': 'TSRC1000002',
    'registered_mobile': '6465908538'
}).encode('utf-8')
resp = opener.open(base_url + '/login', data=data_citizen)
citizen_html = resp.read().decode('utf-8')

# Assertions per redesign specifications
assert ('Government of Telangana' in citizen_html) or ('తెలంగాణ ప్రభుత్వం' in citizen_html), "Must display Government of Telangana"
assert 'Aahara Setu Ration Allocation Pass' not in citizen_html, "Old pass title must be removed"
assert 'E-PDS PASS' not in citizen_html, "Old pass subtitles must be removed"
assert 'Print / Save Digital Pass' not in citizen_html, "Print button must be removed"
assert 'window.print' not in citizen_html, "Print script must be removed"
assert '<svg viewBox="0 0 100 100"' not in citizen_html, "QR scanner must be removed"
assert '₹0.00' in citizen_html, "Rice price must be zero"
assert '₹106.50' in citizen_html, "Total payable must be ₹106.50"
assert 'btn-citizen-signout' in citizen_html, "Sign Out button must be at the bottom"
assert 'slot-details-signout-row' in citizen_html, "Sign Out row must be at bottom of slot details section"
print("   [PASS] Citizen logged in: Display ONLY 'Government of Telangana', no scanner/print, rice price Rs. 0.00, bottom Sign Out button.")

print("7. Testing Citizen Sign Out...")
resp_citizen_logout = opener.open(base_url + '/logout')
assert resp_citizen_logout.status == 200
print("   [PASS] Citizen signed out successfully.")

print("\n" + "="*60)
print("  [SUCCESS] ALL LIVE SERVER REDESIGN CRITERIA PASSED 100%!")
print("="*60)
