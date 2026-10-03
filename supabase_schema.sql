-- ==============================================================================
-- RentTrack: Database Schema & Row Level Security (RLS) for Supabase
-- Target: PostgreSQL 14+ / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES (Landlords)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    currency VARCHAR(10) DEFAULT '$',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PROPERTIES
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    zip_code VARCHAR(20),
    property_type VARCHAR(50) DEFAULT 'Single Family', -- Single Family, Multi-Family, Apartment, Condo, Commercial
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. UNITS (Inside properties)
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    monthly_rent NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    bedrooms INTEGER DEFAULT 1,
    bathrooms NUMERIC(3, 1) DEFAULT 1.0,
    is_occupied BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TENANTS
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    monthly_rent NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rent_due_day INTEGER NOT NULL DEFAULT 1 CHECK (rent_due_day >= 1 AND rent_due_day <= 31),
    emergency_contact TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. RENT PAYMENTS
CREATE TABLE IF NOT EXISTS public.rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    month_year VARCHAR(20) NOT NULL, -- e.g. "2026-10" or "October 2026"
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_date DATE,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue', 'Partial')),
    payment_method VARCHAR(50) DEFAULT 'Bank Transfer', -- Bank Transfer, Cash, Check, Online, Zelle, Venmo, Other
    reference_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON public.properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_units_landlord ON public.units(landlord_id);
CREATE INDEX IF NOT EXISTS idx_units_property ON public.units(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_landlord ON public.tenants(landlord_id);
CREATE INDEX IF NOT EXISTS idx_tenants_unit ON public.tenants(unit_id);
CREATE INDEX IF NOT EXISTS idx_payments_landlord ON public.rent_payments(landlord_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON public.rent_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.rent_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.rent_payments(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each landlord can only see, create, update, and delete their own data!
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Properties Policies
CREATE POLICY "Landlords can view own properties"
    ON public.properties FOR SELECT
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create properties"
    ON public.properties FOR INSERT
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own properties"
    ON public.properties FOR UPDATE
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own properties"
    ON public.properties FOR DELETE
    USING (auth.uid() = landlord_id);

-- 3. Units Policies
CREATE POLICY "Landlords can view own units"
    ON public.units FOR SELECT
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create units"
    ON public.units FOR INSERT
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own units"
    ON public.units FOR UPDATE
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own units"
    ON public.units FOR DELETE
    USING (auth.uid() = landlord_id);

-- 4. Tenants Policies
CREATE POLICY "Landlords can view own tenants"
    ON public.tenants FOR SELECT
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create tenants"
    ON public.tenants FOR INSERT
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own tenants"
    ON public.tenants FOR UPDATE
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own tenants"
    ON public.tenants FOR DELETE
    USING (auth.uid() = landlord_id);

-- 5. Rent Payments Policies
CREATE POLICY "Landlords can view own rent payments"
    ON public.rent_payments FOR SELECT
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create rent payments"
    ON public.rent_payments FOR INSERT
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own rent payments"
    ON public.rent_payments FOR UPDATE
    USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own rent payments"
    ON public.rent_payments FOR DELETE
    USING (auth.uid() = landlord_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- AUTO OCCUPANCY SYNC ON TENANT INSERT / DELETE / UPDATE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.sync_unit_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    -- If a tenant is added/updated with an active unit
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        IF NEW.unit_id IS NOT NULL AND NEW.is_active = TRUE THEN
            UPDATE public.units SET is_occupied = TRUE WHERE id = NEW.unit_id;
        END IF;
    END IF;

    -- If a tenant is deleted or moved away from a unit
    IF (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.unit_id IS NOT NULL AND (NEW.unit_id IS NULL OR NEW.unit_id <> OLD.unit_id OR NEW.is_active = FALSE))) THEN
        IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE unit_id = OLD.unit_id AND is_active = TRUE AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
            UPDATE public.units SET is_occupied = FALSE WHERE id = OLD.unit_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_unit_occupancy ON public.tenants;
CREATE TRIGGER trg_sync_unit_occupancy
    AFTER INSERT OR UPDATE OR DELETE ON public.tenants
    FOR EACH ROW EXECUTE PROCEDURE public.sync_unit_occupancy();
