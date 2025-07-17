-- Create admin user for testing
-- Email: zulufingniner999@zuluniner.com
-- Password: n0Tas4nd!ch

-- This user will be created with a specific UUID for consistency
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '12345678-1234-1234-1234-123456789abc'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'zulufingniner999@zuluniner.com',
    '$2a$10$K8Y1NJYX4LKZ1VN1H5GGZeWX9vC5K5vgdGO2Z3LQZ3J2XDCZD7XUW', -- Pre-hashed password for 'n0Tas4nd!ch'
    NOW(),
    NOW(),
    NOW(),
    '{"name": "ZuluNiner Admin"}',
    '{}',
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Create the corresponding user profile
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    '12345678-1234-1234-1234-123456789abc'::uuid,
    'ZuluNiner Admin',
    'zulufingniner999@zuluniner.com',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;