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
 * 
 */
var ReportsFolder = function() {
  var reportsFolderId = '0B9wrv2nbHrp0Z01kOGROeDVfWk0'; 

  // Inherit from BaseFolder.
  BaseFolder.call(this, reportsFolderId);
};
inherit_(ReportsFolder, BaseFolder);


/**
 * Returns the report folder for the current month.
 *
 * @return {Folder} A Google Folder object.
 */
ReportsFolder.prototype.getCurrentMonthFolder = function() {
  var currentMonth = getCurrentMonth_();
  var monthFolders = this.folder.getFoldersByName(currentMonth);
  
  if (monthFolders.hasNext()) {
    return monthFolders.next();
  } else {
    return this.folder.createFolder(currentMonth);
  }
};