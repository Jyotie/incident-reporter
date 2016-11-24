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
 * Configuration parameters that are passed into the configuration
 * factory constructor.
 * 
 * @return {Configuration} Default JSON configuration settings object.
 */
function getDefaultConfiguration_() {
  var storage = new PropertyStore();
  return {
    debug: true,
    debugSpreadsheetId: null,

    sheets: {
      formResponses: {
        name: 'Form Responses 1',
        headers: ['Report Status', 'PDF Link'],
      }
    },
  };
}