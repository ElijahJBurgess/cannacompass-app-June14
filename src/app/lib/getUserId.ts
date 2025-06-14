import { v4 as uuidv4 } from 'uuid';

export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;

  let userId = localStorage.getItem('cc_user_id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('cc_user_id', userId);
  }
  return userId;
};
