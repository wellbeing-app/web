import { expect, it, describe } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('basic', 'classes')).toBe('basic classes');
  });

  it('should handle conditional classes correctly', () => {
    expect(cn('base', true && 'is-true', false && 'is-false')).toBe('base is-true');
  });

  it('should handle object inputs correctly', () => {
    expect(cn('base', { 'is-active': true, 'is-disabled': false })).toBe('base is-active');
  });

  it('should handle array inputs correctly', () => {
    expect(cn('base', ['arr1', 'arr2'])).toBe('base arr1 arr2');
  });

  it('should handle nested arrays and objects correctly', () => {
    expect(cn('base', ['arr1', { 'obj-true': true, 'obj-false': false }])).toBe(
      'base arr1 obj-true'
    );
  });

  it('should resolve Tailwind CSS conflicts using tailwind-merge', () => {
    // tailwind-merge should resolve conflicts like p-4 and p-2 to p-2 (the last one)
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle undefined, null, and boolean values gracefully', () => {
    expect(cn('base', undefined, null, false, true, 'end')).toBe('base end');
  });

  it('should handle empty strings correctly', () => {
    expect(cn('base', '', ' ', 'end')).toBe('base end');
  });

  it('should work with complex combined inputs', () => {
    const isActive = true;
    const hasError = false;
    expect(
      cn(
        'px-2 py-1',
        { 'bg-blue-500': isActive, 'bg-red-500': hasError },
        ['font-bold', undefined],
        isActive ? 'rounded-md' : 'rounded-none'
      )
    ).toBe('px-2 py-1 bg-blue-500 font-bold rounded-md');
  });
});
