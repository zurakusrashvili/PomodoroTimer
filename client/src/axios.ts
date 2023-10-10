import axios from "axios";

export default function axiosCreate() {
  return axios.create({
    baseURL: `https://webpomodorotimer-31e26381504d.herokuapp.com/`,
    withCredentials: true
  });
}
