import axios from './axios';

// ===============================
// GET ALL EXPIRY BATCHES
// GET /expiry
// ===============================
export const getExpiryBatches = async () => {
  return await axios.get('/expiry');
};

// ===============================
// GET SINGLE BATCH
// GET /expiry/{batchId}
// ===============================
export const getExpiryById = async (batchId: string) => {
  return await axios.get(`/expiry/${batchId}`);
};

// ===============================
// MARK EXPIRED
// POST /expiry/mark-expired/{batchId}
// ===============================
export const markExpired = async (batchId: string) => {
  return await axios.post(`/expiry/mark-expired/${batchId}`);
};

// ===============================
// RETURN TO VENDOR
// POST /expiry/return-to-vendor/{batchId}
// ===============================
export const returnToVendor = async (batchId: string) => {
  return await axios.post(`/expiry/return-to-vendor/${batchId}`);
};

// ===============================
// APPROVE RETURN
// POST /expiry/approve/{batchId}
// ===============================
export const approveReturn = async (batchId: string) => {
  return await axios.post(`/expiry/approve/${batchId}`);
};

// ===============================
// COMPLETE RETURN
// POST /expiry/complete/{batchId}
// ===============================
export const completeReturn = async (batchId: string) => {
  return await axios.post(`/expiry/complete/${batchId}`);
};