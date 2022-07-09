import axios from "axios";

const baseURL = "https://testnets-api.opensea.io/api/v1";

export const fetchAssets = (params) =>
  axios.get(`${baseURL}/assets`, { params });
