import axios from './axios';

export const getNursingNotes = () => {
  return axios.get('/nursing-notes');
};

export const getNursingNoteById = (id: string) => {
  return axios.get(`/nursing-notes/${id}`);
};

export const getDeletedNursingNotes = () => {
  return axios.get('/nursing-notes/deleted');
};

export const getNursingNoteForm = (id?: string) => {
  if (id) {
    return axios.get(`/nursing-notes/form/${id}`);
  }

  return axios.get(`/nursing-notes/form`);
};

export const createNursingNote = (data: any) => {
  return axios.post('/nursing-notes', data);
};

export const updateNursingNote = (id: string, data: any) => {
  return axios.put(`/nursing-notes/${id}`, data);
};

export const deleteNursingNote = (id: string) => {
  return axios.delete(`/nursing-notes/${id}`);
};

export const restoreNursingNote = (id: string) => {
  return axios.post(`/nursing-notes/${id}/restore`);
};


export const permanentlyDeleteNursingNote = (id: string) => {
  return axios.delete(`/nursing-notes/${id}/force-delete`);
};