import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/"  element={<SignIn />}/>
        <Route path="/home" element={<Dashboard />}/>
      </Routes>
    </div>
  );
}

export default App;
