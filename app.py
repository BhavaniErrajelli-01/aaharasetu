"""
Aahara Setu - Main Flask Application
Public Distribution System Slot Allocation & Multimodal Communication Platform
"""

import os
from functools import wraps
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, flash, jsonify
)
import db

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'aahara_setu_secure_session_key_2026')

# Ensure DB connection teardown
app.teardown_appcontext(db.close_db)

# Initialize and seed database on startup
with app.app_context():
    db.init_db()

# =====================================================================
# Language Context & Switching
# =====================================================================

@app.route('/set-language', methods=['GET', 'POST'])
def set_language():
    """Sets user preferred single language: either 'en' or 'te'."""
    lang = request.args.get('lang') or request.form.get('lang') or 'en'
    if lang in ('en', 'te'):
        session['lang'] = lang
    next_url = request.referrer or url_for('index')
    return redirect(next_url)

@app.context_processor
def inject_language_context():
    lang = session.get('lang', 'en')
    return {
        'current_lang': lang,
        'is_te': (lang == 'te')
    }

# =====================================================================
# Authentication & Role Decorators
# =====================================================================

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'role' not in session:
            flash("Please log in to access this page.", "warning")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def dealer_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('role') != 'DEALER':
            flash("Dealer authorization required.", "danger")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def citizen_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('role') != 'USER':
            flash("Citizen authorization required.", "danger")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# =====================================================================
# Root & Auth Routes (Login, Logout)
# =====================================================================

@app.route('/')
def index():
    if session.get('role') == 'DEALER':
        return redirect(url_for('dealer_dashboard'))
    elif session.get('role') == 'USER':
        return redirect(url_for('citizen_portal'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login_type = request.form.get('login_type', 'citizen')

        # 1. Citizen Login (Ration Card Number & Mobile Number)
        if login_type == 'citizen':
            ration_card = request.form.get('ration_card_number', '').strip().upper()
            mobile = request.form.get('registered_mobile', '').strip()

            if not ration_card:
                flash("Please enter your Ration Card Number.", "danger")
                return redirect(url_for('login'))

            if not mobile:
                flash("Please enter your Registered Mobile Number.", "danger")
                return redirect(url_for('login'))

            ben, err = db.get_beneficiary_by_card_and_mobile(ration_card, mobile)
            if err:
                flash(err, "danger")
                return redirect(url_for('login'))

            # Set Citizen Session
            session.clear()
            session['role'] = 'USER'
            session['beneficiary_id'] = ben['id']
            session['ration_card_number'] = ben['ration_card_number']
            session['name'] = ben['name']
            session['fps_shop_number'] = ben['fps_shop_number']
            session['lang'] = session.get('lang', 'te' if str(ben.get('preferred_language')).lower().startswith('tel') else 'en')

            flash(f"Welcome, {ben['name']}! Login successful.", "success")
            return redirect(url_for('citizen_portal'))

        # 2. Dealer Login (Username & Password)
        elif login_type == 'dealer':
            username = request.form.get('username', '').strip()
            password = request.form.get('password', '').strip()

            user = db.verify_user_credentials(username, password)
            if user and user['role'] == 'DEALER':
                session.clear()
                session['role'] = 'DEALER'
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['dealer_name'] = user.get('dealer_name') or user['username']
                session['fps_shop_number'] = user.get('fair_shop_id') or 'FPS-HNK-332'
                session['lang'] = session.get('lang', 'en')

                flash(f"Welcome, {session['dealer_name']} ({user['username']})! Login successful.", "success")
                return redirect(url_for('dealer_dashboard', fps=session['fps_shop_number']))
            else:
                flash("Invalid dealer username or password.", "danger")
                return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    lang = session.get('lang', 'en')
    session.clear()
    session['lang'] = lang
    flash("You have been signed out successfully.", "info")
    return redirect(url_for('login'))

# =====================================================================
# Dealer Dashboard & Operations
# =====================================================================

@app.route('/dealer/dashboard')
@dealer_required
def dealer_dashboard():
    try:
        fps = request.args.get('fps', session.get('fps_shop_number', 'FPS-HNK-332'))
        status_filter = request.args.get('status', 'ALL')
        
        jurisdiction = db.get_dealer_jurisdiction_data()
        all_dealers = db.get_all_dealers()
        shop_data = db.get_dealer_shop_data(fps_shop_number=fps, filter_status=status_filter)
        
        return render_template('dealer_dashboard.html',
                               jurisdiction=jurisdiction,
                               all_dealers=all_dealers,
                               shop_data=shop_data,
                               current_fps=fps,
                               current_status=status_filter)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"Error: {e}", 500

@app.route('/dealer/toggle-status/<int:ben_id>', methods=['POST'])
@dealer_required
def dealer_toggle_status(ben_id):
    new_status = db.toggle_beneficiary_status(ben_id)
    fps = request.form.get('fps', 'FPS-HNK-001')
    status_filter = request.form.get('status_filter', 'ALL')
    flash(f"Beneficiary distribution status updated to {new_status}.", "success")
    return redirect(url_for('dealer_dashboard', fps=fps, status=status_filter))

@app.route('/dealer/announcement-list')
@dealer_required
def dealer_announcement_list():
    fps = request.args.get('fps', session.get('fps_shop_number', 'FPS-HNK-332'))
    announcement_data = db.get_announcement_beneficiaries(fps_shop_number=fps)
    return render_template('announcement_list.html',
                           data=announcement_data,
                           current_fps=fps)

@app.route('/api/dealer/shop-data')
@dealer_required
def api_dealer_shop_data():
    fps = request.args.get('fps', 'FPS-101')
    status_filter = request.args.get('status', 'ALL')
    data = db.get_dealer_shop_data(fps_shop_number=fps, filter_status=status_filter)
    return jsonify(data)

# =====================================================================
# User Functions: Citizen Portal
# =====================================================================

@app.route('/citizen/portal')
@citizen_required
def citizen_portal():
    ben_id = session.get('beneficiary_id')
    portal_data = db.get_citizen_slot_details(ben_id)

    if not portal_data:
        flash("No active ration record found.", "warning")
        return redirect(url_for('login'))

    return render_template('citizen_portal.html', data=portal_data)

# Aliases for admin / legacy compatibility
@app.route('/dashboard')
@dealer_required
def admin_dashboard_alias():
    return redirect(url_for('dealer_dashboard'))

# =====================================================================
# Application Entry Point
# =====================================================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("  [INFO] Aahara Setu Flask Server Running")
    print(f"  [URL] Local URL: http://127.0.0.1:{port}")
    print("  [AUTH] Dealer Login: ramesh.reddy01 / Rm4829x (or dealer / dealer123)")
    print("  [AUTH] Citizen Login: TSRC1000002 / 6465908538")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=False)
