/*=====================================
* ファイル操作ライブラリ
* =====================================
*
* Files_getFileSize(_strDirPath,_strFileName)
* - ファイルのサイズを返す
* - 引数 _strDirPath : ファイルのフォルダ
* - 引数 _strFileName : ファイル名
* - 返り値 : ファイルサイズ
*
* Files_getFileDate(_strDirPath,_strFileName)
* - ファイルの最終更新日を返す
* - 引数 _strDirPath : ファイルのフォルダ
* - 引数 _strFileName : ファイル名
* - 返り値 : ファイル更新日
* 
* Files_getTextLine(_strDirPath,_strFileName,_intEndCounter) 
* - 指定行のもり列を返す
* - 引数 _strDirPath : ファイルのフォルダ
* - 引数 _strFileName : ファイル名
* - 引数 _intEndCounter : 行番号
* - 返り値 : 文字列
* 
* Files_copyFile(_src,_dest)
* - 指定したファイルを指定フォルダ配下に（上書き）コピーする
* - 引数 _src : コピー元
* - 引数 _dest: コピー先フォルダ
*               なお、コピー先フォルダはフォルダ名まで記載する必要がある
*
* Files_deleteFile(_file,_force)
* - 指定したファイルを削除する
* - 引数 _file : 削除するファイルの名前を指定します。パスの最後の構成要素内ではワイルドカード文字も使用可。
* - 引数 _force: True だと、読み取り専用の属性を持つファイルも削除されます。
*
*/

//=====================================
//ファイルのサイズを返す関数
//=====================================
function Files_getFileSize(_strDirPath,_strFileName) {

   var _objFileSys;     //ファイルシステムオブジェクト
   var _objFile;        //ファイルポインタ
   var _strFilePath;    //ファイルへのフルパス
   var _intFileSize;    //ファイルサイズ

   //ファイルシステムオブジェクトの作成
   _objFileSys = new ActiveXObject("Scripting.FileSystemObject");

   //読み込むファイルのフルパスを編集
   _strFilePath = _objFileSys.BuildPath(_strDirPath,_strFileName);

 try {
       //GetFileでファイルの情報を得ます
       _objFile = _objFileSys.GetFile(_strFilePath);
       _intFileSize = _objFile.Size;

    } catch(e) {
      //ファイルが無い場合は -1 を返す (2011/08/18 Update)
      _intFileSize = -1
    }


   //⑰オブジェクトの破棄
   _objFile = null;
   _objFileSys = null;

   return _intFileSize;  //ファイルサイズを返す

}

//=============================================================
//ファイルの最終更新日を返す関数
//=============================================================
function Files_getFileDate(_strDirPath,_strFileName) {

   var _objFileSys;     //ファイルシステムオブジェクト
   var _objFile;        //ファイルポインタ
   var _strFilePath;    //ファイルへのフルパス
   var _intFileDate;    //ファイル最終更新日

   //ファイルシステムオブジェクトの作成
   _objFileSys = new ActiveXObject("Scripting.FileSystemObject");

   //読み込むファイルのフルパスを編集
   _strFilePath = _objFileSys.BuildPath(_strDirPath,_strFileName);

 try {
       //GetFileでファイルの情報を得ます
       _objFile = _objFileSys.GetFile(_strFilePath);
       _intFileDate = _objFile.DateLastModified;

    } catch(e) {
      //ファイルが無い場合は -1 を返す (2011/08/18 Update)
      _intFileDate = -1
    }


   //⑰オブジェクトの破棄
   _objFile = null;
   _objFileSys = null;

   return _intFileDate;  //ファイル最終更新日を返す

}


//=============================================================
//ファイルの特定文字列を返す関数
//=============================================================
function Files_getTextLine(_strDirPath,_strFileName,_intEndCounter) {

   var _objFileSys;     //ファイルシステムオブジェクト
   var _objFile;        //ファイルポインタ
   var _strFilePath;    //ファイルへのフルパス
   var _TextStream;    //ファイルTextStream
   var _strTextLine;    //返す文字列

	//ファイル処理用定数
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;

   //ファイルシステムオブジェクトの作成
   _objFileSys = new ActiveXObject("Scripting.FileSystemObject");

   //読み込むファイルのフルパスを編集
   _strFilePath = _objFileSys.BuildPath(_strDirPath,_strFileName);

 try {
       //GetFileでファイルの情報を得ます
       _objFile = _objFileSys.GetFile(_strFilePath);
       _TextStream = _objFile.OpenAsTextStream(ForReading,TristateUseDefault);

    } catch(e) {
      //ファイルが無い場合は 0 を返す (2011/10/18 Update)
      _TextStream = 0;
      _strTextLine = 0;
    }


	// ファイル内の指定行を返す処理

	if ( _TextStream ) {
	var _intCounter = 1;

	while (!_TextStream.AtEndOfStream)　{

		if ( _intCounter == _intEndCounter ) {

			_strTextLine = _TextStream.ReadLine();
			break;

		} else {

			_TextStream.SkipLine();
			_intCounter++;

		}

	}
	}

   //⑰オブジェクトの破棄
   _objFile = null;
   _objFileSys = null;
   _intCounter = null;

   return _strTextLine;  //ファイル内容を返す

}

/* 
* Files_copyFile(_src,_dest)
* - 指定したファイルを指定フォルダ配下に（上書き）コピーする
* - 引数 _src : コピー元
* - 引数 _dest: コピー先フォルダ
*               なお、コピー先フォルダはフォルダ名まで記載する必要がある
*/
function Files_copyFile(_src,_dest) {

    var objFileSys = WScript.CreateObject("Scripting.FileSystemObject");
    var _from = objFileSys.BuildPath(_src,"");
    var _to = objFileSys.BuildPath(_dest,"");

	try {
		objFileSys.CopyFile(_from, _to, true);
	} catch (e) {
		var WshShell = WScript.CreateObject("WScript.Shell");
		WshShell.Popup("ファイル " + _from + " のCopyに失敗しました\nError Code =" + e.message , 0 , "Files_copyFile" , 48);
		WshShell = null;
	}


}

/*
* Files_deleteFile(_file,_force)
* - 指定したファイルを削除する
* - 引数 _file : 削除するファイルの名前を指定します。パスの最後の構成要素内ではワイルドカード文字も使用可。
* - 引数 _force: True だと、読み取り専用の属性を持つファイルも削除されます。
*/

function Files_deleteFile(_file,_force) {

	var objFileSys = WScript.CreateObject("Scripting.FileSystemObject");

	if ( _force != "" ) {
		try {
			objFileSys.DeleteFile(_file,_force);
		} catch (e) {
			if (e.number != -2146828235) {
			var WshShell = WScript.CreateObject("WScript.Shell");
			WshShell.Popup("ファイル " + _file + " の削除に失敗しました\nError Code =" + e.message , 0 , "Files_deleteFile" , 48);
			WshShell = null;
			}
		}
	} else {
		try {
			objFileSys.DeleteFile(_file);
		} catch (e) {
			if (e.number != -2146828235) {
			var WshShell = WScript.CreateObject("WScript.Shell");
			WshShell.Popup("ファイル " + _file + " の削除に失敗しました\nError Code =" + e.message , 0 , "Files_deleteFile" , 48);
			WshShell = null;
			}
		}
	}


}
