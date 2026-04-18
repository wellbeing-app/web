import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WaitlistForm } from '@/components/waitlist-form';
import { useDictionary } from '@/components/providers/dictionary-provider';

// Mock the dictionary hook
vi.mock('@/components/providers/dictionary-provider', () => ({
  useDictionary: vi.fn(),
}));

describe('WaitlistForm Edge Cases', () => {
  const mockDict = {
    contact: {
      title: 'Test Title',
      description: 'Test Description',
      emailPlaceholder: 'Test Placeholder',
      emailLabel: 'Test Label',
      emailError: 'Invalid Email Error',
      successMessage: 'Success',
      submitBtn: 'Submit',
      privacyText: 'Privacy',
      privacyLink: 'Link',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDictionary as any).mockReturnValue(mockDict);
  });

  afterEach(() => {
    cleanup();
  });

  it('submits successfully with a valid email', () => {
    render(<WaitlistForm />);
    const input = screen.getByLabelText('Test Label');
    const button = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(screen.queryByText('Invalid Email Error')).not.toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  const invalidEmails = [
    { email: 'testexample.com', reason: 'missing @' },
    { email: 'test@', reason: 'missing domain' },
    { email: '@example.com', reason: 'missing username' },
    { email: 'test@example', reason: 'missing top-level domain' },
    { email: 'test @example.com', reason: 'contains spaces' },
    { email: 'invalid', reason: 'missing everything' }
  ];

  invalidEmails.forEach(({ email, reason }) => {
    it(`shows error for invalid email: ${email} (${reason})`, () => {
      render(<WaitlistForm />);
      const input = screen.getByLabelText('Test Label');

      fireEvent.change(input, { target: { value: email } });

      // Find the form and trigger a submit event directly to bypass HTML5 validation
      const form = input.closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Verify the error message is displayed
      expect(screen.getByText('Invalid Email Error')).toBeInTheDocument();
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });
  });

  it('clears error when typing after an error', () => {
    render(<WaitlistForm />);
    const input = screen.getByLabelText('Test Label');

    // Submit invalid email
    fireEvent.change(input, { target: { value: 'invalid' } });
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText('Invalid Email Error')).toBeInTheDocument();

    // Type something new
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.queryByText('Invalid Email Error')).not.toBeInTheDocument();
  });
});
