// Copyright 2016 Joseph W. May. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * An object representing the form responses sheet.
 * 
 * @constructor
 */
var FormResponses = function() {
  // Get the sheet name from the configuration object.
  this.config = Configuration.getCurrent();
  this.sheetName = this.config.sheets.formResponses.name;

  // Get the sheet id.
  var spreadsheet = new BaseSpreadsheet();
  var sheetId = spreadsheet.getSheetId(this.sheetName);

  // Inherit from BaseSheet.
  BaseSheet.call(this, sheetId);
};
inherit_(FormResponses, BaseSheet);


/**
 * Returns true if the form responses sheet is properly initialized with the
 * required headers.
 * 
 * @return {boolean} True if the sheet is initialized, otherwise, false.
 */
FormResponses.prototype.isInitialized = function() {
  var header = this.getHeader();
  var requiredHeaders = this.config.sheets.formResponses.headers;
  var lastColumn = this.sheet.getLastColumn();
  var headerSlice = header.slice(lastColumn - 2, lastColumn);
  var initialized = arraysEqual(requiredHeaders, headerSlice);
  return initialized;
};


/**
 * Initializes the form responses sheet by adding the required headers to the
 * header row of the sheet. The added column numbers are stored in document
 * properties for later use.
 */
FormResponses.prototype.initialize = function() {
  var requiredHeaders = this.config.sheets.formResponses.headers;
  
  // Get the required header column numbers.
  var lastColumn = this.sheet.getLastColumn();
  var reportStatusColumn = lastColumn + 1;
  var pdfLinkColumn = reportStatusColumn + 1;

  // Add the headers and notes. Resize the columns.
  this.addHeader(reportStatusColumn, requiredHeaders[0],
          'REPORT_STATUS_COLUMN');
  this.addHeader(pdfLinkColumn, requiredHeaders[1], 'PDF_LINK_COLUMN');
  this.sheet.setColumnWidth(reportStatusColumn, 100);
  this.sheet.setColumnWidth(pdfLinkColumn, 600);
};


/**
 * Returns a Google Range object containing the header cells.
 * 
 * @return {Range} A Google Range object.
 */
FormResponses.prototype.getHeaderRange = function() {
  var headerRange = this.getRow(1, 1, this.sheet.getLastColumn());
  return headerRange;
};


/**
 * Returns an array containing the headers for the form responses sheet.
 * 
 * @return {array} An array of the header values.
 */
FormResponses.prototype.getHeader = function() {
  var headerRange = this.getHeaderRange();
  var header = headerRange.getValues();
  return header[0];
};


/**
 * Adds the header to the given colNum and stores the colNum in the document
 * properties using the storageKey.
 * 
 * @param {integer} colNum The column number to add to.
 * @param {string} header The header to add.
 * @param {string} storageKey The document properties storage key.
 */
FormResponses.prototype.addHeader = function(colNum, header, storageKey) {
  var headerCell = this.sheet.getRange(1, colNum);
  headerCell.setValue(header);
  headerCell.setNote('This column is required by the ' +
          'incident reporter plugin. Do not remove this column.');
  var storage = new PropertyStore();
  storage.setProperty(storageKey, colNum);
  this.config = Configuration.getCurrent();
};