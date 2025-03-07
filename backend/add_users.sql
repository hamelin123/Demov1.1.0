-- สร้างผู้ใช้ประเภทต่างๆ
-- หมายเหตุ: รหัสผ่าน bcrypt hash แทน 'Super123!', 'Admin2023!', 'Staff2023!', 'User2023!'

-- ตรวจสอบว่ามีผู้ใช้ superadmin แล้วหรือไม่
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'superadmin') THEN
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
          'a47ac10b-58cc-4372-a567-0e02b2c3d480', -- UUID แตกต่างจากเดิม
          'superadmin',
          'superadmin2@coldchain.com',
          '$2b$10$mw86teRMwkNhwkpxmO5qAOWKwR1J5LUWd0tcPfH9Pf1NQ9F0hXn3m', -- Super123!
          'Super Administrator',
          'superadmin',
          '+66891234567',
          'HQ Office, Bangkok, Thailand',
          NOW(),
          NOW()
        );
    END IF;
END $$;

-- ตรวจสอบว่ามีผู้ใช้ admin2 แล้วหรือไม่
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin2') THEN
        -- Admin2
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
          'b47ac10b-58cc-4372-a567-0e02b2c3d481', -- UUID แตกต่างจากเดิม
          'admin2',
          'admin2@coldchain.com',
          '$2b$10$cN.RkcgwbReF3K62Lq7pXOtJP7ArVcYjPQBnPAYnKRk/cBSqRJF2O', -- Admin2023!
          'Secondary Admin',
          'admin',
          '+66892345678',
          'Branch Office, Chiang Mai, Thailand',
          NOW(),
          NOW()
        );
    END IF;
END $$;

-- ตรวจสอบว่ามีผู้ใช้ staff1 แล้วหรือไม่
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'staff1') THEN
        -- Staff1
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
          'c47ac10b-58cc-4372-a567-0e02b2c3d482', -- UUID แตกต่างจากเดิม
          'staff1',
          'staff1@coldchain.com',
          '$2b$10$HSvbRJc8XDdB5THCuQvwm.Z7eObhJPJlqDmdOgSIcB6OIGme9hbxa', -- Staff2023!
          'Staff Member 1',
          'staff',
          '+66893456789',
          'Warehouse A, Bangkok, Thailand',
          NOW(),
          NOW()
        );
    END IF;
END $$;

-- ตรวจสอบว่ามีผู้ใช้ staff2 แล้วหรือไม่
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'staff2') THEN
        -- Staff2
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
          'd47ac10b-58cc-4372-a567-0e02b2c3d483', -- UUID แตกต่างจากเดิม
          'staff2',
          'staff2@coldchain.com',
          '$2b$10$HSvbRJc8XDdB5THCuQvwm.Z7eObhJPJlqDmdOgSIcB6OIGme9hbxa', -- Staff2023!
          'Staff Member 2',
          'staff',
          '+66894567890',
          'Warehouse B, Chiang Mai, Thailand',
          NOW(),
          NOW()
        );
    END IF;
END $$;

-- ตรวจสอบว่ามีผู้ใช้ customer1 แล้วหรือไม่
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'customer1') THEN
        -- Customer1
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
          'e47ac10b-58cc-4372-a567-0e02b2c3d484', -- UUID แตกต่างจากเดิม
          'customer1',
          'customer1@example.com',
          '$2b$10$UdUXyXW0q2VrQoGEidxXHefcR0r1L3/Y/CHFJ2QL5.lkSTBJL9g9m', -- User2023!
          'Customer 1',
          'user',
          '+66895678901',
          'Customer Address 1, Bangkok, Thailand',
          NOW(),
          NOW()
        );
    END IF;
END $$;