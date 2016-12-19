import React, { PropTypes } from 'react';

// Container component
const Container = ({ children, className }) => (
  <div className={className}>{children}</div>);
Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Header component
const Header = ({ text }) => (<h1>{text}</h1>);
Header.propTypes = {
  text: PropTypes.string,
};

// Text component
const Text = ({ text }) => (<p>{text}</p>);
Text.propTypes = {
  text: PropTypes.string,
};

// Image Component
const Image = ({ src }) => (<img alt="" src={src} />);
Image.propTypes = {
  src: PropTypes.string,
};

export default {
  Container,
  Header,
  Text,
  Image,
};
