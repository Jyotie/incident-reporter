var DEVELOPER_KEY = 'AIzaSyCwQxkZsb6_OUI8LRHbEgR1UzxswOodGvM';
var DIALOG_DIMENSIONS = {width: 600, height: 425};
var pickerApiLoaded = false;


/**
 * Loads the Google Picker API.
 */
function onApiLoad() {
  gapi.load('picker', {
    'callback': function() {
      pickerApiLoaded = true;
    }
  });
  google.script.run
      .withSuccessHandler(createPicker)
      .withFailureHandler(showError)
      .getOAuthToken();
}


/**
 * Creates a Picker that can access the user's spreadsheets. This function
 * uses advanced options to hide the Picker's left navigation panel and
 * default title bar.
 *
 * @param {string} token An OAuth 2.0 access token that lets Picker access
 *     the file type specified in the addView call.
 */
function createPicker(token) {
  if (pickerApiLoaded && token) {
    var picker = new google.picker.PickerBuilder()
        
        // Instruct Picker to display Documents only.
        .addView(new google.picker.View(google.picker.ViewId.DOCUMENTS))

        // Allow user to select files from Google Drive.
        .addView(new google.picker.DocsView()
            .setIncludeFolders(true)
            .setOwnedByMe(true))
        
        // Hide title bar since an Apps Script dialog already has a title.
        .hideTitleBar()
        
        .setOAuthToken(token)
        .setDeveloperKey(DEVELOPER_KEY)
        .setCallback(pickerCallback)
        .setOrigin(google.script.host.origin)
        
        // Instruct Picker to fill the dialog, minus 2 px for the border.
        .setSize(DIALOG_DIMENSIONS.width - 2,
            DIALOG_DIMENSIONS.height - 2)
        .build();

    picker.setVisible(true);
  } else {
    showError('<div class="msg msg-error">' +
        'Unable to load the file picker. Please try again.' +
      '</div>' +
      closeButton());
  }
}


/**
 * A callback function that extracts the chosen document's metadata from the
 * response object. For details on the response object, see
 * https://developers.google.com/picker/docs/results
 *
 * @param {object} data The Picker JSON-response object.
 */
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    updateDisplay('<em>Selecting...</em>');
    google.script.run
        .withSuccessHandler(updateDisplay)
        .loadSelectedFile(data.docs);
  } else if (data.action == google.picker.Action.CANCEL) {
    google.script.host.close();
  }
}