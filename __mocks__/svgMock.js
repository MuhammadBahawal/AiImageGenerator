const React = require('react');

function SvgMock(props) {
  return React.createElement('SvgMock', props, props.children);
}

module.exports = SvgMock;
module.exports.default = SvgMock;
module.exports.__esModule = true;
