
const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context 
 */

function activate(context) {

	console.log('Congratulations, your extension "epoch-converter" is now active!');

	let annotationDecoration= vscode.window.createTextEditorDecorationType({
	after: {
		margin: '0 0 0 0',
		textDecoration: 'none'
	},
	 rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
	//     borderWidth: '1px',
    // borderStyle: 'solid',
    // overviewRulerColor: 'blue',
    // overviewRulerLane: vscode.OverviewRulerLane.Right,
    // light: {
    //     // this color will be used in light color themes
    //     borderColor: 'darkblue'
    // },
    // dark: {
    //     // this color will be used in dark color themes
    //     borderColor: 'lightblue'
    // }

    });

	let disposable = vscode.commands.registerCommand('epoch-converter.getHRT', function () 
	{
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
				const textSelection = doc.getText().trim();
				
				if (!textSelection) 
				{
					vscode.window.showInformationMessage("Please provide some text");
				} 
				else 
				{
					try
					{
						var nlines=doc.lineCount;
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						var ans;
						var fl="";
						var decorationsArray= [];
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
								if(chck.match(/^-?[0-9]+$/g))
								{
									
									if(chck.length>13||chck.length===11)
									{
										cnt++;
										continue;
									}
									
									nm=Number(chck);
									if(chck.length>10)
									{
										fl=" (millisec)";
									}
									else
									{
										fl=" (sec)";
										nm*=1000;
									}
									if(nm<315532800000)
									{
										cnt++;
										continue;
									}
									ans=new Date(nm);
									var dec={renderOptions:{after:{backgroundColor: 'blue', color:'white', contentText: ans.toDateString()+" "+ans.toTimeString()+fl, fontWeight: 'normal',
									fontStyle: 'normal'}}, range:wrdRnge};
									decorationsArray.push(dec);
									
								}
								cnt++;
							}
							cnt++;
						}
						cnt=0;
						editor.setDecorations(annotationDecoration,decorationsArray);
						
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

	let reverse = vscode.commands.registerCommand('epoch-converter.rmvHRT', function () 
	{
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
				// retrieve selected text and if nothing is selected, everything is retrieved
				const textSelection = doc.getText().trim();
				if (!textSelection) 
				{
					vscode.window.showInformationMessage("Please provide some text");
				} 
				else 
				{
					try
					{
						var nlines=doc.lineCount;
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						
					
						var decorationsArray=[];
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
								if(chck.match(/^-?[0-9]+$/g))
								{
									if(chck.length>13||chck.length===11)
									{
										cnt++;
										continue;
									}
									
									nm=Number(chck);
									if(chck.length>10)
									{
										
									}
									else
									{
										
										nm*=1000;
									}
									if(nm<315532800000)
									{
										cnt++;
										continue;
									}
									
									
									var dec={renderOptions:{after:{backgroundColor: 'blue', color:'white', contentText: "", fontWeight: 'normal',
									fontStyle: 'normal'
									// Pull the decoration out of the document flow if we want to be scrollable textDecoration: `none;${false ? '' : ' position: absolute;'}`,
									 }}, range:wrdRnge};
									//dec.range=new vscode.Range(new vscode.Position(i,j),new vscode.Position(i,j));
									decorationsArray.push(dec);
								}
								cnt++;
							}
							cnt++;
						}
						editor.setDecorations(annotationDecoration,decorationsArray);
						
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
