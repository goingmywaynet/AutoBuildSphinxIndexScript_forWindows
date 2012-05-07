/* Create Knowledge Base Index Tool
 * Version 0.3
 * Author : Joey Chen
 * Date   : 2012/05/07
 * 
 * Usage :
 *    実行には windows で実行可能な sphinx 環境が必要です。
 *    以下の Dir_* と File_* の変数を定義した上で本ファイルを
 *    Windows PowerShell で実行することで、指定されたファイル名(インデックスファイル)
 *    を再帰的に検索して .rst ファイル化し、sphinx の html ファイルを build します。
*/

// ************** Constant Definition ***********

// 注意：以下各ディレクトリ変数を宣言する際は\を\\と書いて下さい。


var Dir_sphinxWorkDir = "C:\\100_KnowledgeBase\\IndexPage";
    // Sphinxの.rstを配置するディレクトリ

var Dir_sphinxMakeDir = Dir_sphinxWorkDir;
    // make.batフォルダの置き場所
    // 上記と基本的に同じでよいはずだが、変更している場合は記載すること

var Dir_sphinxWorkDirHtml = "C:\\100_KnowledgeBase\\IndexPage\\_build\\html";
    // Sphinxによってビルドされたhtmlフォルダ

var Dir_indexSearchDir = "\\\\Windows_Share\\Folder\\path";
    // インデックスファイルをサーチする対象
    // このフォルダ配下に対して再帰的にファイルをサーチする

var File_indexFileName = "000_IndexFile.txt";
    // 検索されるインデックスファイル名

var Dir_indexHtmlDir = "\\\\Windows_Share\\Folder\\html\\path";
    // Sphinxによってビルドされたhtmlを配置する公開ディレクトリ場所

var headerText = "Welcome to KnowledgeBase's documentation!\n=========================================\n\nContents:\n\n.. toctree::\n\t:maxdepth: 2\n\n";
var footerText = "\n\nIndices and tables\n==================\n\n* :ref:`search`\n";
    // Sphinxのindex.rstファイル生成用テキスト
    // Sphinxを熟知しないかぎり、上記２変数は変更しないでください

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

getFilesFromRecursiveDir (Dir_indexSearchDir);
    // 指定ディレクトリ配下を再帰的にサーチし、インデックスファイルを生成

createRstIndexFile();
    // Sphinx用 index.rst を生成

createSphinxHtml();
    // Sphinxの make.bat html を実行

uploadSphinxHtml(Dir_sphinxWorkDirHtml, Dir_indexHtmlDir);
    // 生成された html ファイルを公開ディレクトリにコピー


// ************* Functions *********************

// Run Sphinx make.bat
function createSphinxHtml() {

    var objShell;
    var objFileSys;
    var _sphinxExecPath;


    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _sphinxExecPath = objFileSys.BuildPath(Dir_sphinxMakeDir,"make.bat") + " html";

    // WScript.echo(_sphinxExecPath);
    // DEBUG

    objShell = WScript.CreateObject("WScript.shell");	// Create Shell Object
    objShell.CurrentDirectory = objFileSys.BuildPath(Dir_sphinxMakeDir,"");

    objShell.Run(_sphinxExecPath , 1 , true);

}

// Search Index Files and Create rst Files
// _SourceDir: 検索されるディレクトリ名
function getFilesFromRecursiveDir (_SourceDir) {

	var objApl;
	var objFolder;
	var objFolderItems;

	objApl = WScript.CreateObject("Shell.Application");	// Create Shell Object
	objFolder = objApl.NameSpace(_SourceDir);		// Create Folder Object
	objFolderItems = objFolder.Items();			// Get Items From Folder Object

	// WScript.echo(_SourceDir + " Item Count is " + objFolderItems.count);
        // DEBUG


	getFolderItemNames(objFolderItems);

	objFolderItems = null;
	objFolder = null;
	objApl = null;
}

// Recursive Search Function
// _tmpFolderItems : 再帰検索されるフォルダ名
function getFolderItemNames(_tmpFolderItems) {

    var objFolderItemsB;
    var objItem;
    var i;

    for (i=0;i<_tmpFolderItems.count;i++) {

        objItem = _tmpFolderItems.Item(i);

        if (objItem.IsFolder==true) {

	   if (objItem.path != Dir_sphinxWorkDir) {
	        objFolderItemsB = objItem.GetFolder;
                getFolderItemNames(objFolderItemsB.Items());
	   }

        } else {

	   if (objItem.name==File_indexFileName) {

		   // WScript.echo("got File " + objItem.path + "\nParent is " + objItem.parent + "\ntype is " + objItem.type);
		   // DEBUG

		   copyFileToSphinxWorkdir( objItem );
	   }

        }

    }

    objItem = null;
    objFolderItemsB = null;

}

// create utf-8 .rst File
// _FolderItem : 見つけたインデックスファイルを渡すことで
//               当該ファイルをUTF-8化して指定フォルダに配置する
function copyFileToSphinxWorkdir(_FolderItem) {

    var objFileSys;
    var _destFileName;
    var _destFilePath;
    var _text;
    var _addText;
    var objParentFolder;

    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _destFileName = _FolderItem.parent + ".rst";
    _destFilePath = objFileSys.BuildPath(Dir_sphinxWorkDir,_destFileName);

    headerText = headerText + "\t" + _FolderItem.parent +"\n";
    _text = adoLoadText(_FolderItem.path , '_autodetect');

    _addText = replaceString(new String(_FolderItem.path) , " " , "%20" , "g");
    _addText = replaceString(_addText , "\\" , "/" , "g");
    _addText = replaceString(_addText , File_indexFileName , "" , "g");

    // WScript.echo("File " + _FolderItem.path + "\n add " + _addText );
    // DEBUG

    adoSaveText(_destFilePath, _text + "\n\n`Contents Folder <file:" + _addText +">`_ \n" , 'utf-8');

}

// copy Sphinx HTML Dir to Dir_indexHtmlDir
// _srcDirPath : コピー元フォルダ
// _destDirPath: コピー先フォルダ
//               なお、コピー先フォルダはフォルダ名まで記載する必要がある
function uploadSphinxHtml(_srcDirPath,_destDirPath) {

    var objFileSys;
    var _from;
    var _to;

    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _from = objFileSys.BuildPath(_srcDirPath,"");
    _to = objFileSys.BuildPath(_destDirPath,"");

    // WScript.echo("copy " + _from + "\nto " + _to);
    // DEBUG

    objFileSys.CopyFolder(_from, _to, true);
    

}

// create Sphinx index.rst File
// index.rst ファイルを生成する
function createRstIndexFile() {

    var objFileSys;
    var _destFileName;
    var _destFilePath;

    objFileSys = WScript.CreateObject("Scripting.FileSystemObject");	// Create File System Object
    _destFileName = "index.rst";
    _destFilePath = objFileSys.BuildPath(Dir_sphinxWorkDir,_destFileName);

    adoSaveText(_destFilePath,  headerText + footerText, 'utf-8');

    // WScript.echo("create " + _destFilePath +"\n Index file is\n" + headerText + footerText );
    // DEBUG

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

