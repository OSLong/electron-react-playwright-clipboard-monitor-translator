import React from 'react';
import './App.css';
import { AppProvider } from './providers/AppProvider';
import MainWindow from './components/MainWindow';

function App() {

  return (
    <AppProvider>
      <MainWindow></MainWindow>
    </AppProvider>
  );
}

export default App;
