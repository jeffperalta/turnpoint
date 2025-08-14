import axios, { AxiosInstance } from 'axios';
import { getSessionToken } from '../utility/SessionUtil';

export class BaseService {
  private BASE_URL = process.env.REACT_APP_API_BASE_URL;
  protected api: AxiosInstance;

  constructor(resourceURL: string) {
    this.api = axios.create({
      baseURL: this.BASE_URL+resourceURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to inject session token
    this.api.interceptors.request.use((config) => {
      const token = getSessionToken();
      if (token) {
        config.headers['x-session-token'] = token;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }

}