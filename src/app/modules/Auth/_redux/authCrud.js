import axios from "axios";

export const LOGIN_URL = "users/authenticate";

export async function login(userName, password) {
  return await axios.post(LOGIN_URL, {userName, password}, {withCredentials: true});
}