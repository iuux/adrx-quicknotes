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
  getInitialState: function() {
    return {
      showOptions: false,
      newCategoryName: this.props.newCategoryName
    };
  },
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
        <label className="qn-Label" htmlFor="toggleButton">Category</label>
        <button className={selectionClasses}
          ref="toggleButton" id="toggleButton"
          disabled={this.props.disabled}
          onClick={this.handleToggleOptions}>
          <div className="qn-CategorySelector-selectionContent">
            <span className="qn-CategorySelector-selectionText">{selectedName}</span>
            <Icon name="caret-bottom" className="qn-CategorySelector-icon"/>
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
      <div>
        <div className="qn-CategorySelector-backdrop"
          onClick={this.handleBackdropClick}></div>
        <fieldset className="qn-CategorySelector-options"
          onKeyDown={this.handleKeyDown}>
          <legend className="qn-CategorySelector-legend">Select category</legend>
          {categoryList}
          {unspecifiedCategory}
          <div className="qn-CategorySelector-option qn-CategorySelector-option--newCategory">
            <label className="qn-CategorySelector-label"
              htmlFor="newCategoryInput">
              <span className='qn-CategorySelector-labelText'>New category</span>
              {newCategoryIcon}
            </label>
            <input className="qn-Input" type="text"
              id="newCategoryInput" ref="newCategoryInput"
              maxLength={config.CATEGORY_NAME_MAXLENGTH}
              onChange={this.handleNewCategoryInputChange}
              onKeyDown={this.handleNewCategoryInputKeyDown}
              value={this.state.newCategoryName}/>
          </div>
        </fieldset>
      </div>
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
  handleToggleOptions: function(e) {
    e.preventDefault();
    this.setState({
      showOptions: !this.state.showOptions
    }, this.toggleOptionsRenderCallback);
  },
  toggleOptionsRenderCallback: function() {
    if(this.state.showOptions) {
      // Put focus on the appropriate input.
      var newCategoryRefId = 'newCategoryInput';
      var categoryRefId = 'category' + this.props.selectedCategoryId;
      var refId = !!this.props.newCategoryName ? newCategoryRefId : categoryRefId;
      this.refs[refId].getDOMNode().focus();
    }
    else {
      // Put focus back on the button.
      this.refs.toggleButton.getDOMNode().focus();
    }
  },
  handleBackdropClick: function(e) {
    this.handleCancel(e);
  },
  handleKeyDown: function(e) {
    if(e.key == 'Escape') {
      this.handleCancel(e);
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
  handleOptionInputChange: function(e) {
    // Close the options.
    this.handleToggleOptions(e);
    // Inform the parent component about the change.
    var categoryId = e.target.value == "0" ? 0 : e.target.value;
    this.props.onChange({
      categoryId: categoryId
    });
    // Clear new category name input value.
    this.setState({
      newCategoryName: null
    });
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
    // Validate that the input has content.
    if(!newCategoryName.length) {
      // Set category to unspecified.
      this.props.onChange({
        categoryId: 0
      });
      // Clear new category name input value.
      this.setState({
        newCategoryName: null
      });
      return;
    }
    // Inform the parent component about the change.
    this.props.onChange({
      newCategoryName: newCategoryName
    });
    // Match internal state to outer state.
    this.setState({
      newCategoryName: newCategoryName
    });
  }
});

module.exports = CategorySelector;
