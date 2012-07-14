/* ============================================
*  UTF-8 でのファイル読み書き処理
*  =============================================
* 
* ADOStream_Load(filename, charset)
* - ファイルを指定文字コードで読み込む
* - 引数 filename : 読み込むファイルのパス
* - 引数 charset : 文字コード
* - 返り値 : 文字列
*
* ADOStream_Save(filename, text, charset)
* - 引数 text : 文字ストリーム
* - 引数 charset :  文字コード
* - 返り値 : なし
*
* charset の値の例:
*  _autodetect, euc-jp, iso-2022-jp, shift_jis, unicode, utf-8,...
*
*/

// ********************** ADODB Steram Functions ************************
/*
 * Source From : http://homepage3.nifty.com/aokura/jscript/adodb.html
 *
 * charset の値の例:
 *  _autodetect, euc-jp, iso-2022-jp, shift_jis, unicode, utf-8,...
 */

// ************** ADODB.stream static Values *************
// ADODB.stream による文字コード変換用定数宣言
// StreamTypeEnum Values
var adTypeBinary = 1;
var adTypeText = 2;

// LineSeparatorEnum Values
var adLF = 10;
var adCR = 13;
var adCRLF = -1;

// StreamWriteEnum Values
var adWriteChar = 0;
var adWriteLine = 1;

// SaveOptionsEnum Values
var adSaveCreateNotExist = 1;
var adSaveCreateOverWrite = 2;

// StreamReadEnum Values
var adReadAll = -1;
var adReadLine = -2;

/* filename: 読み込むファイルのパス
 * charset:  文字コード
 * 戻り値:   文字列
 */
function ADOStream_Load(filename, charset) {

  var stream, text;
  stream = new ActiveXObject("ADODB.Stream");
  stream.type = adTypeText;
  stream.charset = charset;
  stream.LineSeparator = adCRLF;
  stream.open();
  stream.loadFromFile(filename);
  text = stream.readText(adReadAll);
  stream.close();
  return text;
}

/* filename: 書き出すファイルのパス
 * text: 文字ストリーム
 * charset:  文字コード
 */
function ADOStream_Save(filename, text, charset) {
  var stream;
  stream = new ActiveXObject("ADODB.Stream");
  stream.type = adTypeText;
  stream.charset = charset;
  stream.open();
  stream.writeText(text);
  stream.saveToFile(filename, adSaveCreateOverWrite);
  stream.close();
}    

