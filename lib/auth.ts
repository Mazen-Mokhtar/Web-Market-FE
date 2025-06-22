// Authentication utilities
export interface UserData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isConfirm: boolean;
    createdAt: string;
  }
  
  export const checkAuthStatus = async (): Promise<{ isLoggedIn: boolean; user: UserData | null; isAdmin: boolean }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isLoggedIn: false, user: null, isAdmin: false };
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/profile`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const userData = await response.json();
        const isAdmin = token.startsWith('admin');
        return { isLoggedIn: true, user: userData, isAdmin };
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        return { isLoggedIn: false, user: null, isAdmin: false };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('token');
      return { isLoggedIn: false, user: null, isAdmin: false };
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  export const redirectIfLoggedIn = async (router: any) => {
    const { isLoggedIn } = await checkAuthStatus();
    if (isLoggedIn) {
      router.push('/');
      return true;
    }
    return false;
  };
  
  export const requireAuth = async (router: any) => {
    const { isLoggedIn } = await checkAuthStatus();
    if (!isLoggedIn) {
      router.push('/login');
      return false;
    }
    return true;
  };