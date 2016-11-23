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
 * Define program constants.
 */
TEMPLATE_ID = '1bxUFm12RGRqsHI1pdet03YOr_xnhdSlXrBW3TVurnxo';
REPORTS_FOLDER_PATH = "Apps Scripts/Dean's Office/Incident Reports/Reports";


/**
 *
 */
function generateReports() {
  var formResponseSheet = getFormResponseSheet_();
  var formResponses = formResponseSheet.getRange(2, 1, formResponseSheet.getLastRow()-1, 4).getValues();

  for (var i = 0; i < formResponses.length; i++) {
    var response = formResponses[i];
    var incident = new Incident(i+2, response[0], response[1], response[2], response[3]);
    
    if (incident.sent !== 'sent') {
      incident.createReport();      
    }
  }
}


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
  var reportFile = copyTemplateFile_();
  var reportFileDocument = DocumentApp.openById(reportFile.getId());
  var reportFileBody = reportFileDocument.getBody();
  
  reportFileBody.replaceText('<<name>>', this.name);
  reportFileBody.replaceText('<<description>>', this.description);
  
  reportFileDocument.saveAndClose();

  var pdfFileName = 'Incident Report for ' + this.name + ' on ' + this.time;
  var pdfFile = createPDF_(pdfFileName, reportFile);
  reportFile.setTrashed(true);
  
  this.setUrl(pdfFile.getUrl());
  this.reportSent();
};

/**
 * Sets the value of the 'Report Sent' box to 'yes' for
 * the current incident.
 */
Incident.prototype.reportSent = function() {
  var formResponseSheet = getFormResponseSheet_();
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
  
  var formResponseSheet = getFormResponseSheet_();
  var formResponseUrlCell = formResponseSheet.getRange(this.row, 5);
  formResponseUrlCell.setValue(url);
};


// FILE FUNCTIONS
// **************

/**
 * Returns a copy of the report template file created in the
 * current month's report folder as a File object.
 *
 * @return {File} A Google File object.
 */
function copyTemplateFile_() {
  var currentMonthFolder = getCurrentMonthFolder_();
  var templateFile = DriveApp.getFileById(TEMPLATE_ID);
  
  var reportFileName = templateFile.getName() + ' ' + getTime_();
  var reportFile = templateFile.makeCopy(reportFileName, currentMonthFolder);
  return reportFile;
}


/**
 * Creates a PDF of the given file in the given folder.
 * If no folder is given, the PDF will be placed in the
 * file's parent folder. Returns a File object of the
 * PDF.
 *
 * @param {string} name The file name for the PDF.
 * @param {File} file A Google File object.
 * @param {Folder} folder A Google Folder object.
 * @return {File} A Google File object.
 */
function createPDF_(name, file, folder) {
  folder = folder !== undefined ? folder : getParentFolder_(file);
  
  var fileDocument = DocumentApp.openById(file.getId());
  var pdfBlob = fileDocument.getAs('application/pdf');
  
  pdfBlob.setName(name);
  var pdfFile = folder.createFile(pdfBlob);
  
  return pdfFile;
}


// FOLDER FUNCTIONS
// ****************

/**
 * Returns the report folder for the current month.
 *
 * @return {Folder} A Google Folder object.
 */
function getCurrentMonthFolder_() {
  var reportsFolder = getFolderByPath_(REPORTS_FOLDER_PATH);
  
  var currentMonth = getCurrentMonth_();
  var monthFolders = reportsFolder.getFoldersByName(currentMonth);
  
  if (monthFolders.hasNext()) {
    return monthFolders.next();
  } else {
    return reportsFolder.createFolder(currentMonth);
  }
}


/**
 * Return the parent folder of the given file.
 *
 * @param {File} A Google File object.
 * @param {Folder} A Google Folder object.
 */
function getParentFolder_(file) {
  var parentFolders = file.getParents();
  if (parentFolders.hasNext()) {
    var parentFolder = parentFolders.next();
    return parentFolder;
  }
  return null;
}


/**
 * Returns the folder with the given path.
 *
 * @param {string} path The path of the folder.
 * @return {Folder} A Google Folder object.
 */
function getFolderByPath_(path) {
  var folders = path.split('/');
  var currentFolder = DriveApp.getRootFolder();
  for (var i = 0; i < folders.length; i++) {
    var folderName = folders[i];
    var childFolders = currentFolder.getFoldersByName(folderName);
    if (childFolders.hasNext()) {
      currentFolder = childFolders.next();
    }
  }
  return currentFolder;
}


// SPREADSHEET FUNCTIONS
// *********************

/**
 * Returns the sheet containing the form responses.
 *
 * @return {Sheet} A Google Sheet object.
 */
function getFormResponseSheet_() {
  var sheet = getSheetByName_('Form Responses 1');
  return sheet;
}


/**
 * Returns a sheet in the active spreadsheet with the given name.
 *
 * @param {string} name The name of the sheet to get.
 * @return {Sheet} A Google Sheet object.
 */
function getSheetByName_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  return sheet;
}


// TIME FUNCTIONS
// **************

/**
 * Returns a human-readable string representing
 * the current month. The string will be three
 * characters in length.
 *
 * @return {string} A three-character string
 *     representing the current month.
 */
function getCurrentMonth_() {
  var date = new Date();
  var month = date.getMonth();
  var months = ['Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];
  return months[month];
}


/**
 * Returns an integer representing the number
 * of milliseconds between midnight of
 * January 1, 1970 and the specified date.
 *
 * @return {integer} The time in milliseconds
 *   between midnight of January 1, 1970 and
 *   the specified date.
 */
function getTime_() {
  var date = new Date();
  var time = date.getTime();
  return time;
}