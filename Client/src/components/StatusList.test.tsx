import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import StatusList from './StatusList';
import * as hooks from '../hooks';
import { StatusEntry } from '../types';

// Mock the useCombinedEntries hook
vi.mock('../hooks', async () => {
  const actual = await vi.importActual('../hooks');
  return {
    ...actual as object,
    useCombinedEntries: vi.fn(),
  };
});

describe('StatusList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading skeleton when loading and no entries', () => {
    // Mock the hook to return loading state
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [],
      loading: true,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the loading skeleton is rendered
    const loadingSkeleton = screen.getByRole('status');
    expect(loadingSkeleton).toBeInTheDocument();
  });

  it('renders error message when there is an error and no entries', () => {
    const errorMessage = 'Test error message';
    
    // Mock the hook to return error state
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [],
      loading: false,
      error: errorMessage,
      hasMore: false,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders message when no entries are available', () => {
    // Mock the hook to return empty entries
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [],
      loading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the no entries message is displayed
    expect(screen.getByText('No status entries in the last 3 hours')).toBeInTheDocument();
  });

  it('renders steady entries correctly', () => {
    const mockEntries: StatusEntry[] = [
      {
        id: 'steady-1',
        type: 'steady',
        timestamp: new Date().toISOString(),
        message: 'Steady check 1',
        duration: 150,
      },
    ];
    
    // Mock the hook to return entries
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: mockEntries,
      loading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the entry is displayed correctly
    expect(screen.getByText('Steady check 1')).toBeInTheDocument();
    expect(screen.getByText('Steady')).toBeInTheDocument();
    expect(screen.getByText('150ms')).toBeInTheDocument();
  });

  it('renders ping entries correctly', () => {
    const mockEntries: StatusEntry[] = [
      {
        id: 'ping-1',
        type: 'ping',
        timestamp: new Date().toISOString(),
        message: 'Ping check 1',
        responseTime: 50,
      },
    ];
    
    // Mock the hook to return entries
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: mockEntries,
      loading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the entry is displayed correctly
    expect(screen.getByText('Ping check 1')).toBeInTheDocument();
    expect(screen.getByText('Ping')).toBeInTheDocument();
    expect(screen.getByText('50ms')).toBeInTheDocument();
  });

  it('renders load more button when hasMore is true', () => {
    // Mock the hook to return hasMore true
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [
        {
          id: 'ping-1',
          type: 'ping',
          timestamp: new Date().toISOString(),
          message: 'Ping check 1',
          responseTime: 50,
        },
      ],
      loading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the load more button is displayed
    const loadMoreButton = screen.getByRole('button', { name: /load more entries/i });
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('calls loadMore when load more button is clicked', () => {
    const loadMoreMock = vi.fn();
    
    // Mock the hook to return loadMore function
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [
        {
          id: 'ping-1',
          type: 'ping',
          timestamp: new Date().toISOString(),
          message: 'Ping check 1',
          responseTime: 50,
        },
      ],
      loading: false,
      error: null,
      hasMore: true,
      loadMore: loadMoreMock,
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Find and click the load more button
    const loadMoreButton = screen.getByRole('button', { name: /load more entries/i });
    fireEvent.click(loadMoreButton);
    
    // Check if loadMore was called
    expect(loadMoreMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading state in load more button when loading', () => {
    // Mock the hook to return loading state
    vi.mocked(hooks.useCombinedEntries).mockReturnValue({
      entries: [
        {
          id: 'ping-1',
          type: 'ping',
          timestamp: new Date().toISOString(),
          message: 'Ping check 1',
          responseTime: 50,
        },
      ],
      loading: true,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<StatusList />);
    
    // Check if the load more button shows loading state
    const loadMoreButton = screen.getByRole('button', { name: /loading more entries/i });
    expect(loadMoreButton).toHaveTextContent('Loading...');
  });
});
