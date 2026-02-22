import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      // In a real implementation, you would verify the token with your backend
      // For now, we'll simulate a logged-in user
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'organizer'
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth-token', token);
    // Refresh user data
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'organizer'
    });
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
}

export function requireAuth(WrappedComponent: React.ComponentType<any>) {
  return (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
