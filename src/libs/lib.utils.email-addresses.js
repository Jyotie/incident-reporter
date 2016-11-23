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
 * Base class for email address display, storage, and retrieval.
 * 
 * @constructor
 */
var EmailAddresses = function() {
  this.storage = new PropertyStore();
  this.storedEmails = this.storage.getProperty('EMAIL_ADDRESSES', true);
};


/**
 * Returns a string of HTML-formatted email addresses for display in a sidebar.
 * 
 * @return {string} An HTML-formatted string of email addresses.
 */
EmailAddresses.prototype.getDisplay = function() {
  var emailAddresses = this.storedEmails;
  
  var html = [];
  if (emailAddresses.length > 0) {
    for (var i = 0; i < emailAddresses.length; i++) {
      html.push(Utilities.formatString('<li data-email="%s">%s' +
          '<span><i class="fa fa-close"></i></span></li>',
          emailAddresses[i], emailAddresses[i]));
    }
  } else {
    html.push('<li>No email addresses</li>');
  }
  
  return html.join('');
};


/**
 * Prompts user for a comma-separated string of email addresses. Performs some
 * basic sanitization of the email addresses including checking for duplicates
 * within the provided list, checking for valid email addresses, and checking
 * for duplicates within the already-stored email addresses.
 */
EmailAddresses.prototype.addEmails = function() {
  var newEmails = showPrompt('Enter a comma-separated list of email addresses');
  var newEmailAddresses = newEmails.split(/\s*,\s*/);
  var validEmailAddresses = this.sanitizeEmailAddresses_(newEmailAddresses);

  var emailAddresses = this.storedEmails.concat(validEmailAddresses);
  this.storage.setProperty('EMAIL_ADDRESSES', emailAddresses, true);
  this.storedEmails = emailAddresses;
};


/**
 * Removes the given email from the list of stored email addresses.
 * 
 * @param {string} email The email address to remove.
 */
EmailAddresses.prototype.removeEmail = function(email) {
  this.storedEmails.removeElement(email, false);
  this.storage.setProperty('EMAIL_ADDRESSES', this.storedEmails, true);
};


/**
 * Returns and array of sanitized email addresses. The returned array contains
 * only unique and valid email addresses.
 * 
 * @return {array} An array of email addresses as strings.
 */
EmailAddresses.prototype.sanitizeEmailAddresses_ = function(emails) {
  // Remove duplicate entries.
  var uniqueEmailAddresses = emails.removeDuplicates();

  // Remove invalid email addresses.
  var validEmailAddresses = this.validateEmails_(uniqueEmailAddresses);

  // Remove already-saved email addresses.
  var storage = new PropertyStore();
  var storedEmailAddresses = storage.getProperty('EMAIL_ADDRESSES', true);
  var newEmailAddresses = this.removeDuplicateEmails_(validEmailAddresses);

  var sanitizedEmailAddresses = newEmailAddresses;
  return sanitizedEmailAddresses;
};


/**
 * Returns an array of valid email addresses.
 * 
 * @param {array} emails An array of email addresses.
 * @return {array} An array of valid email addresses.
 */
EmailAddresses.prototype.validateEmails_ = function(emails) {
  var validEmails = [];
  for (var i = 0; i < emails.length; i++) {
    var email = emails[i];
    if (this.validateEmail_(email)) {
      validEmails.push(email);
    } else {
      showAlert('Invalid email', email + ' is not a valid email address');
    }
  }
  return validEmails;
};


/**
 * Returns true if the given email address is valid, otherwise, returns false.
 * 
 * @param {string} email An email address to validate.
 * @return {boolean} True if the email is valid, otherwise, false.
 */
EmailAddresses.prototype.validateEmail_ = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};


/**
 * Returns an array of unique emails that are not already stored.
 * 
 * @param {array} newEmails An array of email addresses.
 * @return {array} An array of unique email addresses.
 */
EmailAddresses.prototype.removeDuplicateEmails_ = function(newEmails) {
  var origEmails = this.storedEmails;
  var uniqueEmails = [];
  for (var i = 0; i < newEmails.length; i++) {
    var newEmail = newEmails[i];
    var duplicate = origEmails.indexOf(newEmail);
    if (duplicate === -1) {
      uniqueEmails.push(newEmail);
    } else {
      showAlert('Duplicate email', newEmail + ' already exists');
    }
  }
  return uniqueEmails;
};