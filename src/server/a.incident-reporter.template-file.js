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
 * Base class for the template file.
 * 
 * @constructor
 */
var TemplateFile = function() {
  this.fileId = this.getFileId();

  // Inherit from BaseFile.
  BaseFile.call(this, this.fileId);
};
inherit_(TemplateFile, BaseFile);


/**
 * Returns the folder id if one is stored, otherwise, returns null.
 * 
 * @return {string} The file id.
 */
TemplateFile.prototype.getFileId = function() {
  var storage = new PropertyStore();
  var fileId = storage.getProperty('TEMPLATE_FILE_ID');
  if (fileId !== undefined && fileId !== null && fileId !== '') {
    return fileId;
  }
  return null;
};


/**
 * Stores the template file id in document properties.
 */
TemplateFile.prototype.setFileId = function(fileId) {
  var stored = new PropertyStore();
  storage.setProperty('TEMPLATE_FILE_ID', file);
};


/**
 * Copies the template file to the reports folder and returns a BaseFile
 * object representing the copied file.
 * 
 * @return {BaseFile} A BaseFile object of the copied file.
 */
TemplateFile.prototype.copyTemplateFile = function() {
  var name = this.name + ' ' + getTime_();
  var reportsFolder = new ReportsFolder();
  var destination = reportsFolder.folder;
  var copiedTemplateFile = this.copyFile(name, destination);
  return copiedTemplateFile;
};