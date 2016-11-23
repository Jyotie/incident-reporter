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
 * @param {string} time The time the report was submitted.
 * @param {string} name The name of the reporter.
 * @param {string} description The incident description.
 * @param {string} sent Indicates whether the report was
 *     sent or not.
 */
var Incident = function(row, time, name, description, sent) {
  this.row = row;
  this.time = time;
  this.name = name;
  this.description = description;
  this.sent = sent;
  this.pdfUrl = '';
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
  
  reportFileBody.replaceText('<<name>>', this.name);
  reportFileBody.replaceText('<<description>>', this.description);
  
  reportFileDocument.saveAndClose();

  var reportsFolder = new ReportsFolder();
  var destination = reportsFolder.getCurrentMonthFolder();
  var pdfFileName = 'Incident Report for ' + this.name + ' on ' + this.time;
  var pdfFile = reportFile.createPdf(pdfFileName, destination);
  
  reportFile.file.setTrashed(true);
  
  this.setUrl(pdfFile.getUrl());
  this.reportSent();
};


/**
 * Sets the value of the 'Report Sent' box to 'yes' for
 * the current incident.
 */
Incident.prototype.reportSent = function() {
  var formResponses = new FormResponses();
  var formResponseSheet = formResponses.sheet;
  var formResponseSentCell = formResponseSheet.getRange(this.row, 4);
  formResponseSentCell.setValue('sent');
};


/**
 * Sets the value of the 'PDF' box to the PDF file's url.
 *
 * @param {string} url The url of the PDF file.
 */
Incident.prototype.setUrl = function(url) {
  this.pdfUrl = url;
  
  var formResponses = new FormResponses();
  var formResponseSheet = formResponses.sheet;
  var formResponseUrlCell = formResponseSheet.getRange(this.row, 5);
  formResponseUrlCell.setValue(url);
};