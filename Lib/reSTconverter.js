/* reSTconverter.js
 * Version 0.2
 * Author : Joey Chen
 * Date   : 2014/01/05
 *
 * Description : 
 *    string configure and some markup parse object for sphinx reST
 *
 * Update Log :
 *
 *    Version 0.1 firest version
 *
 *    Version 0.2 refuctoring.
 *                add reSTconverterTools object for trace :smblink: , image , figure role files
 *
 */

//
// [Object] reSTconverter 
//
function reSTconverter(srcDirPath) {

  //
  // [Propertys]
  //
  this.indexFileName = "index.rst";   // index.rst file name
  this.srcDirPath = srcDirPath;       // sphinx source files dir path
  this.tocTitleList = new Array();    // toctree Title list
  this.tocItemList = new Array(2);    // toctree Item Array
  this.tocItemList[0] = new Array();  // toctree Title id (same as tocTitleList array count)
  this.tocItemList[1] = new Array();  // toctree item
  this.enableSmblinkReplace = new Boolean(false); // :smblink: replace function
  // this.enableSmblinkReplace = new Boolean(true); // :smblink: replace function

  //
  // [Setters]
  //
  this.setIndexFileName = function(name){ 
    name?this.indexFileName=name:this.indexFileName="index.rst";
  },
  this.setSrcDirPath = function(name){ 
    if (name) {
      try {
        var _objFileSys = new ActiveXObject("Scripting.FileSystemObject");
        var _strFilePath = _objFileSys.GetFolder(name);
      } catch (result) {
        MessageWindow_warn("Error at reSTconverter_setSrcDirPath", result + " for " + name , 0);
        return null;
      }
      _objFileSys = null;
      this.srcDirPath = name;
    }
  },
  this.clearSrcDirPath = function(){
    this.srcDirPath = null;
  },
  this.pushTocTitleList = function(name) {
    if (name) {
      this.tocTitleList.push(name);
    }
  },
  this.pushTocItemList = function(titleId,name) {
    if (parseInt(titleId) >= 0 && name ) {
      this.tocItemList[0].push(titleId);
      this.tocItemList[1].push(name);
    }
  },

  //
  // [Method] Create new index.rst file (pageTitle,boolAddDate)]
  //
  this.newIndexFile = function(pageTitle,boolAddDate) {

    // pre check srcDirPath 
    try {
      var _objFileSys = new ActiveXObject("Scripting.FileSystemObject");
      var _strFilePath = _objFileSys.GetFolder(this.srcDirPath);
    } catch (result) {
      MessageWindow_warn("Error at reSTconverter_setSrcDirPath", result + " ... fail to open scrDirPath" , 0);
      return null;
    }

    var _objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    var filePath = _objFileSys.BuildPath(this.srcDirPath,this.indexFileName);

    // Default Configure
    var pageTitle = pageTitle ? pageTitle : "my page";
    var boolAddDate = boolAddDate ? boolAddDate : false;

    // create page title
    var headerText = "\n";
    for (length = new String(pageTitle).length * 2; length >= 0 ;length--) { headerText += "=" }
    headerText = headerText + "\n" + pageTitle + "\n";
    for (length = new String(pageTitle).length * 2; length >= 0 ;length--) { headerText += "=" }
    headerText += "\n\n"

    // boolAddDate
    if (boolAddDate) {
      var dt = new Date();
      var dateString = "(" + parseInt(dt.getMonth()+1) + "/" + dt.getDate() + " " + dt.getHours() +":"+ dt.getMinutes() + " Build) \n\n";
      headerText = headerText + dateString;
    }

    // addTocTitle and Items
    for (TitleCount = 1 ; TitleCount <= this.tocTitleList.length ; TitleCount++) {
      headerText = headerText + "\n" + this.tocTitleList[TitleCount-1]+"\n";
      for (length = new String(this.tocTitleList[TitleCount-1]).length * 2; length >= 0 ;length--) { headerText += "=" }
      headerText = headerText + "\n.. toctree::\n\t:maxdepth: 1\n\n"

      for (ItemCount = 0 ; ItemCount < this.tocItemList[0].length ; ItemCount++) {
        if (parseInt(this.tocItemList[0][ItemCount]) == TitleCount) {
          headerText = headerText + "\t" + this.tocItemList[1][ItemCount] + "\n";
        }
      }

    }


    try {
      ADOStream_Save(filePath, headerText , 'utf-8');
    } catch (result) {
      MessageWindow_warn("Error at reSTconverter_openNewIndexFile", "ADOStream Save Error " + result + "\n filePath : " + filePath + "\n headerText : " + headerText , 0)
      return null;
    } 

    return filePath;
  },

  //
  // [Method] trace directorys and create rest index file 
  //
  this.rstFileConvert = function(inputFileItem, outputDirPath, outputFileName) {
  //                             FileSystemObject , String , String

    // pre check outputDirPath
    try {
      var objFileSys = new ActiveXObject("Scripting.FileSystemObject");
      var outputDirPath = objFileSys.GetFolder(outputDirPath);
    } catch (result) {
      objFileSys = null;
      MessageWindow_warn("Error at reSTconverter_rstFileConvert", result + " ... fail to open outputDirPath" , 0);
      return null;
    }

    // open input File Item
    try {
      var inputText = ADOStream_Load(inputFileItem , '_autodetect');
    } catch (result) {
      MessageWindow_warn("Error at reSTconverter_rstFileConvert", result + " ... fail to open inputFileItem" , 0);
      return null;
    }

    // create rst hyper link to contents folder
    var inputFileHerfText;
    inputFileHerfText = Strings_replace(new String(inputFileItem) , " " , "%20" , "g");
    inputFileHerfText = Strings_replace(inputFileHerfText , "\\" , "/" , "g");
    var reg_deleteFileName = /(^.*\/).*$/;
    inputFileHerfText = reg_deleteFileName.exec(inputFileHerfText)[1];

    //
    // check and replace :smblink: role
    //   this method will check file/folder name exeist and replace to
    //   full name path
    //
    if ( this.enableSmblinkReplace == true ) {
      var toolObj = new reSTconverterTools(this); // create new object
      if ( !(toolObj instanceof reSTconverterTools) ) { 
        MessageWindow_warn("Error at reSTconverter", toolObj.message, 0);
      } else { // method call
        inputText = toolObj.regPathReplace(/(:smblink:`)(.+)(`)/g, inputText, inputFileItem, Boolean(false));
        inputText = toolObj.regPathReplace(/(\.\.\s*.*image::\s*)(.+)(\s*\r\n)|(\.\.\s*.*image::\s*)(.+)(\s*\n)/g
            , inputText, inputFileItem, Boolean(true));
        inputText = toolObj.regPathReplace(/(\.\.\s*.*figure::\s*)(.+)(\s*\r\n)|(\.\.\s*.*figure::\s*)(.+)(\s*\n)/g
            , inputText, inputFileItem, Boolean(true));
      }

    }

    var outputFilePath = objFileSys.BuildPath(outputDirPath,outputFileName);
    ADOStream_Save(outputFilePath, inputText + "\n\n`Contents Folder <file:" + inputFileHerfText +">`_ \n" , 'utf-8');

    return outputFilePath;

  }
  
}

