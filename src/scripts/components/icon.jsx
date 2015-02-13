'use strict';

var React = require('react');

var Icon = React.createClass({
  render: function() {
    var iconClass = (this.props.className ? this.props.className + ' ' : '');
    iconClass += 'qn-Icon qn-Icon--' + this.props.name;

    return this.transferPropsTo(
      <svg
        className={iconClass}
        dangerouslySetInnerHTML={{__html:
          "<use xlink:href=\"/icons.svg#qn-Icon--" + this.props.name + "\"></use>"
        }}>
      </svg>
    );
  }
});

module.exports = Icon;
