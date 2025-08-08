import axios, { AxiosInstance } from 'axios';

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
  }

}