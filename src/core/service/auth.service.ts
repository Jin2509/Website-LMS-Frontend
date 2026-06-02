import { privateApi, publicApi } from '../../api/api';
import { TokenType } from '../../api/bases/enums/jwt.enum';
import { CookiesService } from '../service/cookie.service';
import { LocalStorageService } from './local-store.service';
import { APP_ENDPOINTS } from '../../api/bases/constants/app.constants';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export class AuthService {
  /**
   * Đăng nhập hệ thống
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    const responseData = await publicApi.post(
      APP_ENDPOINTS.AUTH.LOGIN,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return responseData as unknown as LoginResponse;
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  static async me() {
    const responseData = await privateApi.get(APP_ENDPOINTS.AUTH.ME);
    return responseData;
  }

  /**
   * Làm mới token khi hết hạn
   */
  static async refreshToken() {
    const refreshToken = CookiesService.getToken(TokenType.REFRESH_TOKEN);
    if (!refreshToken) return null;

    try {
      const responseData = await publicApi.post(APP_ENDPOINTS.AUTH.REFRESH, { refreshToken });
      return responseData as any;
    } catch (error) {
      console.error('Refresh token failed:', error);
      return null;
    }
  }

  /**
   * Kiểm tra trạng thái đăng nhập
   */
  static checkLogin(): boolean {
    return !!(
      CookiesService.getToken(TokenType.ACCESS_TOKEN) &&
      CookiesService.getToken(TokenType.REFRESH_TOKEN) &&
      LocalStorageService.getValue("me")
    );
  }

  /**
   * Đăng xuất hệ thống
   */
  static async logout() {
    try {
      const responseData = await privateApi.get(APP_ENDPOINTS.AUTH.LOGOUT);
      CookiesService.removeCookie(TokenType.ACCESS_TOKEN.toString());
      CookiesService.removeCookie(TokenType.REFRESH_TOKEN.toString());
      localStorage.removeItem("me");
      return responseData;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
