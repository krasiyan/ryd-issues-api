export const API_PORT = 1337;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
export const DB_NAME = process.env.DB_NAME || "ryd_issues";
export const DB_USER = process.env.DB_USER || "devuser";
export const DB_PASS = process.env.DB_PASS || "devpassword";
