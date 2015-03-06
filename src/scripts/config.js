'use strict';

var config = window.qnConfig;

module.exports = {
  // Constants
  CATEGORY_NAME_MAXLENGTH: 20,
  NOTE_TITLE_MAXLENGTH: 20,
  NOTE_BODY_MAXLENGTH: 1000,
  UNSPECIFIED_CATEGORY_NAME: 'Unspecified',
  // Vendor
  CKEDITOR: {
    contentsCss: config && config.styles ? config.styles : 'styles.css',
    bodyClass: 'qn-Editor-content',
    uiColor: '#E1D8B7'
  }
};
