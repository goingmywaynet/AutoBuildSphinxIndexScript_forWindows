/*
 * CreateIndex.wsf によって呼ばれる変数定義ファイル
 *
 */

// ************** Constant Definition ***********

// 注意：以下各ディレクトリ変数を宣言する際は\を\\と書いて下さい。
//       ネットワーク上の共有フォルダも指定できます（\\\\hostName\\folderName）
var Dif_appName = "My Knowledge Base";
    // このアプリケーションの名前（実動作にはたいして関係ないので適当でよい）

var Dir_sphinxWorkDir = "D:\\KnowledgeBase.sphinx\\source";
    // Sphinxの.rstを配置するディレクトリ

var Dir_sphinxMakeDir = "D:\\KnowledgeBase.sphinx";
    // make.batフォルダの置き場所
    // 上記と基本的に同じでよいはずだが、変更している場合は記載すること

var Dir_sphinxWorkDirHtml = "D:\\KnowledgeBase.sphinx\\build\\html";
    // Sphinxによってビルドされたhtmlフォルダ

var Dir_indexSearchDir = "D:\\KnowledgeBase";
    // インデックスファイルをサーチする対象
    // このフォルダ配下に対して再帰的にファイルをサーチする

var File_indexFileName = "000_IndexFile.txt";
    // 検索されるインデックスファイル名

var Dir_indexHtmlDir = "D:\\KnowledgeBase.index";
    // Sphinxによってビルドされたhtmlを配置する公開ディレクトリ場所

var File_confPy = "D:\\KnowledgeBase\\conf.py";
	// Sphinx ビルド設定ファイル(conf.py)の保存場所

