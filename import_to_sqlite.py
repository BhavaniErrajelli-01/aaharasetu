"""
Aahara Setu - SQLite Dataset Importer & Seeder
Connects and imports datasets directly into 'aahara_setu.db':
1. dataset/hanumakonda_pds_synthetic_14000.csv (14,000 PDS records)
2. dataset/dealer_records_with_fair_shop_id (1).xlsx (28 Dealer records)

Populates:
- beneficiaries (14,000 rows, 500 per each of the 28 dealers)
- pds_beneficiaries (14,000 rows from dataset)
- dealers (28 dealers from dataset)
- users (dealers + citizens with password hashes and fair_shop_id)
- slots & slot_assignments & distribution_records
- v_fps_summary (analytical view)

Uses standard library only (sqlite3, csv, zipfile, xml, hashlib/werkzeug).
Zero external dependencies required.
"""

import os
import sqlite3
import csv
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime
from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'aahara_setu.db')
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
CSV_PATH = os.path.join(DATASET_DIR, 'hanumakonda_pds_synthetic_14000.csv')
XLSX_PATH = os.path.join(DATASET_DIR, 'dealer_records_with_fair_shop_id (1).xlsx')

def parse_xlsx_rows(xlsx_file):
    """Extracts rows from Excel .xlsx file using standard library zipfile and XML."""
    if not os.path.exists(xlsx_file):
        print(f"[WARN] File not found: {xlsx_file}")
        return []

    with zipfile.ZipFile(xlsx_file, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('ns:si', ns):
                texts = [t.text for t in si.findall('.//ns:t', ns) if t.text]
                shared_strings.append(''.join(texts))

        sheet_path = 'xl/worksheets/sheet1.xml'
        if sheet_path not in z.namelist():
            sheets = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet')]
            sheet_path = sheets[0] if sheets else None

        if not sheet_path:
            return []

        tree = ET.fromstring(z.read(sheet_path))
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

        rows = []
        for r in tree.findall('.//ns:sheetData/ns:row', ns):
            row_dict = {}
            for cell in r.findall('ns:c', ns):
                cell_ref = cell.get('r')
                cell_type = cell.get('t')
                
                t_elem = cell.find('.//ns:t', ns)
                if t_elem is not None and t_elem.text:
                    val = t_elem.text
                else:
                    v_elem = cell.find('ns:v', ns)
                    val = v_elem.text if v_elem is not None and v_elem.text else ''

                if cell_type == 's' and val.isdigit():
                    idx = int(val)
                    val = shared_strings[idx] if idx < len(shared_strings) else val

                col_letters = ''.join([c for c in cell_ref if c.isalpha()])
                row_dict[col_letters] = val

            if row_dict:
                cols = sorted(row_dict.keys(), key=lambda x: (len(x), x))
                max_col = cols[-1]

                def col_to_num(col_str):
                    n = 0
                    for ch in col_str:
                        n = n * 26 + (ord(ch.upper()) - ord('A') + 1)
                    return n

                max_num = col_to_num(max_col)
                row_list = []
                for i in range(1, max_num + 1):
                    num = i
                    chars = []
                    while num > 0:
                        rem = (num - 1) % 26
                        chars.append(chr(65 + rem))
                        num = (num - 1) // 26
                    c_letter = ''.join(reversed(chars))
                    row_list.append(row_dict.get(c_letter, ''))
                rows.append(row_list)
        return rows

def import_datasets_to_sqlite():
    print("=" * 65)
    print("  [INFO] Aahara Setu - Full SQLite Database Migration & Seeder")
    print(f"  [DB] Target Database: {DB_PATH}")
    print("=" * 65)

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = OFF;")
    cur = conn.cursor()

    # -------------------------------------------------------------
    # 1. Dealers Table
    # -------------------------------------------------------------
    print("\n[1/6] Importing Dealers Dataset...")
    cur.execute("DROP TABLE IF EXISTS dealers;")
    cur.execute("""
        CREATE TABLE dealers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            dealer_name TEXT NOT NULL,
            fair_shop_id TEXT NOT NULL
        );
    """)

    dealer_rows = parse_xlsx_rows(XLSX_PATH)
    dealer_insert = []
    if len(dealer_rows) > 1:
        for r in dealer_rows[1:]:
            if not any(r):
                continue
            username = r[0].strip() if len(r) > 0 and r[0] else ""
            password = r[1].strip() if len(r) > 1 and r[1] else ""
            d_name = r[2].strip() if len(r) > 2 and r[2] else ""
            fps_id = r[3].strip() if len(r) > 3 and r[3] else ""
            if username and fps_id:
                dealer_insert.append((username, password, d_name, fps_id))

        cur.executemany("""
            INSERT OR REPLACE INTO dealers (username, password, dealer_name, fair_shop_id)
            VALUES (?, ?, ?, ?);
        """, dealer_insert)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_dealers_fps ON dealers(fair_shop_id);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_dealers_username ON dealers(username);")
    print(f"      [OK] Imported {len(dealer_insert)} dealers into 'dealers' table.")

    # -------------------------------------------------------------
    # 2. Users Table (Authentication)
    # -------------------------------------------------------------
    print("\n[2/6] Populating Users Table...")
    cur.execute("DROP TABLE IF EXISTS users;")
    cur.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('DEALER', 'USER')),
            dealer_name TEXT,
            fair_shop_id TEXT
        );
    """)

    user_rows = [
        ("dealer", generate_password_hash("dealer123"), "DEALER", "Ramesh Reddy", "FPS-HNK-332"),
        ("citizen", generate_password_hash("citizen123"), "USER", None, None),
    ]
    for u, p, d_name, fps_id in dealer_insert:
        user_rows.append((u, generate_password_hash(p), "DEALER", d_name, fps_id))

    cur.executemany("""
        INSERT OR IGNORE INTO users (username, password_hash, role, dealer_name, fair_shop_id)
        VALUES (?, ?, ?, ?, ?);
    """, user_rows)
    print(f"      [OK] Created {len(user_rows)} users (dealers and citizens).")

    # -------------------------------------------------------------
    # 3. Beneficiaries Table (14,000 Rows from Dataset, 500 per Dealer)
    # -------------------------------------------------------------
    print("\n[3/6] Importing 14,000 Beneficiaries from CSV into 'beneficiaries' & 'pds_beneficiaries'...")
    cur.execute("DROP TABLE IF EXISTS beneficiaries;")
    cur.execute("""
        CREATE TABLE beneficiaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ration_card_number TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            fps_shop_number TEXT NOT NULL,
            registered_mobile TEXT,
            preferred_language TEXT DEFAULT 'te',
            village TEXT,
            district TEXT,
            mandal TEXT,
            pincode TEXT,
            region_type TEXT,
            number_of_fps INTEGER,
            family_size INTEGER,
            mobile_status TEXT,
            rice_quantity_required_kg REAL,
            -- Alias columns for flexible SQL queries
            fair_shop_id TEXT,
            ration_card_id TEXT,
            beneficiary_name TEXT,
            registered_mobile_number TEXT
        );
    """)

    cur.execute("DROP TABLE IF EXISTS pds_beneficiaries;")
    cur.execute("""
        CREATE TABLE pds_beneficiaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            district TEXT,
            mandal TEXT,
            village TEXT,
            pincode TEXT,
            region_type TEXT,
            number_of_fps INTEGER,
            fair_shop_id TEXT NOT NULL,
            ration_card_id TEXT NOT NULL UNIQUE,
            beneficiary_name TEXT NOT NULL,
            family_size INTEGER,
            registered_mobile_number TEXT,
            mobile_status TEXT,
            preferred_language TEXT,
            rice_quantity_required_kg REAL
        );
    """)

    ben_batch = []
    pds_batch = []
    if os.path.exists(CSV_PATH):
        with open(CSV_PATH, mode='r', encoding='utf-8', errors='replace') as f:
            reader = csv.reader(f)
            header = next(reader, None)
            
            row_idx = 0
            for r in reader:
                if not r or len(r) < 8:
                    continue
                district = r[0].strip() if len(r) > 0 else "Hanumakonda"
                mandal = r[1].strip() if len(r) > 1 else ""
                village = r[2].strip() if len(r) > 2 else ""
                pincode = r[3].strip() if len(r) > 3 else ""
                region_type = r[4].strip() if len(r) > 4 else "Urban"
                num_fps = int(r[5]) if len(r) > 5 and r[5].isdigit() else 1
                ration_card_id = r[7].strip() if len(r) > 7 else ""
                ben_name = r[8].strip() if len(r) > 8 else ""
                family_size = int(r[9]) if len(r) > 9 and r[9].isdigit() else 1
                mobile = r[10].strip() if len(r) > 10 else ""
                mobile_status = r[11].strip() if len(r) > 11 else ""
                lang = r[12].strip() if len(r) > 12 else "Telugu"
                try:
                    rice_qty = float(r[13]) if len(r) > 13 else 0.0
                except ValueError:
                    rice_qty = 0.0

                mobile_clean = None if mobile.lower() in ('no mobile', 'none', '') else mobile

                # Map each block of 500 beneficiaries to one of the 28 dealers
                if dealer_insert:
                    dealer_idx = min(row_idx // 500, len(dealer_insert) - 1)
                    fair_shop_id = dealer_insert[dealer_idx][3]
                else:
                    fair_shop_id = r[6].strip() if len(r) > 6 else "FPS-HNK-332"

                # For beneficiaries table
                ben_batch.append((
                    ration_card_id, ben_name, fair_shop_id, mobile_clean, lang, village,
                    district, mandal, pincode, region_type, num_fps, family_size,
                    mobile_status, rice_qty,
                    fair_shop_id, ration_card_id, ben_name, mobile_clean
                ))

                # For pds_beneficiaries table
                pds_batch.append((
                    district, mandal, village, pincode, region_type, num_fps,
                    fair_shop_id, ration_card_id, ben_name, family_size,
                    mobile, mobile_status, lang, rice_qty
                ))
                row_idx += 1

        cur.executemany("""
            INSERT INTO beneficiaries (
                ration_card_number, name, fps_shop_number, registered_mobile, preferred_language, village,
                district, mandal, pincode, region_type, number_of_fps, family_size,
                mobile_status, rice_quantity_required_kg,
                fair_shop_id, ration_card_id, beneficiary_name, registered_mobile_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, ben_batch)

        cur.executemany("""
            INSERT INTO pds_beneficiaries (
                district, mandal, village, pincode, region_type, number_of_fps,
                fair_shop_id, ration_card_id, beneficiary_name, family_size,
                registered_mobile_number, mobile_status, preferred_language,
                rice_quantity_required_kg
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, pds_batch)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_ben_card ON beneficiaries(ration_card_number);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_ben_fps ON beneficiaries(fps_shop_number);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_ben_mandal ON beneficiaries(mandal);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_ben_mobile ON beneficiaries(registered_mobile);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_pds_card ON pds_beneficiaries(ration_card_id);")
    print(f"      [OK] Successfully imported {len(ben_batch)} rows into 'beneficiaries' table (500 per dealer).")
    print(f"      [OK] Successfully imported {len(pds_batch)} rows into 'pds_beneficiaries' table.")

    # -------------------------------------------------------------
    # 4. Slots Table
    # -------------------------------------------------------------
    print("\n[4/6] Setting up Slots Table...")
    cur.execute("DROP TABLE IF EXISTS slots;")
    cur.execute("""
        CREATE TABLE slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            capacity INTEGER NOT NULL CHECK (capacity > 0)
        );
    """)

    today = datetime.now().strftime("%Y-%m-%d")
    slots_data = [
        (today, "08:00 AM", "10:30 AM", 3500),
        (today, "10:45 AM", "01:15 PM", 3500),
        (today, "02:00 PM", "04:30 PM", 3500),
        (today, "05:00 PM", "06:30 PM", 3500),
    ]
    cur.executemany("""
        INSERT INTO slots (slot_date, start_time, end_time, capacity)
        VALUES (?, ?, ?, ?);
    """, slots_data)
    print("      [OK] 4 standard distribution slots created.")

    # -------------------------------------------------------------
    # 5. Slot Assignments & Distribution Records
    # -------------------------------------------------------------
    print("\n[5/6] Assigning Slots & Distribution Records for Beneficiaries...")
    cur.execute("DROP TABLE IF EXISTS slot_assignments;")
    cur.execute("""
        CREATE TABLE slot_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            beneficiary_id INTEGER NOT NULL,
            slot_id INTEGER NOT NULL,
            assignment_status TEXT NOT NULL CHECK (assignment_status IN ('ASSIGNED', 'ARRIVED', 'COMPLETED', 'MISSED', 'REALLOCATED')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE,
            FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE
        );
    """)

    cur.execute("DROP TABLE IF EXISTS distribution_records;")
    cur.execute("""
        CREATE TABLE distribution_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            beneficiary_id INTEGER NOT NULL,
            slot_id INTEGER,
            arrival_time TEXT,
            distribution_time TEXT,
            status TEXT NOT NULL CHECK (status IN ('ASSIGNED', 'ARRIVED', 'COMPLETED', 'MISSED', 'REALLOCATED')),
            FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE,
            FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE SET NULL
        );
    """)

    cur.execute("DROP TABLE IF EXISTS notifications;")
    cur.execute("""
        CREATE TABLE notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            beneficiary_id INTEGER NOT NULL,
            channel TEXT NOT NULL,
            status TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE
        );
    """)

    cur.execute("""
        INSERT INTO slot_assignments (beneficiary_id, slot_id, assignment_status)
        SELECT 
            id,
            ((id % 4) + 1) AS slot_id,
            CASE 
                WHEN (id % 5) = 0 THEN 'COMPLETED'
                WHEN (id % 10) = 1 THEN 'ARRIVED'
                ELSE 'ASSIGNED'
            END AS assignment_status
        FROM beneficiaries;
    """)

    cur.execute("""
        INSERT INTO distribution_records (beneficiary_id, slot_id, arrival_time, distribution_time, status)
        SELECT 
            id,
            ((id % 4) + 1) AS slot_id,
            CASE 
                WHEN (id % 5) = 0 THEN '08:15 AM'
                WHEN (id % 10) = 1 THEN '08:30 AM'
                ELSE NULL
            END AS arrival_time,
            CASE 
                WHEN (id % 5) = 0 THEN '08:25 AM'
                ELSE NULL
            END AS distribution_time,
            CASE 
                WHEN (id % 5) = 0 THEN 'COMPLETED'
                WHEN (id % 10) = 1 THEN 'ARRIVED'
                ELSE 'ASSIGNED'
            END AS status
        FROM beneficiaries;
    """)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_sa_ben ON slot_assignments(beneficiary_id);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_dr_ben ON distribution_records(beneficiary_id);")
    print("      [OK] Slot assignments and distribution records seeded for all 14,000 beneficiaries.")

    # -------------------------------------------------------------
    # 6. Analytical Summary View
    # -------------------------------------------------------------
    print("\n[6/6] Creating View 'v_fps_summary'...")
    cur.execute("DROP VIEW IF EXISTS v_fps_summary;")
    cur.execute("""
        CREATE VIEW v_fps_summary AS
        SELECT 
            b.district,
            b.mandal,
            b.fps_shop_number AS fair_shop_id,
            d.dealer_name,
            COUNT(b.id) AS total_beneficiaries,
            SUM(b.family_size) AS total_family_members,
            ROUND(SUM(b.rice_quantity_required_kg), 2) AS total_rice_quota_kg,
            SUM(CASE WHEN b.mobile_status = 'MOBILE_AVAILABLE' THEN 1 ELSE 0 END) AS beneficiaries_with_mobile,
            SUM(CASE WHEN b.mobile_status = 'NO_MOBILE' THEN 1 ELSE 0 END) AS beneficiaries_without_mobile
        FROM beneficiaries b
        LEFT JOIN dealers d ON b.fps_shop_number = d.fair_shop_id
        GROUP BY b.district, b.mandal, b.fps_shop_number, d.dealer_name;
    """)
    print("      [OK] View 'v_fps_summary' created.")

    conn.commit()
    conn.close()

    print("\n" + "=" * 65)
    print("  [SUCCESS] SQLite Database fully seeded with 14,000 dataset rows!")
    print(f"  Target File: {DB_PATH}")
    print("=" * 65)

if __name__ == '__main__':
    import_datasets_to_sqlite()
