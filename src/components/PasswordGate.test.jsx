// src/components/PasswordGate.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordGate from './PasswordGate';

describe('PasswordGate', () => {
  it('renders the password input', () => {
    render(<PasswordGate onUnlock={() => {}} />);
    expect(screen.getByPlaceholderText(/sacred word/i)).toBeInTheDocument();
  });

  it('calls onUnlock when correct password is entered', async () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'vikingsonly' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onUnlock for a wrong password', () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={() => {}} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'wrongword' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('shows an error message for a wrong password', () => {
    render(<PasswordGate onUnlock={() => {}} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'wrongword' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(screen.getByText(/wrong/i)).toBeInTheDocument();
  });

  it('is case-insensitive', () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'VIKINGSONLY' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});
