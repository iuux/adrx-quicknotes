'use strict';

var React = require('react');

var Modal = React.createClass({
  componentDidUpdate: function() {
    // Prevents main document from scrolling.
    document.body.style.overflow = this.props.show ? 'hidden' : '';
    // Focus on first focusable element when modal opens.
    if(this.props.show) {
      var focusableEl = this.getFocusableElements();
      if(!!focusableEl.length) {
        focusableEl[0].focus();
      }
    }
  },
  render: function() {
    // Render nothing if hidden.
    if(!this.props.show) {
      return null;
    }

    return (
      <div className="qn-Modal">
        <div className="qn-Modal-backdrop"
          onClick={this.handleBackdropClick}></div>
        <div className="qn-Modal-content"
          ref="modal"
          onKeyDown={this.handleKeyDown}>
          {this.props.children}
        </div>
      </div>
    );
  },
  handleBackdropClick: function(e) {
    this.handleCancel(e);
  },
  handleKeyDown: function(e) {
    switch(e.key) {
      case 'Escape':
        this.handleCancel(e);
        break;
      case 'Tab':
        this.handleTab(e);
        break;
    }
  },
  handleCancel: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger onClose callback, assuming it is a function.
    if(!!this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  },
  handleTab: function(e) {
    // Discover if the event target is the first or last focusable element
    // within this component.
    var focusableEl = this.getFocusableElements();
    var firstFocusableEl = focusableEl[0];
    var lastFocusableEl = focusableEl[focusableEl.length-1];
    var isTargetFirst = e.target === firstFocusableEl;
    var isTargetLast = e.target === lastFocusableEl;
    // Loop to the last element if shift-tabbing from the first element.
    if(isTargetFirst && e.shiftKey) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
    // Loop to the first element if tabbing from the last element.
    else if(isTargetLast && !e.shiftKey) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  },
  getFocusableElements: function() {
    var modal = this.refs.modal.getDOMNode();
    var childElementsNodeList = modal.querySelectorAll('*');
    var childElementsArray = Array.prototype.slice.call(childElementsNodeList);
    return childElementsArray.filter(function(el) {
      return el.tabIndex === 0;
    });
  }
});

module.exports = Modal;
