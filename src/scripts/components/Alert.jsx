'use strict';

var React = require('react');

var Icon = require('./Icon');

var Alert = React.createClass({
  render: function() {
    var type = this.props.type || 'error';
    var classNames = [
      'qn-Alert',
      'qn-Alert--' + type
    ].join(' ');

    return this.transferPropsTo(
      <p className={classNames} tabIndex="0">
        <Icon name={type} className="qn-Alert-icon"/>
        {this.props.message}
      </p>
    );
  }
});

module.exports = Alert;
