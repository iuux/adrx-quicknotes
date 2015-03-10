'use strict';

// Get the path of the Quick Notes stylesheet, to be passed to CKEditor.
var styleSheets = Array.prototype.slice.call(document.styleSheets);
var styleSheet = styleSheets.filter(function(style) {
  return style.ownerNode.id === 'qnStyleSheet';
})[0];
var styleSheetPath = styleSheet.href;

var config = {
  // Constants
  API_URL: '',
  CATEGORY_NAME_MAXLENGTH: 20,
  NOTE_TITLE_MAXLENGTH: 20,
  NOTE_BODY_MAXLENGTH: 1000,
  UNSPECIFIED_CATEGORY_NAME: 'Unspecified',
  // Vendor
  CKEDITOR: {
    contentsCss: styleSheetPath,
    bodyClass: 'qn-Editor-content',
    height: '26em',
    uiColor: '#E1D8B7'
  }
};

// Override local config with global config.
var globalConfig = window.qnConfig;
if(!!globalConfig) {
  for(var key in globalConfig) {
    config[key] = globalConfig[key];
  }
}

module.exports = config;
