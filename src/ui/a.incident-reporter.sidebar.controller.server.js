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
 * Returns an HTML-formatted string containing the link to the stored template
 * file.
 * 
 * @returns {string} An HTML-formatted string.
 */
function getEmailAddressDisplay() {
  var emails = new EmailAddresses();
  var display = emails.getDisplay();
  return display;
}


/**
 * Returns an HTML-formatted string representing the link to the stored
 * template file.
 * 
 * @returns {string} An HTML-formatted string containing the link to the
 *         stored template file.
 */
function getTemplateFileDisplay() {
  var templateFile = new TemplateFile();
  var file = templateFile.getFile();

  if (file !== null) {
    var name = file.getName();
    var url = file.getUrl();
    var link = Utilities.formatString('<a href="%s" target="_blank">%s</a>',
            url, name);
    return link;
  } else {
    return 'No file selected';
  }
}


/**
 * Returns an HTML-formatted string containing the report filename.
 * 
 * @returns {string} An HTML-formatted string.
 */
function getReportFilenameDisplay() {
  var reports = new Reports();
  var filename = reports.getFilename();
  if (filename === null) {
    return 'No file selected';
  }
  return filename;
}


/**
 * Prompts user for a comma-separated list of email addresses. Validates and
 * stores the email addresses. Returns an HTML-formatted string containing a
 * list of the stored email addresses. 
 * 
 * @returns {string} An HTML-formatted string.
 */
function addEmailAddresses() {
  var emails = new EmailAddresses();
  emails.addEmails();
  var display = emails.getDisplay();
  return display;
}


/**
 * Removes the email from the stored list of email addresses. Returns an
 * HTML-formatted string containing a list of the stored email addresses.
 * 
 * @param {string} email The email address to remove.
 * @returns {string} An HTML-formatted string.
 */
function removeEmailAddress(email) {
  var emails = new EmailAddresses();
  emails.removeEmail(email);
  var display = emails.getDisplay();
  return display;
}


/**
 * Displays the file selector and returns an HTML-formatted string containing
 * the link to the currently stored template file.
 * 
 * @returns {string} An HTML-formatted string.
 */
function setTemplateFile() {
  showFilePicker();
  return getTemplateFileDisplay();
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showFilePicker() {
  showDialog('a.incident-reporter.file-picker.view', 600, 425,
          'Select a template file');
}


/**
 * Prompts user for a new report filename, stores the new filename, and
 * returns the filename as and HTML-formatted string.
 * 
 * @return {string} An HTML-formatted string.
 */
function setReportFilename() {
  var reports = new Reports();
  var filename = reports.updateFilename();
  return filename;
}