//
// [Object] reSTconverterTools
//
function reSTconverterTools(reSTconverterObj) {
  //                        reSTconverter object

  // pre check (Parameter is reSTconverter object)
  if ( !(reSTconverterObj instanceof reSTconverter) ) {
    var result = new Error("option is " + reSTconverterObj.constructor + "\nyou need give reSTconverter object");
    return (result);
  }

  //
  // [Propertys]
  //
  this.cnvObj = reSTconverterObj; // reSTconverter Object

  //
  // [Objects]
  //
  var objFileSys = new ActiveXObject("Scripting.FileSystemObject");

  // [Method] getCurrentPath
  // get inputFileItem current directory path by string
  var getCurrentPath = function (inputFileItem) { // get current directory path (windows)
    var currentPath = new String( inputFileItem );
    var reg_deleteFileName2 = /(^.*\\).*$/;
    return reg_deleteFileName2.exec(currentPath)[1];
    reg_deleteFileName2 = null;
  }

  // [Method] escapeWindowsPath
  // get inputFileItem current directory path by string
  var escapeWindowsPath = function (inputFileItem) { // escape directory path (windows)
    inputFileHerfText = Strings_replace(new String(inputFileItem) , " " , "%20" , "g");
    inputFileHerfText = Strings_replace(inputFileHerfText , "\\" , "/" , "g");
    inputFileHerfText = "file:" + inputFileHerfText;
    return inputFileHerfText;
  }

  // [Method] path replace
  // check and replace regexp
  //   this method will check file/folder name exeist and replace to
  //   full name path
  this.regPathReplace = function (reg_context, inputText, inputFileItem, escapeFlag) {
    //                            regexp     , String   , FileSystemObject, BOOL

    var currentPath = getCurrentPath(inputFileItem);    // get current directory path

    if ( !(reg_context instanceof RegExp ) ) {
      var result = new Error("option is " + reg_context.constructor + "\nyou need give RegExp object");
      return (result);
    }

    var context ;   // regexp result (RegExp result Array)
    var leftcount ; // inputText split target index (Number)

    // -- replace method loop --
    while ( (context = reg_context.exec(inputText) )!= null ) {

      var reg_angleBracket = /(.*<\s*)(.*)(\s*>.*)/;
      var FilePath = new String();
      var angleBracketResult = reg_angleBracket.exec(context[2]);
      if ( angleBracketResult == null || angleBracketResult.length <= 2 ) {
        FilePath = context[2];
        leftcount = context.index;
      } else {
        FilePath = angleBracketResult[2];
        leftcount = context.index + angleBracketResult.index;
      }

      //Debug
      // MessageWindow_warn("Debug","Matched \n" + context + 
      //                           "\n at position " + leftcount +
      //                           "\n FilePath is " + FilePath,0);
      
      // try File Access 1st
      if ( objFileSys.FileExists( String(FilePath) ) || objFileSys.FolderExists( String(FilePath) ) ) {

        //Debug
        // MessageWindow_warn("Debug : 1st Try Success","Get file " + FilePath + 
        //                            " check next .. " ,0);

      } else {

        // replace file path string regex
        var reg_pattern = /^(.*\/)?(.+)$/;

        //Debug
        // MessageWindow_warn("Debug : 1st Try fault","File Path " + FilePath + "\n Replace to " 
        //                    + FilePath.replace( reg_pattern , currentPath + "$2" ) ,0);

        // replace file path string
        FilePath = FilePath.replace( reg_pattern , currentPath + "$2" );


        //Debug
        // MessageWindow_warn("Debug","2nd Try " + FilePath +
        //     "reg_pattern is " + reg_pattern ,0 );

        // try File Access 2nd
        if ( objFileSys.FileExists( String(FilePath) ) || objFileSys.FolderExists( String(FilePath) ) ) {

          // Debug
          // MessageWindow_warn("Debug : 2nd Try success","2nd try Get file " + FilePath +
          //                          " check next .. " ,0);

          // escape File Path to HTML herf Style (\\File path -> //File%path)
          if ( escapeFlag ) {
            FilePath = escapeWindowsPath(FilePath); // escape directory path (windows)
          }

          // replace :smblink: role strings
          var left  = inputText.slice( 0 , leftcount );
          var right = inputText.slice( leftcount + context[0].length );

          var pathText;

          if ( (reg_angleBracket.exec(context[2])) == null ) {
            pathText = context[1] + FilePath;
            if ( context[3] != null ) { pathText += context[3] }
          } else {
            pathText = context[1] + angleBracketResult[1] + FilePath + angleBracketResult[3];
            if ( context[3] != null ) { pathText += context[3] }
          }


          inputText = left + pathText + right;

          // Debug
          // MessageWindow_warn("Debug : 2nd Try success","context is " + context + 
          //                          "\nleft is \n" + left +
          //                          "\nright is \n" + right +
          //                          "\nangle is \n" + angleBracketResult +
          //                          "\nadd is \n" + pathText ,0);

          // Debug
          // MessageWindow_warn("Debug : 2nd Try success","inputText is \n" + inputText ,0);

        } else {
          // Debug
          //MessageWindow_warn("Debug : 2nd Try Fault","2nd Can not get file " + 
          //                            FilePath + " result is " + result.description ,0);
        }
      }
    }
    return inputText;
  } // Method End
}
