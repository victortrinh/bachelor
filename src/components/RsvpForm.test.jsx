// src/components/RsvpForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RsvpForm from './RsvpForm';

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );
});

describe('RsvpForm', () => {
  it('renders the name field', () => {
    render(<RsvpForm />);
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
  });

  it('renders Aye/Nay buttons for each activity', () => {
    render(<RsvpForm />);
    // 5 activities × 2 buttons = 10 toggle buttons, plus 2 overall attendance buttons,
    // plus 2 lifts toggle buttons (needs lift + offers lift)
    const ayeButtons = screen.getAllByRole('button', { name: /aye/i });
    expect(ayeButtons.length).toBe(8); // 1 overall + 5 activities + 2 lifts
  });

  it('marks overall Aye button as selected when clicked', () => {
    render(<RsvpForm />);
    const ayeBtn = screen.getAllByRole('button', { name: /aye/i })[0];
    fireEvent.click(ayeBtn);
    expect(ayeBtn).toHaveAttribute('data-selected', 'true');
  });

  it('submits form data to Formspree endpoint', async () => {
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: 'Ragnar' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /aye/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledOnce();
      const [url, opts] = global.fetch.mock.calls[0];
      expect(url).toContain('formspree.io');
      const body = JSON.parse(opts.body);
      expect(body.name).toBe('Ragnar');
      expect(body.attendance).toBe('aye');
    });
  });

  it('shows success message after submission', async () => {
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: 'Ragnar' },
    });
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));
    await waitFor(() => {
      expect(screen.getByText(/pledged/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    render(<RsvpForm />);
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });
});
