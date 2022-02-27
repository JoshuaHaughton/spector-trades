import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API
    ? `${process.env.NEXT_PUBLIC_BACKEND_API}/api`
    : `http://localhost:3001/api/`,
});
