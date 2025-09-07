import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    fetchUser,
    clearError, 
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    fetchUser,
    clearError,
  };
};

