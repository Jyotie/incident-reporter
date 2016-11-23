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
 * Generates a PDF file for each form response.
 */
function generateReports() {
  var formResponses = new FormResponses();

  var initialized = formResponses.isInitialized();
  if (initialized === false) {
    formResponses.initialize();
  }

  var formResponseSheet = formResponses.sheet;
  var responses = formResponseSheet.getRange(2, 1, formResponseSheet.getLastRow()-1, 4).getValues();

  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var incident = new Incident(i+2, response[0], response[1], response[2], response[3]);
    
    if (incident.sent !== 'sent') {
      incident.createReport();      
    }
  }
}