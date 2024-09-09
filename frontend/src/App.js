import logo from './logo.svg';
import { BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';
import AppContent from './Pages/AppContent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
