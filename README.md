# Project Focuz
[![CircleCI](https://circleci.com/gh/LucaColonnello/focuz.svg?style=svg)](https://circleci.com/gh/LucaColonnello/focuz)

Project Focuz is a React on the fly view builder which let you create react elements using a json object that describes how many components you want, their props and children.

Use this view builder to create your views, let you focus on the atomic parts like UI components or complex modules.

This view builder is renderer agnostic, so it can be used with `ReactDOM` and `ReactNative` as well.

**Create your components and tell the view builder how to mix them to create your views.**

*And that's all!*


## What this can be used for

Let's have a list of examples:

- **Page creation**: You can make an entire page mixing all the components you've created in a JSON object and pass it down to the view builder. (The aim of this: **The JSON object can obviously come out from a web service**)

- **Content creation**: You can make content using the view builder and all the components you've created to easily create content avoiding changes in any of your components every time you need to change the content. (The aim of this: **Let editors create contents the way they want to, with more then a WYSIWYG editor**)

- **Your ideas**: Fancy to experiment? Create your way and let me know! (Remember: **The more your business logic is outside the render, the more you earn from it**)


**This is not meant to be a component builder.
You are not supposed to use it to create atomic components.
Native elements are not supported from this view builder**


## How to use it

**1) Install it:**

`npm install focuz`

or

`yarn add focuz`

**2) Try it**

This is a simple setup.

```js
import ReactDOM from 'react-dom';

// import the lib
import createViewBuilder, {
  createFocuzElement,
} from 'focuz';

// suppose you have a component folder
// that exports all the components you've created
import {
  Container,
  Header,
  MarkdownText,     // markdown is cool, let's use ReactMarkdown component
  Quote,
} from './components';

// provide types object
// the bunch of components the view builder can use
const types = {
  Container,
  Header,
  MarkdownText,
  Quote,
};

// and then create the view builder
const viewBuilder = createViewBuilder(types);


// create the node description,
// the object that describes what you want to render

// can be done everywhere, also into a web service
// or can be stored into a database
const nodeDescription = createFocuzElement(
  // type
  'Container',

  // props
  {
    className: 'article',
  },

  // children
  [
    createFocuzElement(
      'Header',
      {
        text: 'My article title',
      },
    ),
    createFocuzElement(
      'Quote',
      {
        text: 'My article description.',
      },
    ),
    createFocuzElement(
      'MarkdownText',
      {
        text: '*My article content with markdown*',
      },
    ),
  ],
);

// nodeDescription is a simple json object
// createFocuzElement creates an object with a
// _isFocuz attribute for validation
console.log(nodeDescription);
```

Then you can use it with ReactDOM render.

```js
const content = viewBuilder(nodeDescription);
ReactDOM.render(
  content,
  document.getElementById('my-container')
);
```

Or into another component. The view builder is simply returning a React element (not a class).

```js
const Content = ({ nodeDescription }) => {
  const content = viewBuilder(nodeDescription);
  return (
    <div>
      {content}
    </div>
  );
};

ReactDOM.render(
  <Content contentDescription={contentDescription} />,
  document.getElementById('my-container')
);
```


## Change nodes with modifiers

You can change each node before the view builder create the React element using *modifiers*.

**A modifier is a function that has the responsibility to change nodes before the builder parse them.**

### Example of modifier:

```js
function layoutModifier(/* options */) {
  return (node, ComponentType) => {
    // check if the properties we work with exists
    // otherwise return the node itself
    // e.g.: if the style doesn't exists in propTypes,
    // it means that the component doesn't handle style passed from outside
    if (!node.props.layout || !ComponentType.propTypes.style) {
      return node;
    }

    // get the layout property and clone props taking off the layout
    // to avoid React to receive properties the Component doesn't care of
    const layout = node.props.layout;
    const props = {
      ...node.props,
      style: {},
    };
    delete props.layout;

    // add some layout style
    if (layout.margin) {
      props.style.margin = layout.margin;
    }

    if (layout.padding) {
      props.style.padding = layout.padding;
    }

    // something else in your imagination

    // return the new node
    return {
      ...node,
      props,
    };
  }
}
```
