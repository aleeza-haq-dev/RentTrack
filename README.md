# RentTrack — Minimalist Landlord SaaS

A complete minimalist SaaS web application built for independent landlords to manage rental properties, multi-unit buildings, tenants, monthly rent collections, and payment history.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Minimalist monochrome palette, slate/zinc, emerald accents, dark & light mode)
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security for multi-landlord data isolation)
- **Icons**: Lucide React
- **Offline / Local Mode**: Built-in fallback that stores landlord data in persistent browser storage if Supabase credentials are not configured yet, ensuring instant live preview and testing.

---

## 📋 Features

### 1. Landing Page
- Modern SaaS hero section with headline and product summary
- Interactive dashboard mockup preview
- Feature showcase: Properties & Units, Tenant Leases, Rent Collections, Due Date Reminders, PostgreSQL RLS
- "Get Started" and "Login" options + "Explore Live Demo" 1-click test access

### 2. Authentication & Data Isolation
- Email & password signup and sign in
- Landlord session persistence
- Landlord data isolation: each landlord can only see and manage their own properties, units, tenants, and payments
- Instant 1-Click Demo Login option for testing without manual sign up

### 3. Dashboard
- **Portfolio & Occupancy**: Total properties, total units, occupied units, vacant units, and occupancy rate percentage
- **Rent Performance**: Expected monthly rent, collected rent, pending rent, and overdue rent
- **Recent Payments**: Real-time table of recent collections with status badges and dates
- **Upcoming Due Dates**: Tenant-by-tenant rent schedule with 1-click "+ Record" payment action

### 4. Properties & Units
- Add, edit, and delete properties (with confirmation modal)
- Property types: Single Family, Multi-Family / Duplex, Apartment Building, Condo, Commercial
- Nested unit management: Add unit number, monthly rent, bedrooms, bathrooms, and occupancy
- Filter properties by type and search by property name or street address

### 5. Tenants & Leases
- Register tenants and assign them to specific property units (automatically marks units as occupied)
- Stores tenant name, email, phone, lease start date, lease end date, monthly rent amount, rent due day (e.g. 1st, 5th)
- Tenant Details Modal: view complete contact info, lease terms, and full historical payment ledger for that tenant
- Search tenants by name, unit, phone, or filter by active/inactive leases

### 6. Rent Management & Collections
- Record monthly rent payments: select tenant (auto-fills property/unit and rent amount)
- Select payment month/year, payment date, due date, payment method (Bank Transfer, Zelle, Venmo, Check, Cash, etc.), and reference notes
- Automatically calculates payment status: **Paid**, **Pending**, or **Overdue** based on due date vs current date
- Full payment ledger with status filter tabs (All, Paid, Pending, Overdue)
- Month/Year selector filter
- **Export to CSV**: 1-click export of payment records

### 7. In-App Notifications & Reminders
- **Overdue Rent**: Highlights tenants who haven't paid and are past their due date
- **Due Soon**: Tenants with rent due within the next 5 days
- **Pending Rent**: Scheduled rent for the active month
- **Lease Expiration Alerts**: Alerts for leases ending in the next 60 days
- Direct "Record Payment" button inside each reminder card

### 8. Landlord Settings
- Update landlord name, phone, company name, and currency symbol ($, €, £, CAD $, AUD $, INR ₹)
- Supabase connection settings (Project URL & Anon Key)
- Data backup: Export all data to JSON
- Reset demo sample data option

---

## 🗄️ Database Setup (Supabase PostgreSQL)

The repository includes a ready-to-run SQL schema file: [`supabase_schema.sql`](./supabase_schema.sql).

### Tables & Relationships:
1. **`profiles`**: Landlord profiles linked to `auth.users(id)`
2. **`properties`**: Properties owned by `landlord_id`
3. **`units`**: Units linked to `property_id` and `landlord_id`
4. **`tenants`**: Tenants linked to `property_id`, `unit_id`, and `landlord_id`
5. **`rent_payments`**: Payment records with status, method, and amounts

### Row Level Security (RLS):
Row Level Security is enabled on every table. Landlords can only query and mutate records where `auth.uid() = landlord_id`.

### To connect your own Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and paste the contents of `supabase_schema.sql`.
3. Create a `.env` file based on `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Or configure your URL and Anon Key directly in the RentTrack **Settings > Supabase Connection** tab!

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Open browser at:
# http://localhost:5173
```
