/* Create Mecab Dic for Knowledge Base Tool
 * Version 0.1
 * Author : Joey Chen
 * Date   : 2012/06/05
 * 
 * Usage :
 *    実行には windows で実行可能な sphinx 環境が必要です。
 *    以下の Dir_* と File_ の変数を定義した上で本ファイルを
 *    Windows PowerShell で実行することで、指定されたファイル名[インデックスファイル]
 *    を再帰的に検索して .rst ファイル化し、sphinx の html ファイルを build します。
*/

// ************** Constant Definition ***********

// 注意：以下各ディレクトリ変数を宣言する際は\を\\と書いて下さい。


var Dir_MeCabMainDicDir = "D:\\MeCab\\dic\\ipadic";
    // MeCabのメイン辞書配置ディレクトリ

var Dir_MeCabBuildDicDir = "D:\\MeCab\\dic\\ipadic";
    // 生成したユーザ辞書の置き場所（ファイル名含まず）

var Dir_MeCabBinDir = "D:\\MeCab\\bin";
	// mecab-dict-index.exe があるフォルダ

var Dir_MeCabDicCSVDir = "D:\\KnowledgeBase\\001_検索辞書";
    // 辞書生成対象CSVファイル（共有フォルダ側）

var File_MeCabDicCSV = "userdic.csv";
	// 辞書生成元CSVファイル名

var File_MecabDic = "userdic.dic";
	// 辞書生成先ファイル名



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

// ************** Main ***************

copyFile(Dir_MeCabDicCSVDir +"\\"+ File_MeCabDicCSV, Dir_MeCabBuildDicDir +"\\");

createMeCabDic();

// ************* Functions *********************

// copy FILE _src to _dest
// _src : コピー元
// _dest: コピー先フォルダ
//               なお、コピー先フォルダはフォルダ名まで記載する必要がある
function copyFile(_src,_dest) {

    var objFileSys;
    var _from;
    var _to;

    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _from = objFileSys.BuildPath(_src,"");
    _to = objFileSys.BuildPath(_dest,"");

    // WScript.echo("copy " + _from + "\nto " + _to);
    // DEBUG

    objFileSys.CopyFile(_from, _to, true);
    

}

// Run mecab-dict-index.exe
function createMeCabDic() {

    var objShell;
    var objFileSys;
    var _sphinxExecPath;


    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _execPath = objFileSys.BuildPath(Dir_MeCabBinDir,"mecab-dict-index.exe") + " -d" + Dir_MeCabMainDicDir + " -u " + File_MecabDic + " -f sjis -t utf8 " + File_MeCabDicCSV;

    // WScript.echo(_execPath);
    // DEBUG

    objShell = WScript.CreateObject("WScript.shell");	// Create Shell Object
    objShell.CurrentDirectory = objFileSys.BuildPath(Dir_MeCabBuildDicDir,"");

    objShell.Run(_execPath , 1 , true);

}


// ********************** ADODB Steram Functions ************************
/*
 * Source From : http://homepage3.nifty.com/aokura/jscript/adodb.html
 *
 * charset の値の例:
 *  _autodetect, euc-jp, iso-2022-jp, shift_jis, unicode, utf-8,...
 */

/* filename: 読み込むファイルのパス
 * charset:  文字コード
 * 戻り値:   文字列
 */
function adoLoadText(filename, charset) {
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
function adoSaveText(filename, text, charset) {
  var stream;
  stream = new ActiveXObject("ADODB.Stream");
  stream.type = adTypeText;
  stream.charset = charset;
  stream.open();
  stream.writeText(text);
  stream.saveToFile(filename, adSaveCreateOverWrite);
  stream.close();
}    

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
function replaceString(srcText, searchText, replaceText, flag)
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

