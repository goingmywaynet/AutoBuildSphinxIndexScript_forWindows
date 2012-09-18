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

  //
  // Setter
  //
  this.setIndexFileName = function(name){
    if (name) { this.indexFileName = name; 
    } else {
      this.indexFileName = "index.rst";
    }
  },

  //
  // Method : newIndexFile(filePath,pageTitle,addDate)
  //
  this.newIndexFile = function(filePath,pageTitle,addDate) {

    var _objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    var filePath = _objFileSys.BuildPath(filePath,this.indexFileName);

    // Default Configure
    var pageTitle = pageTitle ? pageTitle : "my page";
    var addDate = addDate ? addDate : false;

    var headerText = "\n=========================================\n" + pageTitle + "\n=========================================\n\n";

    // addDate
    if (addDate) {
      var dt = new Date();
      var dateString = "(" + parseInt(dt.getMonth()+1) + "/" + dt.getDate() + " " + dt.getHours() +":"+ dt.getMinutes() + " 生成) \n\n";
      headerText = headerText + dateString;
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


