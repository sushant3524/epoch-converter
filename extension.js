// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { checkPrime } = require('crypto');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "epoch-converter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('epoch-converter.convert', function () 
	{
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor) 
		{
			// retrieve current document
			var doc = editor.document;
			if (!doc) 
			{
				vscode.window.showInformationMessage("No document detected");
			} 
			else 
			{
				// const selection = editor.selection;
				const textSelection = doc.getText().trim();
				
				// retrieve selected text and if nothing is selected, everything is retrieved
				// const textSelection = selection.isEmpty
				// 	? doc.getText().trim()
				// 	: doc.getText(selection).trim();
				//vscode.window.showInformationMessage(doc.getText(doc.getWordRangeAtPosition(new vscode.Position(0,5))));
				if (!textSelection) 
				{
					vscode.window.showInformationMessage("Please provide some text");
				} 
				else 
				{
					try
					{
						var nlines=doc.lineCount;
						var dte=[];
						var pos=[];
						var txt=doc.getText();
						//var str=doc.getText();
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						var ans;
						//var exp0=0;
						//vscode.window.showInformationMessage(txt[0]);

						for(var i=0;i<nlines;i++)
						{
							line=doc.lineAt(i);
							str=line.text;
							
							for(var j=0;j<str.length;j++)
							{
								
								if(str[j]<'0'&&str[j]>'9')
								{
									cnt++;
									continue;
								}
								var curr=new vscode.Position(i,j);
								wrdRnge=doc.getWordRangeAtPosition(curr);
								chck=doc.getText(wrdRnge);
								if((j+chck.length)>str.length||(str.substr(j,chck.length)!==chck))
								{
									cnt++;
									continue;
								}
								cnt=cnt+chck.length-1;
								j=j+chck.length-1;
								//cnt=cnt+chck.length-j+wrdRnge.start.character;
								//vscode.window.showInformationMessage(chck.length.toString());
								if(chck.match(/^-?[0-9]+$/g))
								{
									
									if(chck.length>10)
									{
										cnt++;
										continue;
									}
									nm=Number(chck);
									const safe = (Number.MAX_SAFE_INTEGER + 1)/1000;
									if(nm>safe||nm<315532800)
									{
										cnt++;
										continue;
									}
									//exp0++;
									ans=new Date(nm*1000);
									//dte.push(ans);
									//pos.push(wrdRnge);
									dte.push(" '"+ans.toDateString()+" "+ans.toTimeString()+"' ");
									pos.push(cnt+1);
									// txt=txt.substr(0,j+cnt)+txt[i].substr(j+cnt).replace(chck,chck+" '"+ans.toDateString()+" "+ans.toTimeString()+"'");
									// cnt=cnt+4+ans.toDateString().length+ans.toTimeString().length;
									//var cmnt=vscode.comments.createCommentController((i).toString(),ans.toDateString()+" "+ans.toTimeString());
					
									//cmnt.createCommentThread(doc.uri,wrdRnge,"shkdhkds");

								}
								cnt++;
							}
							cnt++;
						}
						cnt=0;
						var final="";
						//var x=0;
						//vscode.window.showInformationMessage(exp0.toString());
						// for(var i=0;i<txt.length;i++)
						// {
						// 	if(x<pos.length&&pos[x]==i)
						// 	{
						// 		final=final.concat(dte[i]);
						// 		x++;
						// 	}
						// 	final=final.concat(txt.charAt(i));
						// }
						for(var i=0;i<dte.length;i++)
						{
							final=final+txt.slice(cnt,pos[i])+dte[i];
							cnt=pos[i];
						}					
						final=final+txt.slice(cnt);
						editor.edit((builder) => builder.replace(new vscode.Range(new vscode.Position(0, 0),
							new vscode.Position(doc.lineCount, 0)),final)).then((success)=>
							{
								console.log("Created timestamp successfully: " + success);
								vscode.window.showInformationMessage("Created timestamp successfully!");
							
							});
					}
					catch (error) 
					{
						console.log("Error occurred: " + error);
						vscode.window.showInformationMessage("Unable to process text due to " + error);
					}
						
				}
			}
		}
			// Display a message box to the user
			//vscode.window.showInformationMessage('Hello World from Epoch-Converter!');
			
	});

	context.subscriptions.push(disposable);

	let reverse = vscode.commands.registerCommand('epoch-converter.reverse', function () 
	{
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor) 
		{
			// retrieve current document
			var doc = editor.document;
			if (!doc) 
			{
				vscode.window.showInformationMessage("No document detected");
			} 
			else 
			{
				//const selection = editor.selection;
				
				// retrieve selected text and if nothing is selected, everything is retrieved
				const textSelection = doc.getText().trim();
				//vscode.window.showInformationMessage(doc.getText(doc.getWordRangeAtPosition(new vscode.Position(0,5))));
				if (!textSelection) 
				{
					vscode.window.showInformationMessage("Please provide some text");
				} 
				else 
				{
					try
					{
						var nlines=doc.lineCount;
						//var dte=[];
						var pos=[];
						var txt=doc.getText();
						//var str=doc.getText();
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						var ans;
						var tmp1;
						var tmp2;
						//var exp=0;
						//vscode.window.showInformationMessage(txt[0]);

						for(var i=0;i<nlines;i++)
						{
							line=doc.lineAt(i);
							str=line.text;
							
							for(var j=0;j<str.length;j++)
							{
								
								if(str[j]<'0'&&str[j]>'9')
								{
									cnt++;
									continue;
								}
								var curr=new vscode.Position(i,j);
								wrdRnge=doc.getWordRangeAtPosition(curr);
								chck=doc.getText(wrdRnge);
								if((j+chck.length)>str.length||(str.substr(j,chck.length)!==chck))
								{
									cnt++;
									continue;
								}
								cnt=cnt+chck.length-1;
								j=j+chck.length-1;
								//cnt=cnt+chck.length-j+wrdRnge.start.character;
								//vscode.window.showInformationMessage(chck.length.toString());
								if(chck.match(/^-?[0-9]+$/g))
								{
									//exp++;
									if(chck.length>10)
									{
										cnt++;
										continue;
									}
									nm=Number(chck);
									const safe = (Number.MAX_SAFE_INTEGER + 1)/1000;
									if(nm>safe||nm<315532800)
									{
										cnt++;
										continue;
									}
									ans=new Date(nm*1000);
									//dte.push(ans);
									//pos.push(wrdRnge);
									tmp1=" '"+ans.toDateString()+" "+ans.toTimeString()+"' ";
									tmp2=txt.substr(cnt+1,ans.toDateString().length+ans.toTimeString().length+5);
									if(tmp1===tmp2)
									{
										pos.push(cnt+1);
									}

								}
								cnt++;
							}
							cnt++;
						}
						cnt=0;
						var final="";
						//var x=0;
						// vscode.window.showInformationMessage(exp.toString());
						for(var i=0;i<pos.length;i++)
						{
							final=final+txt.slice(cnt,pos[i]);
							cnt=pos[i]+ans.toDateString().length+ans.toTimeString().length+5;
						}					
						final=final+txt.slice(cnt);
						editor.edit((builder) => builder.replace(new vscode.Range(new vscode.Position(0, 0),
							new vscode.Position(doc.lineCount, 0)),final)).then((success)=>
							{
								console.log("Removed timestamp successfully: " + success);
								vscode.window.showInformationMessage("Removed timestamp successfully!");
							
							});
					}
					catch (error) 
					{
						console.log("Error occurred: " + error);
						vscode.window.showInformationMessage("Unable to process text due to " + error);
					}
					
				}
			}
		}
			// Display a message box to the user
			//vscode.window.showInformationMessage('Hello World from Epoch-Converter!');
			
	});

	context.subscriptions.push(reverse);



}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
