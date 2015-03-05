'use strict';

var React = require('react');
var cx = React.addons.classSet;
var Reflux = require('reflux');

var categorizedNotesStore = require('../stores/categorizedNotes');
var Icon = require('./icon');
var config = require('../config');

var CategorySelector = React.createClass({
  mixins: [
    Reflux.connect(categorizedNotesStore, 'categorizedNotes')
  ],
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    document.addEventListener('click', this.handleBodyClick);
  },
  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleBodyClick);
  },
  getInitialState: function() {
    return {
      showOptions: false,
      newCategoryName: this.props.newCategoryName
    };
  },
  //
  // Render methods
  //
  render: function() {
    var isNewCategorySelected = !!this.props.newCategoryName;
    var isUncategoriedSelected = !isNewCategorySelected && !this.props.selectedCategoryId;

    var selectionClasses = cx({
      'qn-CategorySelector-selection': true,
      'qn-CategorySelector-selection--open': this.state.showOptions,
      'qn-CategorySelector-selection--unspecified': isUncategoriedSelected
    });

    // Determine category name.
    var selectedName = null;
    if(isNewCategorySelected) {
      selectedName = this.props.newCategoryName;
    }
    else if(isUncategoriedSelected) {
      var unspecifiedCategory = this.state.categorizedNotes.uncategorized;
      selectedName = unspecifiedCategory.name;
    }
    else {
      var categoryList = this.state.categorizedNotes.categorized;
      var selectedCategory = categoryList.filter(function(category) {
        return category.categoryId == this.props.selectedCategoryId;
      }.bind(this))[0];
      selectedName = selectedCategory.name;
    }

    // Optionally render options.
    var options = this.state.showOptions ? this.renderOptions() : null;

    return (
      <div className="qn-CategorySelector">
        <label
          className="qn-Label"
          htmlFor="toggleButton">
          Category
        </label>
        <button
          aria-haspopup="true"
          className={selectionClasses}
          disabled={this.props.disabled}
          id="toggleButton"
          onClick={this.handleToggleOptions}
          ref="toggleButton">
          <div className="qn-CategorySelector-selectionContent">
            <span className="qn-CategorySelector-selectionText">
              {selectedName}
            </span>
            <Icon
              className="qn-CategorySelector-icon"
              name="caret-bottom"/>
          </div>
        </button>
        {options}
      </div>
    );
  },
  renderOptions: function() {
    var categoryList = this.state.categorizedNotes.categorized;
    var unspecifiedCategory = this.state.categorizedNotes.uncategorized;

    // Render sub-components.
    categoryList = categoryList.map(this.renderCategoryInput);
    unspecifiedCategory = [unspecifiedCategory].map(this.renderCategoryInput);

    var isNewCategorySelected = !!this.props.newCategoryName;
    var newCategoryIcon = isNewCategorySelected ? (<Icon name="check"/>) : null;

    return (
      <fieldset
        className="qn-CategorySelector-options"
        onKeyDown={this.handleKeyDown}
        ref="overlay"
        tabIndex="0">
        <legend className="qn-CategorySelector-legend">
          Select category
        </legend>
        {categoryList}
        {unspecifiedCategory}
        <div className="qn-CategorySelector-option qn-CategorySelector-option--newCategory">
          <label
            className="qn-CategorySelector-label"
            htmlFor="newCategoryInput">
            <span className='qn-CategorySelector-labelText'>
              New category
            </span>
            {newCategoryIcon}
          </label>
          <input
            className="qn-Input"
            id="newCategoryInput"
            maxLength={config.CATEGORY_NAME_MAXLENGTH}
            onChange={this.handleNewCategoryInputChange}
            onKeyDown={this.handleNewCategoryInputKeyDown}
            ref="newCategoryInput"
            type="text"
            value={this.state.newCategoryName}/>
        </div>
      </fieldset>
    );
  },
  renderCategoryInput: function(category) {
    var id = !!category.categoryId ? category.categoryId : 0;
    var optionId = 'category' + id;
    var isSelected = this.props.selectedCategoryId == id;

    var optionLabelClasses = cx({
      'qn-CategorySelector-label': true,
      'qn-CategorySelector-label--option': true,
      'qn-CategorySelector-label--unspecified': !category.categoryId
    });

    var icon = isSelected ? (<Icon name="check"/>) : null;

    var selectCategory = function(e) {
      this.onCategorySelection(e, id);
    }.bind(this);

    return (
      <div className="qn-CategorySelector-option">
        <input className="qn-CategorySelector-input"
          id={optionId} type="checkbox" name={optionId}
          ref={optionId}
          onChange={this.handleOptionInputChange}
          onKeyDown={this.handleOptionInputKeyDown}
          value={id}
          checked={isSelected} />
        <label className={optionLabelClasses}
          htmlFor={optionId}>
          <span className='qn-CategorySelector-labelText'>{category.name}</span>
          {icon}
        </label>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleBodyClick: function(e) {
    // Ignore if the component is closed.
    if(!this.state.showOptions) {
      return;
    }
    // Ignore if the click occurs within the overlay.
    if(this.refs.overlay.getDOMNode().contains(e.target)) {
      return;
    }
    // Ignore if the click occurs within the button.
    if(this.refs.toggleButton.getDOMNode().contains(e.target)) {
      return;
    }
    // Cancel the open component.
    this.handleCancel();
  },
  handleToggleOptions: function(e) {
    if(!!e) {
      e.preventDefault();
    }
    this.setState({
      showOptions: !this.state.showOptions
    }, function() {
      if(this.state.showOptions) {
        // Put focus on the appropriate input.
        var newCategoryRefId = 'newCategoryInput';
        var categoryRefId = 'category' + this.props.selectedCategoryId;
        var refId = !!this.props.newCategoryName ? newCategoryRefId : categoryRefId;
        this.refs[refId].getDOMNode().focus();
      }
      else if(!!e) {
        // Put focus back on the button.
        // But ignore if user clicked away to close.
        this.refs.toggleButton.getDOMNode().focus();
      }
    });
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
    this.handleToggleOptions(e);
    // Reset new category name to previously entered value.
    this.setState({
      newCategoryName: this.props.newCategoryName
    });
  },
  handleTab: function(e) {
    // Discover if the event target is the first or last focusable element
    // within this component.
    var overlay = this.refs.overlay.getDOMNode();
    var childElementsNodeList = overlay.querySelectorAll('*');
    var childElementsArray = Array.prototype.slice.call(childElementsNodeList);
    var focusableEl = childElementsArray.filter(function(el) {
      return el.tabIndex === 0;
    });
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
  handleOptionInputChange: function(e) {
    // Close the options.
    this.handleToggleOptions(e);
    // Select based on id.
    this.selectCategoryId(e.target.value);
  },
  handleOptionInputKeyDown: function(e) {
    // Enter key works just like space bar or clicking.
    if(e.key == 'Enter') {
      e.preventDefault();
      this.handleOptionInputChange(e);
    }
  },
  handleNewCategoryInputChange: function(e) {
    this.setState({
      newCategoryName: e.target.value
    });
  },
  handleNewCategoryInputKeyDown: function(e) {
    // Enter key works just like space bar or clicking.
    if(e.key != 'Enter') {
      return;
    }
    // Close the options.
    this.handleToggleOptions(e);
    // Clean the input.
    var newCategoryName = e.target.value.trim();
    // Check for content.
    if(!newCategoryName.length) {
      this.selectCategoryId(0);
      return;
    }
    // Check if the content matches the unspecified name.
    var isUnspecified = newCategoryName.toLowerCase() == config.UNSPECIFIED_CATEGORY_NAME.toLowerCase();
    if(isUnspecified) {
      this.selectCategoryId(0);
      return;
    }
    // Check if the input matches any existing categories.
    var categoryList = this.state.categorizedNotes.categorized;
    var duplicateCategories = categoryList.filter(function(category) {
      return category.name.toLowerCase() == newCategoryName.toLowerCase();
    }.bind(this));
    // Input matches existing category.
    if(!!duplicateCategories.length) {
      var id = duplicateCategories[0].categoryId;
      this.selectCategoryId(id);
      return;
    }
    // Create a new category.
    this.selectCategoryName(newCategoryName);
  },
  //
  // Helper methods
  //
  selectCategoryId: function(id) {
    id = id == '0' ? 0 : id;
    // Inform the parent component about the change.
    this.props.onChange({
      categoryId: id
    });
    // Clear new category name input value.
    this.setState({
      newCategoryName: null
    });
  },
  selectCategoryName: function(name) {
    // Inform the parent component about the change.
    this.props.onChange({
      newCategoryName: name
    });
    // Match internal state to outer state.
    this.setState({
      newCategoryName: name
    });
  }
});

module.exports = CategorySelector;
