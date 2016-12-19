import { createFocuzElement } from '../';

describe('createFocuzElement', () => {
  it('should create focuz valid element', () => {
    const element = createFocuzElement(
      'Test',
      {
        a: 5,
      },
    );

    expect(element).toEqual({
      type: 'Test',
      props: {
        a: 5,
      },
      children: undefined,
      _isFocuz: true,
    });
  });

  it('should create focuz valid element with children', () => {
    const element = createFocuzElement(
      'Test',
      {
        a: 5,
      },
      [
        createFocuzElement(
          'Test',
          {
            a: 10,
          },
        ),
        createFocuzElement(
          'Test',
          {
            a: 15,
          },
        ),
      ],
    );

    expect(element).toEqual({
      type: 'Test',
      props: {
        a: 5,
      },
      children: [
        {
          type: 'Test',
          props: {
            a: 10,
          },
          children: undefined,
          _isFocuz: true,
        },
        {
          type: 'Test',
          props: {
            a: 15,
          },
          children: undefined,
          _isFocuz: true,
        },
      ],
      _isFocuz: true,
    });
  });
});
