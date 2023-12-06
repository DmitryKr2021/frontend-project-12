import { useContext } from 'react';

import authContext from '../components/contexts/index.jsx';

const useAuth = () => useContext(authContext);

export default useAuth;