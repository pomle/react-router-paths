import React from 'react';
import renderer from 'react-test-renderer';
import { createContext } from '../../mocks/context';
import { PathLink } from '../PathLink';

describe('PathLink', () => {
  it('renders "data-" and "aria-" attributes passed as props', () => {
    const { Component } = createContext();

    const result = renderer.create(
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

    const anchor = result.root.findByType('a');
    expect(anchor.props['data-testid']).toBe('test-data-attribute');
    expect(anchor.props['aria-label']).toBe('test-aria-label');
  });
});
