# 🌾 Aahara Setu (ఆహార సేతు) - Flask & SQLite Platform

> **Department of Consumer Affairs, Food & Civil Supplies**  
> *Smart Public Distribution System Slot Allocation & Multimodal Communication Platform*

---

## 🛠️ Technology Stack

- **Backend:** Python / Flask
- **Database:** SQLite with Reusable Functions & PRAGMA Foreign Keys
- **Frontend:** HTML5, Vanilla CSS3, JavaScript
- **Data Visualization:** Chart.js (v4.4.1)

---

## 👥 Roles & Authentication

1. **ADMIN**: Full management of beneficiaries, slot allocation, analytical reports, and notifications.
   - **Default Credentials:** Username: `admin` | Password: `admin123` (password hashed using Werkzeug)
2. **USER (Citizen)**: Ration card holders verifying assigned slot timings, shop details, and distribution fulfillment status.
   - **Login Credentials:** Ration Card Number (e.g. `WAP07190021001`) and Registered Mobile Number (e.g. `9848011221`).

---

## 🗄️ SQLite Database Schema

The database is stored in [`aahara_setu.db`](file:///c:/Users/bhava/OneDrive/Desktop/Aahara%20Setu/aahara_setu.db) and initialized from [`schema.sql`](file:///c:/Users/bhava/OneDrive/Desktop/Aahara%20Setu/schema.sql):

### 1. `users`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `username` (TEXT UNIQUE NOT NULL)
- `password_hash` (TEXT NOT NULL)
- `role` (TEXT NOT NULL CHECK in `'ADMIN'`, `'USER'`)

### 2. `beneficiaries`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `ration_card_number` (TEXT UNIQUE NOT NULL)
- `name` (TEXT NOT NULL)
- `fps_shop_number` (TEXT NOT NULL)
- `registered_mobile` (TEXT)
- `preferred_language` (TEXT DEFAULT `'te'`)
- `village` (TEXT)

### 3. `slots`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `slot_date` (TEXT NOT NULL)
- `start_time` (TEXT NOT NULL)
- `end_time` (TEXT NOT NULL)
- `capacity` (INTEGER NOT NULL)

### 4. `slot_assignments`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `beneficiary_id` (INTEGER NOT NULL, REFERENCES `beneficiaries(id)`)
- `slot_id` (INTEGER NOT NULL, REFERENCES `slots(id)`)
- `assignment_status` (TEXT NOT NULL)

### 5. `distribution_records`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `beneficiary_id` (INTEGER NOT NULL, REFERENCES `beneficiaries(id)`)
- `slot_id` (INTEGER, REFERENCES `slots(id)`)
- `arrival_time` (TEXT)
- `distribution_time` (TEXT)
- `status` (TEXT NOT NULL)

#### 🏷️ Supported Statuses:
- `ASSIGNED`
- `ARRIVED`
- `COMPLETED`
- `MISSED`
- `REALLOCATED`

---

## 🏛️ Application Architecture & Pages

### 1. Admin Dashboard (`/dashboard`)
- Metric summary cards (Total Beneficiaries, Active Slots, Completed Distributions, Missed, Reallocated).
- Slot capacity occupancy progress bars.
- Recent distribution activity stream with quick transition actions.
- One-click triggers for **Auto-Allocating Unassigned Beneficiaries** and **Reallocating Missed Beneficiaries**.

### 2. Beneficiary Management (`/admin/beneficiaries`)
- Search by Name, Ration Card Number, or Mobile.
- Filter by Fair Price Shop and Village.
- Add new beneficiary modal, edit modal, and delete action.

### 3. Slot Allocation Management (`/admin/slots`)
- Create new slots with date, time window, and maximum capacity.
- Assign citizens to slots.
- Live status dropdown transition (`ASSIGNED` ➔ `ARRIVED` ➔ `COMPLETED`, or `MISSED` ➔ `REALLOCATED`).

### 4. Reports & Analytics Page (`/admin/reports`)
- Interactive **Chart.js** visualizations:
  1. **Distribution Status Doughnut Chart** (Completed, Arrived, Assigned, Missed, Reallocated)
  2. **Slot Capacity Utilization Bar Chart** (Capacity vs Assigned vs Completed)
  3. **Village Demographics Horizontal Bar Chart**
- Detailed slot fulfillment performance audit table.
- JSON API endpoint: `/api/reports-data`.

### 5. Notification Management (`/admin/notifications`)
- Dispatch multimodal notifications via Bilingual SMS (English/Telugu), Automated Voice IVR Calls (English/Telugu), or Village Announcement Lists.
- Chronological dispatch audit log.

### 6. Citizen Portal (`/citizen/portal`)
- Personalized Digital Ration Allocation Pass.
- Verified slot date, start/end time batch, and capacity details.
- Fair Price Shop (FPS) details (Shop Number, Dealer Name, Location, Timings).
- Live distribution status with color-coded alerts and instructions.
- Subsidized commodity quota table with subsidized rates & total payable amount.
- High-resolution security QR code for biometric e-POS scanning.
- Print pass button.

---

## 🚀 Running Locally

Start the Flask application using:
```powershell
python app.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.

### Test Credentials:
- **Admin Login:**
  - Username: `admin`
  - Password: `admin123`
- **Citizen Login (Ration Card):**
  - Card Number: `WAP07190021001`
  - Mobile Number: `9848011221` (or click any demo chip)

---

## 🧪 Automated Test Suites

Run the unit and integration test suites:
```powershell
python test_app.py
python test_live_server.py
```
Both test suites validate schema constraints, password hashing, session management, slot assignment algorithms, status transitions, and API endpoints with 100% pass rates.
