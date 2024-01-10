import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Console from './pages/Console';
import Layout from './components/Layout';
import WIP from './pages/WIP';
import Map from './pages/Map';
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
      fontSize: 18,
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
            <Route path="/settings" element={<Layout />}>
                <Route index element={<WIP />} />
            </Route>
            <Route path="/map" element={<Layout />}>
                <Route index element={<Map />} />
            </Route>
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </ThemeProvider>
  );
}

export default App;
