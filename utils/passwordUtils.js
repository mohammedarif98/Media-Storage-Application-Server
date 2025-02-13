import bcrypt from "bcryptjs";

// ------------ Hash password --------------- 
export const hashPassword = async (password) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  return await bcrypt.hash(password, saltRounds);
};



// ------------ Compare password --------------
export const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};