import renderer from 'react-test-renderer';
import createRenderEngine, { createFocuzElement } from '../';
import types from '../__tests-support__/types';

describe('createRenderEngine', () => {
  describe('render', () => {
    it('should render using react.createElement', () => {
      const renderEngine = createRenderEngine(types);

      const component = renderEngine(createFocuzElement(
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
      const renderEngine = createRenderEngine(types);

      expect(renderEngine.bind(null, {
        type: 'Container',
        props: {},
      })).toThrowError(/Focuz renderEngine: the component is not a valid element ->/);
    });
  });

  describe('modifiers', () => {
    it('should use modifiers if passed down', () => {
      const renderEngine = createRenderEngine(types, [
        (comp, { propTypes: { className } }) => ({
          ...comp,
          props: {
            ...comp.props,
            className: className ? `${comp.props.className} modified` : undefined,
          },
        }),
      ]);

      const component = renderEngine(createFocuzElement(
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
      const renderEngine = createRenderEngine(types, [
        comp => ({
          ...comp,
          type: comp.type === 'Header' ? 'Text' : comp.type,
        }),
      ]);

      const component = renderEngine(createFocuzElement(
        'Header',
        {
          text: 'My Text',
        },
      ));

      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should use different type if a modifier set it to a Component', () => {
      const renderEngine = createRenderEngine(types, [
        comp => ({
          ...comp,
          type: comp.type === 'Text' ? types.Header : comp.type,
        }),
      ]);

      const component = renderEngine(createFocuzElement(
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
