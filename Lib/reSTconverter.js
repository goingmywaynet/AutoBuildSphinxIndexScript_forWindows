/* reSTconverter.js
 * Version 0.1
 * Author : Joey Chen
 * Date   : 2012/09/17
 *
 * Description : 
 *    string configure and some markup parse object for sphinx reST
 *
 * Update Log :
 *
 */

//
// reSTconverter Object
//
function reSTconverter(srcDirPath) {

  //
  // Property
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
  // Setter
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
  // Method : newIndexFile(pageTitle,boolAddDate)
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
  // Method : rstFileConvert 
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
    // Method : rstFileConvert 
    // check and replace :smblink: role
    //   this method will check file/folder name exeist and replace to
    //   full name path
    //
    //
    this.smblinkReplace = function () {

      // get current path ( windows style )
      var currentPath = new String( inputFileItem );
      var reg_deleteFileName2 = /(^.*\\).*$/;
      currentPath = reg_deleteFileName2.exec(currentPath)[1];
      reg_deleteFileName2 = null;

      var reg_currentDir = /:smblink:`(.+)`/g;
      var context;

      // -- smblink role replace method loop --
      while ( (context = reg_currentDir.exec(inputText) )!= null ) {

        var reg_angleBracket = /(.*<\s*)(.*)(\s*>.*)/;
        var FilePath = new String();
        var angleBracketResult = reg_angleBracket.exec(context[1]);
        if ( angleBracketResult == null || angleBracketResult.length <= 2 ) {
          FilePath = context[1];
        } else {
          FilePath = angleBracketResult[2];

          //Debug
          // MessageWindow_warn("Debug","FilePath is " + FilePath 
          //                    + "\n reg result is " + reg_angleBracket.exec(context[1]) 
          //                    + "\n reg result index is " + reg_angleBracket.exec(context[1]).lastIndex 
          //                    ,0 );
        }

        //Debug
        // MessageWindow_warn("Debug","Matched \n" + context[0] + 
        //                           "\n at position " + context.index+
        //                           "\n \is \n" + context +
        //                           "\n FilePath is " + FilePath,0);
        // MessageWindow_warn("Debug","currentPath is " + currentPath ,0 );

       
        // try File Access 1st
        
        //Debug
        // MessageWindow_warn("Debug","1st Try " + FilePath ,0 );

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
          //MessageWindow_warn("Debug","2nd Try " + FilePath ,0 );

          // try File Access 2nd
          if ( objFileSys.FileExists( String(FilePath) ) || objFileSys.FolderExists( String(FilePath) ) ) {

            // Debug
            //MessageWindow_warn("Debug : 2nd Try success","2nd try Get file " + FilePath +
            //                          " check next .. " ,0);

            // replace :smblink: role strings
            var left  = inputText.slice( 0 , context.index );
            var right = inputText.slice( context.index + context[0].length );

            if ( (reg_angleBracket.exec(context[1])) == null ) {
              inputText = left + ":smblink:`" + FilePath + "`" + right;
            } else {
              inputText = left + ":smblink:`" + angleBracketResult[1] 
                          + FilePath + angleBracketResult[3] + "`" + right;
            }

          } else {

            // Debug
            //MessageWindow_warn("Debug : 2nd Try Fault","2nd Can not get file " + 
            //                            FilePath + " result is " + result.description ,0);

            // replace :smblink: role strings
            //var left  = inputText.slice( 0 , context.index );
            //var right = inputText.slice( context.index + context[0].length );
            //inputText = left + context[0] + " **<-BROKEN_LINK** " + right;

          }
        }
      }
    } // Method End

    //
    // check and replace :smblink: role
    //   this method will check file/folder name exeist and replace to
    //   full name path
    //
    //
   
    if ( this.enableSmblinkReplace == true ) {
      this.smblinkReplace();
    }

    var outputFilePath = objFileSys.BuildPath(outputDirPath,outputFileName);
    ADOStream_Save(outputFilePath, inputText + "\n\n`Contents Folder <file:" + inputFileHerfText +">`_ \n" , 'utf-8');

    return outputFilePath;

  }


  
}




