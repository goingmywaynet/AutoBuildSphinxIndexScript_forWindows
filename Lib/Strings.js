/* ===========================================
*  文字列の処理ライブラリ
*  ===========================================
*
* Strings_replace(srcText, searchText, replaceText, flag)
* - 文字列内での置換を行う
* - 引数 srcText : 置換処理の対象となる文字列
* - 引数 searchText : 検索する文字列
* - 引数 flag : フラグ。文字列で指定する。
*                      g (引数 pattern に指定したパターンと一致する文字列をすべて検索)
*                      i (大文字小文字を区別しない)
*                      m (複数行検索)
* - 返り値 : 置換処理後の文字列
*
* Strings_parseCSV(_str, _lineCode)
* - 文字列を,で分解して配列にして返す
* - 引数 str : 文字列
* - 引数 _lineCode : 改行コード ( CR , LF , CRLF )
* - 返り値 : csv配列
*
* Strings_parseLine(_str, _lineCode)
* - 文字列を改行で分解して配列にして返す
* - 引数 str : 文字列
* - 引数 _lineCode : 改行コード ( CR , LF , CRLF )
* - 返り値 : 配列
*
*/


// ******************** String replace function *******************

/**
 * 文字列の置換を行う。
 * @param srcText     置換処理の対象となる文字列
 * @param searchText  検索する文字列
 * @param replaceText 置換する文字列
 * @param flag        フラグ。文字列で指定する。
 *                      g (引数 pattern に指定したパターンと一致する文字列をすべて検索するグローバル検索)
 *                      i (大文字小文字を区別しない)
 *                      m (複数行検索)
 * @return 置換処理後の文字列
 * Source From : http://d.hatena.ne.jp/foohogehoge/20090106/1231214758
 */
function Strings_replace(srcText, searchText, replaceText, flag)
{
    var objRegExp;

    // 検索する文字列を一旦エスケープ
    searchText = escape(searchText);

    // "\"を置換する。正規表現に対応するため、"\\"とする。
    objRegExp = new RegExp("%5C", "g");
    searchText = searchText.replace(objRegExp, "\\\\");

    // エスケープした文字列を元に戻す
    searchText = unescape(searchText);

    // 正規表現オブジェクト生成
    objRegExp = new RegExp(searchText, flag);

    // 置換実行
    return srcText.replace(objRegExp, replaceText);
}

function Strings_parseCSV(_str, _lineCode) {

  var CR = String.fromCharCode(13);
  var LF = String.fromCharCode(10);
  //ここはCSVの改行コードによってCR,LFを使い分ける必要がある。
  
  if ( _lineCode == "CR" ) {
    var lines = _str.split(CR);
  } else if ( _lineCode == "LF" ) {
    var lines = _str.split(LF);
  } else if ( _lineCode == "CRLF" ) {
    var lines = _str.split(CR+LF);
  }

  var csvData = new Array();

  for (var i = 0; i < lines.length; i++) {
    var cells = lines[i].split(",");
    if( cells.length != 1 ) csvData.push(cells);
  }
  return csvData;
}

function Strings_parseLine(_str, _lineCode) {

  var CR = String.fromCharCode(13);
  var LF = String.fromCharCode(10);
  //ここはCSVの改行コードによってCR,LFを使い分ける必要がある。

  if ( _lineCode == "CR" ) {
    var lines = _str.split(CR);
  } else if ( _lineCode == "LF" ) {
    var lines = _str.split(LF);
  } else if ( _lineCode == "CRLF" ) {
    var lines = _str.split(CR+LF);
  }

  return lines;
}
