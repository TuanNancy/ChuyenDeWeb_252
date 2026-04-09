import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  render(<App />);
  expect(screen.getByRole('navigation', { name: /menu chính/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/tìm kiếm sản phẩm/i)).toBeInTheDocument();
});
