// @flow

import axios from "axios";
import getWeb3 from "../shared/utils/getWeb3";

const root: string = [
  process.env.REACT_APP_BACKEND_PROTOCOL, '://', process.env.REACT_APP_BACKEND_DOMAIN, ':',
  process.env.REACT_APP_BACKEND_PORT, process.env.REACT_APP_BACKEND_PATH
].join('');
const instance = axios.create({ baseURL: root });
const setup = async () => {
  web3 = await getWeb3();
};
let web3;

setup();

export const setTokenHeader = (token?: any) => {
  // get token from sessionStorage if it hasn't been provided as a function parameter
  token = token ? token : sessionStorage.getItem('token');
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    sessionStorage.setItem("token", token);
  } else {
    delete instance.defaults.headers.common["Authorization"];
    sessionStorage.clear();
  }
};

instance.interceptors.response.use(
  setTokenHeader(),
  async () => {
    const accounts = await web3.eth.getAccounts();
    const challenge = await apiCall("post", "login", { address: accounts[0] });
    const signature = await web3.eth.sign(
      web3.utils.keccak256(challenge.data.challenge),
      accounts[0]
    );
    const response = await apiCall("post", "login", { address: accounts[0], signature });
    setTokenHeader(response.data.accessToken);
    window.location.reload(true);
  }
);

export const apiCall = (method: any, path: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    return instance[method](path, data)
      .then(res => {
        return resolve(res);
      })
      .catch(err => {
        return reject(err);
      });
  });
};
