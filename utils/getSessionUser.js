import { auth } from '@/auth';

export const getSessionUser = async () => {
  const session = await auth();
  
  if (!session || !session.user) {
    return null;
  }

  return {
    user: session.user,
    userId: session.user.id,
  };
};