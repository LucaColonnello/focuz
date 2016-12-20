import renderer from 'react-test-renderer';
import createViewBuilder, { createFocuzElement } from '../';
import types from '../__tests-support__/types';

describe('createViewBuilder', () => {
  describe('render', () => {
    it('should render using react.createElement', () => {
      const viewBuilder = createViewBuilder(types);

      const component = viewBuilder(createFocuzElement(
        'Container',
        {
          className: 'main',
        },
        [
          createFocuzElement(
            'Header',
            {
              text: 'My Header',
            },
          ),
          createFocuzElement(
            'Container',
            {
              className: 'content',
            },
            [
              createFocuzElement(
                'Image',
                {
                  src: 'http://placehold.it/350x150',
                },
              ),
              createFocuzElement(
                'Text',
                {
                  text: 'Lorem Ipsum dolor sit amen...',
                },
              ),
            ],
          ),
        ],
      ));

      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should throw error when the element is not a focuz element', () => {
      const viewBuilder = createViewBuilder(types);

      expect(viewBuilder.bind(null, {
        type: 'Container',
        props: {},
      })).toThrowError(/Focuz viewBuilder: the component is not a valid element ->/);
    });
  });

  describe('modifiers', () => {
    it('should use modifiers if passed down', () => {
      const viewBuilder = createViewBuilder(types, [
        (comp, { propTypes: { className } }) => ({
          ...comp,
          props: {
            ...comp.props,
            className: className ? `${comp.props.className} modified` : undefined,
          },
        }),
      ]);

      const component = viewBuilder(createFocuzElement(
        'Container',
        {
          className: 'my-container',
        },
        [
          createFocuzElement(
            'Header',
            {
              text: 'My Header',
            },
          ),
          createFocuzElement(
            'Image',
            {
              src: 'http://placehold.it/350x150',
            },
          ),
          createFocuzElement(
            'Text',
            {
              text: 'Lorem Ipsum dolor sit amen...',
            },
          ),
        ],
      ));

      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should use different type if a modifier change it', () => {
      const viewBuilder = createViewBuilder(types, [
        comp => ({
          ...comp,
          type: comp.type === 'Header' ? 'Text' : comp.type,
        }),
      ]);

      const component = viewBuilder(createFocuzElement(
        'Header',
        {
          text: 'My Text',
        },
      ));

      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should use different type if a modifier set it to a Component', () => {
      const viewBuilder = createViewBuilder(types, [
        comp => ({
          ...comp,
          type: comp.type === 'Text' ? types.Header : comp.type,
        }),
      ]);

      const component = viewBuilder(createFocuzElement(
        'Text',
        {
          text: 'My Header',
        },
      ));

      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
