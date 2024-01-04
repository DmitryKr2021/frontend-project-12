import { useContext } from 'react';

import { AuthContext } from '../components/contexts/index.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;
