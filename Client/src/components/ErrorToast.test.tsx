import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '../test/utils';
import ErrorToast from './ErrorToast';

describe('ErrorToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with the correct message', () => {
    const message = 'Test error message';
    render(<ErrorToast message={message} />);
    
    // Check if the component has the correct role
    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
    
    // Check if the message is displayed
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ErrorToast message="Test error" onClose={onClose} />);
    
    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close error message/i });
    fireEvent.click(closeButton);
    
    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after duration', async () => {
    const onClose = vi.fn();
    const duration = 2000;
    
    render(<ErrorToast message="Test error" duration={duration} onClose={onClose} />);
    
    // Fast-forward time inside act
    act(() => {
      vi.advanceTimersByTime(duration);
    });
    
    // Check if onClose was called after the duration
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<ErrorToast message="Test error" onClose={onClose} />);
    
    // Find the toast container and press Escape
    const toast = screen.getByRole('alert');
    fireEvent.keyDown(toast, { key: 'Escape' });
    
    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when other keys are pressed', () => {
    const onClose = vi.fn();
    render(<ErrorToast message="Test error" onClose={onClose} />);
    
    // Find the toast container and press a different key
    const toast = screen.getByRole('alert');
    fireEvent.keyDown(toast, { key: 'Enter' });
    
    // Check that onClose was not called
    expect(onClose).not.toHaveBeenCalled();
  });
});
