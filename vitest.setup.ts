import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.scrollTo & HTMLElement.prototype.scrollIntoView
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: vi.fn(), writable: true });
