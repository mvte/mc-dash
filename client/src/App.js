import logo from './logo.svg';
import './App.css';
import Status from './components/status';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>hello</h1>
        <p>
          <Status />
        </p>
      </header>
    </div>
  );
}

export default App;
