import axios from "axios";

export const LOGIN_URL = "users/authenticate";

export async function login(userName, password) {
  return await axios.post(LOGIN_URL, { userName, password }, { withCredentials: true });
}

export async function adLoginToken(result) {
  const response = axios.get("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${result?.accessToken}`,
    },
  })
  return response;
};

export async function adLogin(id, accessToken) {

  const response = await axios.post(
    LOGIN_URL,
    {
      id: id,
      accessToken: accessToken,
    },
    { withCredentials: true }
  );
  return response;
}
