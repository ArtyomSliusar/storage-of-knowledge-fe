import axios from "axios";

const API_VERSION = "v1";

export default axios.create({
  baseURL: `http://127.0.0.1:8000/api/${API_VERSION}`
});
