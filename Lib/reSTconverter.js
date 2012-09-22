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
  // Method : newIndexFile(pageTitle,addDate)
  //
  this.newIndexFile = function(pageTitle,addDate) {

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
    var addDate = addDate ? addDate : false;

    // create page title
    var headerText = "\n";
    for (length = pageTitle.length * 2; length >= 0 ;length--) { headerText += "=" }
    headerText = headerText + "\n" + pageTitle + "\n";
    for (length = pageTitle.length * 2; length >= 0 ;length--) { headerText += "=" }
    headerText += "\n\n"

    // addDate
    if (addDate) {
      var dt = new Date();
      var dateString = "(" + parseInt(dt.getMonth()+1) + "/" + dt.getDate() + " " + dt.getHours() +":"+ dt.getMinutes() + " 生成) \n\n";
      headerText = headerText + dateString;
    }

    // addTocTitle and Items
    for (TitleCount = 1 ; TitleCount <= this.tocTitleList.length ; TitleCount++) {
      headerText = headerText + "\n" + this.tocTitleList[TitleCount-1]+"\n";
      for (length = this.tocTitleList[TitleCount-1].length * 2; length >= 0 ;length--) { headerText += "=" }
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
  }
    
}


