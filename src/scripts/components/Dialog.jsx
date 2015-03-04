'use strict';

var React = require('react');

var Overlay = require('./Overlay');
var mixins = require('../stores/mixins');

var Dialog = React.createClass({
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    // Guarantee ids are unique.
    this.setState({
      contentId: !!this.props.message ? mixins.guid() : null,
      titleId: !!this.props.title ? mixins.guid() : null
    });
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <Overlay show={this.props.show}>
        <section
          aria-describedby={this.state.contentId}
          aria-labelledby={this.state.titleId}
          className="qn-Dialog"
          role="alertdialog">
          {this.renderTitle()}
          {this.renderMessage()}
          <div className="qn-Dialog-actions">
            <button
              className="qn-Dialog-action qn-Button"
              onClick={this.handleConfirm}>
              {this.props.confirmationButtonLabel || 'Okay'}
            </button>
            <button
              className="qn-Dialog-action qn-Button"
              onClick={this.handleCancel}>
              {this.props.cancelButtonLabel || 'Cancel'}
            </button>
          </div>
        </section>
      </Overlay>
    );
  },
  renderTitle: function() {
    if(!this.props.title) {
      return null;
    }
    return (
      <h1
        className="qn-Dialog-title"
        id={this.state.titleId}>
        {this.props.title}
      </h1>
    );
  },
  renderMessage: function() {
    if(!this.props.message) {
      return null;
    }
    return (
      <p
        className="qn-Dialog-message"
        id={this.state.contentId}>
        {this.props.message}
      </p>
    );
  },
  //
  // Handler methods
  //
  handleCancel: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger callback, assuming it is a function.
    if(!!this.props.onCancel && typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  },
  handleConfirm: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger callback, assuming it is a function.
    if(!!this.props.onConfirm && typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
  }
});

module.exports = Dialog;
