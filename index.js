var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var Promise = require('bluebird');

var listOfFilesNotUsed = {files: []};

var options = {
  performanceBudgetPath: './data/performanceBudget.json',
  outputPath: './data/output.json',
  urls: [
    'http://localhost:7000/',
    'http://localhost:7000/test'
  ]
};

function performanceBudgetPages () {

  function getPerformanceBudgetData () {
    var content = fs.read(options.performanceBudgetPath);
    var json = JSON.parse(content);
    var fileTypes = Object.keys(json.fileTypes);

    for (var type = 0; type < fileTypes.length; type++) {
      var fileList = json.fileTypes[fileTypes[type]].files;
      populateListOfFilesNotUsed(fileList);
    }

    return Promise.resolve();
  }

  function populateListOfFilesNotUsed (fileList) {
    for (var file in fileList) {
      var filePath = fileList[file].file;
      listOfFilesNotUsed.files.push(filePath);
    }
  }

  function nextPage () {
    var url = options.urls.shift();
    if (!url) phantom.exit(0);
    handlePage(url);

    return Promise.resolve();
  }

  function handlePage (url) {
    page.open(url, function(status) {
      console.log('Status: ' + status);
      nextPage();
    });
  }

  page.onResourceReceived = function(response) {
    if (response.stage === 'end') return;
    removeRerouceReceivedFromFilesNotUsed(getEndOfUrl(response.url));
  };

  function removeRerouceReceivedFromFilesNotUsed (responseUrl) {
    for (var filePath = 0; filePath < listOfFilesNotUsed.files.length; filePath++) {
      var fileName = getEndOfUrl(listOfFilesNotUsed.files[filePath]);
      if (responseUrl === fileName) listOfFilesNotUsed.files.splice(filePath, 1);
    }
  }

  page.onLoadFinished = function () {
    writeToJsonFile(JSON.stringify(listOfFilesNotUsed, null, 2));
  };

  function getEndOfUrl (filePath) {
    return filePath.split('_src')[1];
  }

  function writeToJsonFile (data) {
    fs.write(options.outputPath, data);
  }

  function generate () {

    return getPerformanceBudgetData()
      .then(nextPage)
      .tehn(callback);
  }

  return generate();
}

performanceBudgetPages();
