import axios from "axios";

const BASE_URL = "https://reeltalk-capstone.onrender.com";

export async function registerUser(userData) {
  try {
    const response = await axios.post(BASE_URL + "/users", userData);

    const data = response.data;
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Signup failed" };
    }
  }
}

export async function loginUser(loginData) {
  try {
    const response = await axios.post(BASE_URL + "/login", loginData);

    const data = response.data;
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Login failed" };
    }
  }
}
