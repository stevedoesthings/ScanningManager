var ssCount = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1CIA6sQHmhz_4pGbDNHtNcIEoh9zK-wg9X994qZE3lxg/edit#gid=1341947303');

function doGet(e) {

  if (!e.parameter.page) {
    return HtmlService.createTemplateFromFile('CreateBoxLabel')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  return HtmlService.createTemplateFromFile(e.parameter['page'])
  .evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getScriptUrl() {
 var url = "https://script.google.com/macros/s/AKfycbyY366r24DWva1uSEkab6Ec-i5hJJOrMuWkgWhxOw/exec";
 //var url = ScriptApp.getService().getUrl();
 return url;
}

function updateSheet(locationname) {
  
  var demoTrackingSheet = ss.getSheetByName("History");
  var resultsColumnValues = demoTrackingSheet.getRange('H2:'+demoTrackingSheet.getLastRow()).getValues();
  var resultsColumnValuesLen = resultsColumnValues.length;
  var latLongValues = [];
  var locationNameRange, locationNameRangeVal, locationRowRange;
  var i = 0;
  
  
  for ( i; i < resultsColumnValuesLen; i++ ) {
    if ( typeof resultsColumnValues[i] !== 'undefined' ) {
      if ( resultsColumnValues[i].indexOf('Ignition Off') > -1 || resultsColumnValues[i].indexOf('Ignition On') > -1 ){
        locationNameRange = demoTrackingSheet.getRange('I' + (i+2));
        locationNameRangeVal = locationNameRange.getValue();
        if ( locationNameRangeVal == "" ) {
          locationNameRange.setValue(locationname);
          locationRowRange = demoTrackingSheet.getRange("A" + (i+2) + ":I" + (i+2));
          locationRowRange.setBackground("#D8E4BC");
          break;
        } else { continue; }
      }
    }
  }
  return;
}

function updateInventory(id, indexVal) {

  var inventorySheet = ss.getSheetByName("Inventory");
  inventorySheet.appendRow([id, indexVal]);

}

function checkDailyScansTheSequel() { //needs to parse the dailys counting for each scanner and adding box + status

  var dailySheet = ss.getSheetByName('Daily');
  var DailySheetVal = dailySheet.getRange('A2:' + dailySheet.getLastRow()).getValues();
  var DailySheetValLen = DailySheetVal.length;
  
  var configurationSheet = ss.getSheetByName("Configuration");
  var configurationSheetLastRow = configurationSheet.getLastRow();
  var scannerNames = configurationSheet.getRange('D2:D'+configurationSheetLastRow).getValues();
  var scannerShredBoxes = configurationSheet.getRange('E2:E'+configurationSheetLastRow).getValues();
  var scannerNamesLen = scannerNames.length;
  var indexForm = [];
  
  var j = 1;
  
  /*for( j; j <= DailySheetValLen; j++ ) {
    return DailySheetVal.toString();
  }*/

  //return 'taco test';
  //return DailySheetVal[j][2];
  //DailySheetVal.shift();
  return DailySheetVal.toString();
}

function updateDailyIndex( i, status, box ) {
  var configurationSheet = ss.getSheetByName("Daily");
  var statusRange = configurationSheet.getRange('F'+(i+2));
  statusRange.setValue([status]);
  var boxRange = configurationSheet.getRange('G'+(i+2));
  boxRange.setValue([box]);
    
  return(i +" - "+ status +" - "+ box)
}

function checkDailyScans() {


  var dailyFolders = getDailyFoldersList();
  var folderShredPolicy = getFolderShredPolicy();
  var dailyFoldersLen = dailyFolders.length;
  var dailyFolderStr, dailyFolderSheet, configurationSheet, lastrow, dailyFolderValues, dailyFolderValuesLen, dailyFolderShredPolicy;

  var dailyCounts = [];
  var i = 0;
  
  for( i; i < dailyFoldersLen; i++ ) {
    dailyFolderStr = dailyFolders[i].toString();
    dailyFolderSheet = ssCount.getSheetByName(dailyFolderStr);
    configurationSheet = ss.getSheetByName("Configuration");
    
    if( dailyFolderSheet == null ) { break; }
    
    lastrow = dailyFolderSheet.getLastRow();
    
    if( lastrow !== 0 ) {
      dailyFolderValues = dailyFolderSheet.getRange('A2:'+dailyFolderSheet.getLastRow()).getValues();
      dailyFolderValuesLen = dailyFolderValues.length;
      dailyFolderShredPolicy = configurationSheet.getRange('D'+(i+2)).getValue();
      
      dailyCounts.push([dailyFolderStr,dailyFolderValuesLen,dailyFolderShredPolicy]);
      
    } else {
      continue;
    }
  }
  return dailyCounts;
}

function whatsInTheBox(folderStore) {
  var box = "taco test";
  var folder = folderStore[0];
  var store = folderStore[1];
  
  if( folder == "DailyAcctsPayable" || folder == "DailyAcctsReceivables" ) {
    if( store == "CHRY" || store == "Body Shop" ) {
      box = "AP/AR Chry/Body Shop";
    }
    if(store == "NIS/MAZ" ) {
      box = "AP/AR Nis/Maz";
    }
  }
  
  if( folder == "DailyFactoryStatements" ) {
    if( store == "CHRY" ) {
      box = "Factory State Chry";    
    }
    if( store == "NIS" ) {
      box = "Factory State Nis";
    }
    if( store == "MAZ" ) {
      box = "Factory State Maz";
    }
  }
  
  if( folder == "DailyIncentives" ) {
      box = "Incentives";
  }
  
  if( folder == "DailySoldDeals" ) {
    if( store == "CHRY" ) {
      box = "Sold Deals Chry";    
    }
    if( store == "NIS" ) {
      box = "Sold Deals Nis";
    }
    if( store == "MAZ" ) {
      box = "Sold Deals Maz";
    }
  }
  
  return box;
}

function getSwitchListA() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("I1:I").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}
function getSwitchListB() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("J1:J").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getShredPolicies() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("C2:C").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 1;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null  ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getIndexList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("B2:B").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
  return;
}

function getScannerList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("E2:E").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getScannerShredBoxList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("F2:F").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getStorageLocationsList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("A2:A").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getStatusOptionsList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("H2:H").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}

function getStoresList() {
  var configSheet = ss.getSheetByName("Configuration");
  var Avals = configSheet.getRange("K2:K").getValues();
  var AvalsLen = Avals.length;
  var finAvals = [];
  var i = 0;

  for( i; i <= AvalsLen; i++ ) {
    var avalsEntry = Avals[i];
    if ( Avals[i] == '' || Avals[i] == null ) {
      continue;
    } else {
      finAvals.push(Avals[i]);
    }
  }

  return finAvals;
}