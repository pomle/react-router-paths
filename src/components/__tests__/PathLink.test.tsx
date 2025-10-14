import React from 'react';
import { render } from '@testing-library/react';
import { createContext } from '../../mocks/context';
import { PathLink } from '../PathLink';

describe('PathLink', () => {
  it('renders "data-" and "aria-" attributes passed as props', () => {
    const { Component } = createContext();

    const { container } = render(
      <Component>
        <PathLink
          to='/path'
          data-testid='test-data-attribute'
          aria-label='test-aria-label'
        >
          test link
        </PathLink>
      </Component>,
    );

    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('data-testid')).toBe('test-data-attribute');
    expect(anchor?.getAttribute('aria-label')).toBe('test-aria-label');
  });
});
