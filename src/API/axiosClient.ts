import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
       console.log("Phiên đăng nhập hết hạn hoặc chưa đăng nhập");
    }
    return Promise.reject(error);
  }
);
export default axiosClient;