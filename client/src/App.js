import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Console from './pages/Console';
import Layout from './components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    typography: {
      fontFamily: [
        'Ubuntu',
        'sans-serif',
      ].join(','),
      fontSize: 16,
      fontWeightLight: 300, 
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    }
  });


  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/"  element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Layout />} >
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/console" element={<Layout />}>
            <Route index element={<Console />} />
          </Route>
        </Routes>
      </ThemeProvider>
  );
}

export default App;
