// Authentication utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const storeUser = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error clearing stored user:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const user = getStoredUser();
  return user && user.id && user.email;
};
