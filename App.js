import React from 'react';
import { AuthProvider } from '../safecircle2.0/AuthContext';
import YourApp from './YourApp';

const App = () => (
  <AuthProvider>
    <YourApp />
  </AuthProvider>
);

export default App;

