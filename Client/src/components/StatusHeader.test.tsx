import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import StatusHeader from './StatusHeader';
import * as hooks from '../hooks';
import { StatusData } from '../types';

// Mock the useStatusData hook
vi.mock('../hooks', async () => {
  const actual = await vi.importActual('../hooks');
  return {
    ...actual as object,
    useStatusData: vi.fn(),
  };
});

describe('StatusHeader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    // Mock the hook to return loading state
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatusHeader />);
    
    // Check if the loading skeleton is rendered
    const loadingSkeleton = screen.getByRole('status');
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const errorMessage = 'Test error message';
    
    // Mock the hook to return error state
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: null,
      loading: false,
      error: errorMessage,
      refetch: vi.fn(),
    });

    render(<StatusHeader />);
    
    // Check if the error message is displayed
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders status information correctly when status is up', () => {
    const mockStatus: StatusData = {
      status: 'up',
      lastUpdated: new Date().toISOString(),
      message: 'All systems operational',
    };
    
    // Mock the hook to return status data
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: mockStatus,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatusHeader />);
    
    // Check if the status information is displayed correctly
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Operational')).toBeInTheDocument();
    if (mockStatus.message) {
      expect(screen.getByText(mockStatus.message)).toBeInTheDocument();
    }
    
    // Check if the last updated time is displayed
    if (mockStatus.lastUpdated) {
      const formattedDate = new Date(mockStatus.lastUpdated).toLocaleString();
      expect(screen.getByText(`Last updated: ${formattedDate}`)).toBeInTheDocument();
    }
  });

  it('renders status information correctly when status is down', () => {
    const mockStatus: StatusData = {
      status: 'down',
      lastUpdated: new Date().toISOString(),
      message: 'System outage detected',
    };
    
    // Mock the hook to return status data
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: mockStatus,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatusHeader />);
    
    // Check if the status information is displayed correctly
    expect(screen.getByText('Outage')).toBeInTheDocument();
  });

  it('renders status information correctly when status is degraded', () => {
    const mockStatus: StatusData = {
      status: 'degraded',
      lastUpdated: new Date().toISOString(),
      message: 'System performance issues',
    };
    
    // Mock the hook to return status data
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: mockStatus,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatusHeader />);
    
    // Check if the status information is displayed correctly
    expect(screen.getByText('Degraded Performance')).toBeInTheDocument();
  });

  it('calls refetch when refresh button is clicked', () => {
    const refetchMock = vi.fn();
    
    // Mock the hook to return status data with refetch function
    vi.mocked(hooks.useStatusData).mockReturnValue({
      status: {
        status: 'up' as const,
        lastUpdated: new Date().toISOString(),
        message: 'All systems operational',
      },
      loading: false,
      error: null,
      refetch: refetchMock,
    });

    render(<StatusHeader />);
    
    // Find and click the refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh status/i });
    fireEvent.click(refreshButton);
    
    // Check if refetch was called
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
