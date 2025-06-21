import axios from "axios";
import { BASE_URL } from "@/utils/axios";
export const authlogin = async (email, password) => {
  const res = await axios.post(
    `${BASE_URL}/api/auth/login`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return res;
};

export const authsignup = async (email, name, password) => {
  const res = await axios.post(
    `${BASE_URL}/api/auth/signup`,
    {
      email,
      password,
      name,
    },
    { withCredentials: true }
  );
  return res;
};

export const googleLogin = async (id_token) => {
  const res = await axios.post(
    `${BASE_URL}/api/auth/googleLogin`,
    {
      id_token,
    },
    { withCredentials: true }
  );
  return res;
};

export const authlogout = async () => {
  const res = await axios.post(
    `${BASE_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res;
};
