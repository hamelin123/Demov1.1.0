// mockUser.ts แก้ไขใหม่
let users = [];

export const UserModel = {
  create: async (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  findById: async (id) => {
    return users.find(user => user.id === id) || null;
  },
  findByEmail: async (email) => {
    return users.find(user => user.email === email) || null;
  },
  findByUsername: async (username) => {
    return users.find(user => user.username === username) || null;
  },
  findAll: async (limit = 50, offset = 0) => {
    return users.slice(offset, offset + limit);
  },
  validateCredentials: async (email, password) => {
    // สำหรับ mock ตรวจสอบง่ายๆ
    const user = users.find(user => user.email === email);
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  },
  update: async (id, userData) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }
    users[index] = { ...users[index], ...userData, updated_at: new Date() };
    return users[index];
  },
  delete: async (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    users.splice(index, 1);
    return true;
  }
};