import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/"  element={<SignIn />}/>
          <Route path="/home" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </ThemeProvider>
  );
}

export default App;
