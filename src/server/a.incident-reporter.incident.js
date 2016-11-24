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
 * Base class for an Incident.
 *
 * @constructor
 * @param {integer} row The row in the response sheet where
 *     the incident report is located.
 * @param {array} data An array containing the incident data.
 */
var Incident = function(row, data) {
  this.report = new Reports();
  this.responses = new FormResponses();
  this.config = Configuration.getCurrent();
  
  this.row = row;
  this.pdfUrl = '';
  this.data = this.initialize(data);
};


/**
 * Returns an object containing the incident data. Converts header values to 
 * header keys and stores the incident data with each of the respective keys.
 * 
 * @return {object} An object with the incident data stored using the header
 *     keys.
 */
Incident.prototype.initialize = function(data) {
  var headerKeys = this.responses.getHeaderKeys();

  var incidentData = {};
  for (var i = 0; i < headerKeys.length; i++) {
    var key = headerKeys[i];
    var value = data[i];
    incidentData[key] = value;
  }

  return incidentData;
};


/**
 * Returns true if the incident report was sent.
 * 
 * @return {boolean} True if the incident report was sent, otherwise, false.
 */
Incident.prototype.isSent = function() {
  var reportStatusHeader = this.config.sheets.formResponses.headers[0];
  var reportStatusKey = reportStatusHeader.replace(/\s+/g, '_');
  var status = this.data[reportStatusKey];

  if (status === 'sent') {
    return true;
  }
  return false;
};


/**
 * Creates a report for the given incident in the current
 * month's report folder and marks the incdient as sent in
 * the form response sheet.
 */
Incident.prototype.createReport = function() {
  var templateFile = new TemplateFile();
  var reportFile = templateFile.copyTemplateFile();
  var reportFileDocument = DocumentApp.openById(reportFile.fileId);
  var reportFileBody = reportFileDocument.getBody();
  
  // reportFileBody.replaceText('<<name>>', this.name);
  // reportFileBody.replaceText('<<description>>', this.description);
  
  reportFileDocument.saveAndClose();

  var reportsFolder = new ReportsFolder();
  var destination = reportsFolder.getCurrentMonthFolder();
  var pdfFileName = this.getPdfFilename();
  var pdfFile = reportFile.createPdf(pdfFileName, destination);
  
  reportFile.file.setTrashed(true);
  
  this.setPdfUrl(pdfFile.getUrl());
  this.setReportStatus();
};


/**
 * Sets the value of the 'Report Status' box to 'sent' for
 * the current incident.
 */
Incident.prototype.setReportStatus = function() {
  var responseSheet = this.responses.sheet;
  var reportStatusColumn = this.responses.getReportStatusColumn();
  var responseSheetSentCell = responseSheet.getRange(this.row,
          reportStatusColumn);
  responseSheetSentCell.setValue('sent').setHorizontalAlignment('center');
};


/**
 * Returns a string representing the PDF filename of the incident.
 * 
 * @return {string} The PDF filename.
 */
Incident.prototype.getPdfFilename = function() {
  var headers = this.responses.getHeaderKeys();
  var filenameString = this.report.getFilename();
  var filename = filenameString.split('**');

  var pdfFilename = [];
  for (var i = 0; i < filename.length; i++) {
    var name = filename[i];
    if (headers.indexOf(name) === -1) {
      pdfFilename.push(name);
    } else {
      pdfFilename.push(this.data[name]);
    }
  }

  return pdfFilename.join('');
};


/**
 * Sets the value of the 'PDF Link' box to the PDF file's url with hyperlink
 * for the current incident.
 *
 * @param {string} url The url of the PDF file.
 */
Incident.prototype.setPdfUrl = function(url) {
  this.pdfUrl = url;
  
  var formResponses = new FormResponses();
  var formResponseSheet = formResponses.sheet;
  var pdfLinkColumn = formResponses.getPdfLinkColumn();
  var formResponseUrlCell = formResponseSheet.getRange(this.row, pdfLinkColumn);
  formResponseUrlCell.setValue(url);
};