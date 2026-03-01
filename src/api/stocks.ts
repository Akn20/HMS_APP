import axios from './axios'; 
// make sure this is your configured axios instance
// with baseURL + auth token interceptor

// ===============================
// GET ALL STOCK
// GET /pharmacy/stock
// ===============================
export const getStock = async () => {
  return await axios.get('/pharmacy/stock');
};

// ===============================
// GET LOW STOCK
// GET /pharmacy/stock/low
// ===============================
export const getLowStock = async () => {
  return await axios.get('/pharmacy/stock/low');
};

// ===============================
// GET SINGLE STOCK
// GET /pharmacy/stock/{id}
// ===============================
export const getStockById = async (id: string) => {
  return await axios.get(`/pharmacy/stock/${id}`);
};

// ===============================
// CREATE STOCK
// POST /pharmacy/stock
// ===============================
export const createStock = async (data: any) => {
  return await axios.post('/pharmacy/stock', data);
};

// ===============================
// UPDATE STOCK
// PUT /pharmacy/stock/{id}
// ===============================
export const updateStock = async (id: string, data: any) => {
  return await axios.put(`/pharmacy/stock/${id}`, data);
};

// ===============================
// SOFT DELETE
// DELETE /pharmacy/stock/{id}
// ===============================
export const deleteStock = async (id: string) => {
  return await axios.delete(`/pharmacy/stock/${id}`);
};

// ===============================
// GET TRASH
// GET /pharmacy/stock-trash
// ===============================
export const getDeletedStock = async () => {
  return await axios.get('/pharmacy/stock-trash');
};

// ===============================
// RESTORE STOCK
// POST /pharmacy/stock-restore/{id}
// ===============================
export const restoreStock = async (id: string) => {
  return await axios.post(`/pharmacy/stock-restore/${id}`);
};

// ===============================
// PERMANENT DELETE
// DELETE /pharmacy/stock-force-delete/{id}
// ===============================
export const permanentlyDeleteStock = async (id: string) => {
  return await axios.delete(`/pharmacy/stock-force-delete/${id}`);
};