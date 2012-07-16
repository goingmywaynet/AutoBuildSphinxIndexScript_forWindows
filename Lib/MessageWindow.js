/* =============================================
*  Windows メッセージウィンドウ表示ライブラリ
*  =============================================
*
* MessageWindow_wav(_strMsg, _strWavURL)
* - 指定したwavを鳴らして、メッセージを表示する
* - 引数 _strMsg : 表示するメッセージ
* - 引数 _strWavURL : 鳴らす音。省略でchimes.wavが鳴る
* - 返り値 : なし
* 
* MessageWindow_msg(_strTitle, _strMsg, _nSecondsToWait)
* - 指定した秒数だけメッセージを表示する
* - 引数 _strTitle : ポップアップ window タイトル
* - 引数 _strMsg : 表示するメッセージ
* - 引数 _nSecondsToWait : 待ち秒数。0 指定ならOK押すまで待つ。
* - 返り値 : なし
*
* MessageWindow_info(_strTitle, _strMsg, _nSecondsToWait)
* - 指定した秒数だけメッセージをInfoレベルで表示する
* - 引数 _strTitle : ポップアップ window タイトル
* - 引数 _strMsg : 表示するメッセージ
* - 引数 _nSecondsToWait : 待ち秒数。0 指定ならOK押すまで待つ。
* - 返り値 : なし
*
* MessageWindow_warn(_strTitle, _strMsg, _nSecondsToWait)
* - 指定した秒数だけメッセージをWarningレベルで表示する
* - 引数 _strTitle : ポップアップ window タイトル
* - 引数 _strMsg : 表示するメッセージ
* - 引数 _nSecondsToWait : 待ち秒数。0 指定ならOK押すまで待つ。
* - 返り値 : なし
*
*/

//==================================================
//指定したwavを鳴らして、メッセージを表示する(今回不使用)
//==================================================
function MessageWindow_wav(_strMsg,_strWavURL) {

	var mp = WScript.CreateObject("WMPlayer.OCX");
	//mp.URL = "C:\\windows\\media\\chimes.wav";
	
	if ( _strWavURL == "" ) {
	   mp.URL = "C:\\windows\\media\\chimes.wav";
	} else {
	   mp.URL = _strWavURL;
	}
	
	mp.Controls.Play();
	while(mp.PlayState != 1){
	    WScript.Sleep(200);
	}
	WScript.echo(_strMsg); 
}

//=============================================================
//指定した秒数だけメッセージを表示する 0 指定ならOK押すまで待つ
//Information 版 (音あり)
//=============================================================
function MessageWindow_info(_strTitle, _strMsg, _nSecondsToWait) {
  //1秒で閉じるポップアップでファイルを取得している事を表示する

  // _strTitle 引数が省略された場合は、呼び出し元のfunction名をセット
  if (_strTitle == "") {
      _strTitle = arguments.callee.caller.toString();
  }

  var WshShell = WScript.CreateObject("WScript.Shell");
  WshShell.Popup(_strMsg , _nSecondsToWait , _strTitle , 64);
  WshShell = null;
}

//=============================================================
//指定した秒数だけメッセージを表示する 0 指定ならOK押すまで待つ
//Warning 版 (音あり)
//=============================================================
function MessageWindow_warn(_strTitle, _strMsg, _nSecondsToWait) {
  //1秒で閉じるポップアップでファイルを取得している事を表示する

  // _strTitle 引数が省略された場合は、呼び出し元のfunction名をセット
  if (_strTitle == "") {
      _strTitle = arguments.callee.caller.toString();
  }

  var WshShell = WScript.CreateObject("WScript.Shell");
  WshShell.Popup(_strMsg , _nSecondsToWait , _strTitle , 48);
  WshShell = null;
}

//=============================================================
//指定した秒数だけメッセージを表示する 0 指定ならOK押すまで待つ
//通常 版 (音なし)
//=============================================================
function MessageWindow_msg(_strTitle, _strMsg, _nSecondsToWait) {
  //1秒で閉じるポップアップでファイルを取得している事を表示する

  // _strTitle 引数が省略された場合は、呼び出し元のfunction名をセット
  if (_strTitle == "") {
      _strTitle = arguments.callee.caller.toString();
  }

  var WshShell = WScript.CreateObject("WScript.Shell");
  WshShell.Popup(_strMsg , _nSecondsToWait , _strTitle );
  WshShell = null;
}
