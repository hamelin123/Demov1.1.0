-- สร้างผู้ใช้ประเภทต่างๆ
-- หมายเหตุ: รหัสผ่าน bcrypt hash แทน 'Admin@123', 'Staff@123', 'User@123', และ 'Super@123'

-- Superadmin
INSERT INTO users (
  id, 
  username, 
  email, 
  password, 
  full_name, 
  role, 
  phone_number, 
  address, 
  created_at, 
  updated_at
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Superadmin UUID
  'superadmin',
  'superadmin@coldchain.com',
  '$2b$10$mRUmAYYdlvCV5Gbk0AAdxuQKvEPQMHAUDpW4q.xVHpMgx6tWb4N0e', -- Super@123
  'Super Admin',
  'superadmin',
  '+66812345678',
  'Superadmin Address, Bangkok, Thailand',
  NOW(),
  NOW()
);

-- Admin
INSERT INTO users (
  id, 
  username, 
  email, 
  password, 
  full_name, 
  role, 
  phone_number, 
  address, 
  created_at, 
  updated_at
) VALUES (
  'e47ac10b-58cc-4372-a567-0e02b2c3d478', -- Admin UUID
  'admin',
  'admin@coldchain.com',
  '$2b$10$rSLzS71gVGiGxy2sK1iVwek3qiTnJKwXKV7jK6OvLN6d1PLDkfmNu', -- Admin@123
  'Admin User',
  'admin',
  '+66823456789',
  'Admin Address, Bangkok, Thailand',
  NOW(),
  NOW()
);

-- Staff
INSERT INTO users (
  id, 
  username, 
  email, 
  password, 
  full_name, 
  role, 
  phone_number, 
  address, 
  created_at, 
  updated_at
) VALUES (
  'd47ac10b-58cc-4372-a567-0e02b2c3d477', -- Staff UUID
  'staff',
  'staff@coldchain.com',
  '$2b$10$zCcZpKE0.GuQFAZKP5J1l.qJ0BL4H8YQrTvT6W63tFpnPuu9a8aPu', -- Staff@123
  'Staff User',
  'staff',
  '+66834567890',
  'Staff Address, Bangkok, Thailand',
  NOW(),
  NOW()
);

-- Regular User
INSERT INTO users (
  id, 
  username, 
  email, 
  password, 
  full_name, 
  role, 
  phone_number, 
  address, 
  created_at, 
  updated_at
) VALUES (
  'c47ac10b-58cc-4372-a567-0e02b2c3d476', -- User UUID
  'user',
  'user@coldchain.com',
  '$2b$10$mELRwLFzCqXTtLKYgQeqPeNJ1eyvCGwbT9sX.xg9o9IAHdFpX3vdC', -- User@123
  'Regular User',
  'user',
  '+66845678901',
  'User Address, Bangkok, Thailand',
  NOW(),
  NOW()
);