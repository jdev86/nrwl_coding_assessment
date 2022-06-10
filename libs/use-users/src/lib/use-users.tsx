import { User } from '@acme/shared-models';
import { useState, useCallback } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState([] as User[]);

  const fetchUsers = useCallback( async () => {
    await fetch('/api/users').then(res => res.json()).then(data => setUsers(data));
  }, [])

  return {users, fetchUsers}
}
