// src/components/NavBar/NavBar.test.tsx
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import NavBar from './NavBar';

beforeAll(() => {
  window.matchMedia ||= () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
});

function renderWithRoutes() {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<NavBar />} />
          <Route path="/about" element={<div>about-page</div>} />
          <Route path="/features" element={<div>features-page</div>} />
          <Route path="/chat" element={<div>chat-page</div>} />
          <Route path="/favourites" element={<div>favourites-page</div>} />
          <Route path="/login" element={<div>login-page</div>} />
          <Route path="/registration" element={<div>registration-page</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('NavBar (static links, no mapping)', () => {
  it('renders expected links with correct hrefs', () => {
    renderWithRoutes();

    // brand
    expect(screen.getByRole('link', { name: /settly ai/i })).toHaveAttribute('href', '/');

    // center links
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /features/i })).toHaveAttribute('href', '/features');
    expect(screen.getByRole('link', { name: /ask robot/i })).toHaveAttribute('href', '/chat');
    expect(screen.getByRole('link', { name: /favourites/i })).toHaveAttribute('href', '/favourites');

    // right actions
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /join|registration/i })).toHaveAttribute('href', '/registration');
  });

  it('navigates to About', async () => {
    renderWithRoutes();
    await userEvent.click(screen.getByRole('link', { name: /about/i }));
    expect(screen.getByText('about-page')).toBeInTheDocument();
  });

  it('navigates to Ask Robot (/chat)', async () => {
    renderWithRoutes();
    await userEvent.click(screen.getByRole('link', { name: /ask robot/i }));
    expect(screen.getByText('chat-page')).toBeInTheDocument();
  });

  it('navigates Login and Join', async () => {
    renderWithRoutes();
    await userEvent.click(screen.getByRole('link', { name: /login/i }));
    expect(screen.getByText('login-page')).toBeInTheDocument();

    renderWithRoutes();
    await userEvent.click(screen.getByRole('link', { name: /join|registration/i }));
    expect(screen.getByText('registration-page')).toBeInTheDocument();
  });
});
