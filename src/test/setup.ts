import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  NavLink: ({ children, to, ...props }: any) => 
    React.createElement('a', { href: to, ...props }, children),
  useParams: () => ({ id: '1' }),
}));

// Mock @heroicons/react
vi.mock('@heroicons/react/24/outline', () => ({
  HeartIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'heart-icon', ...props }),
  MagnifyingGlassIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'magnifying-glass-icon', ...props }),
  AdjustmentsVerticalIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'adjustments-icon', ...props }),
  ArrowLeftIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'arrow-left-icon', ...props }),
  TrashIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'trash-icon', ...props }),
}));

vi.mock('@heroicons/react/24/solid', () => ({
  HeartIcon: ({ className, ...props }: any) => 
    React.createElement('svg', { className, 'data-testid': 'heart-solid-icon', ...props }),
}));

// Mock @headlessui/react
vi.mock('@headlessui/react', () => ({
  Popover: ({ children }: any) => 
    React.createElement('div', { 'data-testid': 'popover' }, children),
  PopoverButton: ({ children, ...props }: any) => 
    React.createElement('button', { ...props, 'data-testid': 'popover-button' }, children),
  PopoverPanel: ({ children, ...props }: any) => 
    React.createElement('div', { ...props, 'data-testid': 'popover-panel' }, children),
})); 