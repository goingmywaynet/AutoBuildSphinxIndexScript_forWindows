/* winJSUniteTest.js
 * Version 0.1
 * Author  : Joey Chen
 * Date    : 2012/09/17
 *
 * Description :
 *
 *   This is Windows JScript Unit test object
 *
 *   New Test Object
 *    obj = new winJSUnitTest("Test Name");
 *
 *   New assert
 *    obj.assert("check title", BOOL , "error message");
 *
 *   Show asserts summary
 *    obj.showResult(secondsToCloseResultWindow);
 *
 *   End Test
 *    obj.done();
 *
 * Update Log  :
 *
 */

//
// class winJSUnitTest(testName)
//
function winJSUnitTest(testName) {

  //
  // Property
  //
  this.testName = testName;
  this.result = new Array();

  //
  // Method : assert
  //
  this.assert = function (title, exp, message){
    if (!exp) {
      // false assert
      this.result.push("\u2716 " + (title?title:"something") + " ...\t" + (message?message:""));
        // \u2716 is unicode "x"
    } else {
      // pass assert
      this.result.push("\u2714 " + (title?title:"something") );
        // \u2714 is unicode "check"
    }
  },

  //
  // Method : showMessage
  //
  this.showMsg = function(msg,secondsToWait) {
    var WshShell = WScript.CreateObject("WScript.Shell");
    WshShell.Popup(msg , secondsToWait?secondsToWait:0 , this.testName , 64);
    WshShell = null;
  }

  //
  // Method : showResult
  //
  this.showResult = function(secondsToWait) {
    var WshShell = WScript.CreateObject("WScript.Shell");
    WshShell.Popup(this.result.join("\n") , secondsToWait , this.testName , 64);
    WshShell = null;
  },


  //
  // Method : done
  //
  this.done = function() {
    this.showResult();
    this.result = null;
  }

}
