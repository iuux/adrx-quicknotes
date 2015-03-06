'use strict';

// Get the path of the Quick Notes stylesheet, to be passed to CKEditor.
var styleSheets = Array.prototype.slice.call(document.styleSheets);
var styleSheet = styleSheets.filter(function(style) {
  return style.ownerNode.id === 'qnStyleSheet';
})[0];
var styleSheetPath = styleSheet.href;

module.exports = {
  // Constants
  CATEGORY_NAME_MAXLENGTH: 20,
  NOTE_TITLE_MAXLENGTH: 20,
  NOTE_BODY_MAXLENGTH: 1000,
  UNSPECIFIED_CATEGORY_NAME: 'Unspecified',
  // Vendor
  CKEDITOR: {
    contentsCss: styleSheetPath,
    bodyClass: 'qn-Editor-content',
    uiColor: '#E1D8B7'
  }
};
