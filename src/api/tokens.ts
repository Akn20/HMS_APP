import api from "./axios";

/**************
 GET TOKENS
***************/
export const getTokens = () => {
  return api.get("/tokens");
};


/**************
 CREATE TOKEN
***************/
export const createToken = (data: any) => {
  return api.post("/tokens", data);
};


/**************
 TOKEN DETAILS
***************/
export const getTokenById = (id: string) => {
  return api.get(`/tokens/${id}`);
};


/**************
 SKIP TOKEN
***************/
export const skipToken = (id: string) => {
  return api.patch(`/tokens/${id}/skip`);
};


/**************
 COMPLETE TOKEN
***************/
export const completeToken = (id: string) => {
  return api.patch(`/tokens/${id}/complete`);
};


/**************
 REASSIGN TOKEN
***************/
export const reassignToken = (id: string, doctor_id: string) => {
  return api.patch(`/tokens/${id}/reassign`, {
    doctor_id
  });
};


/**************
 GET DOCTORS
***************/
export const getDoctors = () => {
  return api.get("/doctors");
};


/**************
 GET APPOINTMENTS
***************/
export const getAppointments = () => {
  return api.get("/appointments");
};