// utils/tokenUtils.ts

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    try {
      // Extract payload from JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check expiry (exp is in seconds, Date.now() is in milliseconds)
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Add 5-second buffer to account for network delays
      return expiryTime - 5000 < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // If we can't parse, assume expired
    }
  };
  
  /**
   * Get token expiry time
   * @param token - JWT token string
   * @returns Expiry time in milliseconds, or 0 if invalid
   */
  export const getTokenExpiryTime = (token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      return 0;
    }
  };
  
  /**
   * Get time remaining until token expires
   * @param token - JWT token string
   * @returns Time remaining in milliseconds, or 0 if expired/invalid
   */
  export const getTimeUntilExpiry = (token: string): number => {
    try {
      const expiryTime = getTokenExpiryTime(token);
      const currentTime = Date.now();
      return Math.max(0, expiryTime - currentTime);
    } catch (error) {
      return 0;
    }
  };
  
  /**
   * Extract user info from token
   * @param token - JWT token string
   * @returns User ID and role from token payload
   */
  export const getUserInfoFromToken = (token: string): { userId?: number; role?: string } => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId || payload.sub,
        role: payload.role
      };
    } catch (error) {
      return {};
    }
  };
  
  /**
   * Schedule automatic logout before token expires
   * @param token - JWT token string
   * @param onExpiry - Callback function when token expires
   */
  export const scheduleTokenExpiryCheck = (
    token: string, 
    onExpiry: () => void
  ): (() => void) => {
    const timeUntilExpiry = getTimeUntilExpiry(token);
    
    if (timeUntilExpiry <= 0) {
      // Token already expired, call callback immediately
      onExpiry();
      return () => {}; // No cleanup needed
    }
    
    // Schedule logout 1 minute before expiry (or immediately if less than 1 min left)
    const logoutTime = Math.max(0, timeUntilExpiry - 60000);
    
    const timeoutId = setTimeout(() => {
      onExpiry();
    }, logoutTime);
    
    // Return cleanup function
    return () => clearTimeout(timeoutId);
  };