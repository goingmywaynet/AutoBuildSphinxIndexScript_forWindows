/*
 * CreateIndex.wsf によって呼ばれる変数定義ファイル
 *
 */

// ************** Constant Definition ***********

// 注意：以下各ディレクトリ変数を宣言する際は\を\\と書いて下さい。
//       ネットワーク上の共有フォルダも指定できます（\\\\hostName\\folderName）
var Dif_appName = "My Knowledge Base on windows7";
    // このアプリケーションの名前（実動作にはたいして関係ないので適当でよい）

var Dir_sphinxWorkDir = "D:\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase.sphinx\\source";
    // Sphinxの.rstを配置するディレクトリ

var Dir_sphinxMakeDir = "D:\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase.sphinx";
    // make.batフォルダの置き場所
    // 上記と基本的に同じでよいはずだが、変更している場合は記載すること

var Dir_sphinxWorkDirHtml = "D:\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase.sphinx\\build\\html";
    // Sphinxによってビルドされたhtmlフォルダ

var Dir_indexSearchDir = "\\\\vmware-host\\Shared Folders\\VMWareShared\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase";
    // インデックスファイルをサーチする対象
    // このフォルダ配下に対して再帰的にファイルをサーチする

var File_indexFileName = "000_IndexFile.txt";
    // 検索されるインデックスファイル名

var Dir_indexHtmlDir = "\\\\vmware-host\\Shared Folders\\VMWareShared\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase.index";
    // Sphinxによってビルドされたhtmlを配置する公開ディレクトリ場所

var File_confPy = "\\\\vmware-host\\Shared Folders\\VMWareShared\\AutoBuildSphinxIndexScript\\sample\\KnowledgeBase\\conf.py";
    // Sphinx ビルド設定ファイル(conf.py)の保存場所

var Num_FolderDepth4Titles = "1";
    // タイトルとして扱うフォルダ階層 必ず1以上を設定すること

var EnbaleSmblinkReplace = new Boolean(true);
//var EnbaleSmblinkReplace = new Boolean(false);
    // :smblink:ロールのパス変換機能 sphinxcontrib.smblink を使う場合は true 
