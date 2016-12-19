export default function createFocuzElement(type, props, children) {
  return {
    type,
    props,
    children,
    _isFocuz: true,
  };
}
