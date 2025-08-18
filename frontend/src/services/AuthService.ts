import { BaseService } from "./BaseService";
import { User } from '../models/User';
import { clearSessionToken, setSessionToken } from "../utility/SessionUtil";
import { ServiceResponse } from "./ServiceResponse";

export class AuthService extends BaseService {
  constructor() {
    super('/api/auth')
  }

  async logIn(user: User): Promise<ServiceResponse> {
    try {
      const response = await this.api.post('/login', user.serialize());
      setSessionToken(response.data.sessionToken);
      return {
        data: User.deserialize(response.data.user),
        success: true,
        message: 'Login successful'
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to login.',
      };
    }
  }

  async logout(): Promise<ServiceResponse> {
    try {
      await this.api.post('/logout');
      clearSessionToken()
      return {
        data: null,
        success: true,
        message: 'Logout successful'
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'Failed to logout.',
      };
    }
  }

  async me(): Promise<ServiceResponse> {
    try {
      const response = await this.api.get('/me');
      return {
        data: User.deserialize(response.data),
        success: true,
        message: 'OK'
      };
    } catch (err: any) {
      return {
        data: null,
        success: false,
        message: err.response?.data?.error 
          || 'INVALID',
      };
    }
  }
}