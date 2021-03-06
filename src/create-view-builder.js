import { createElement } from 'react';

function findComponentInTypes({ type, props }, types) {
  if (typeof type === 'string') {
    // in case of string look into the types store
    return types[type];
  } else if (typeof type === 'function') {
    // in case of function expect a React element
    return type;
  }

  // otherwise throw error
  throw new Error(`Focuz viewBuilder: the type is not valid ->\n${
    JSON.stringify(type, null, '  ')
  }\n${
    JSON.stringify({ type, props }, null, '  ')
  }`);
}

export default function createViewBuilder(types, modifiers = []) {
  const build = (component) => {
    // validation
    if (!component._isFocuz) {       // eslint-disable-line no-underscore-dangle
      throw new Error(`Focuz viewBuilder: the component is not a valid element ->\n${
        JSON.stringify({ type: component.type, props: component.props }, null, '   ')
      }`);
    }

    let componentType = findComponentInTypes(component, types);

    // call modifers
    const modifiedComponent = (!!modifiers.length && modifiers.reduce(
      (comp, modify) => modify(comp, componentType),
    component)) || component;

    // handle new types came out from modifiers
    if (modifiedComponent.type !== component.type) {
      componentType = findComponentInTypes(modifiedComponent, types);
    }

    // build children
    const children = (modifiedComponent.children || []).map(
      comp => build(comp, modifiers));

    return createElement(
      componentType,
      (modifiedComponent.props || null),
      ...children);
  };

  return build;
}
