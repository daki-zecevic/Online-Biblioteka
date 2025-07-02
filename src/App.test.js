import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter, Routes, Route,} from 'react-router'
import Register from './Screens/Register,jsx';
import Login from './Screens/Login.js';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)



