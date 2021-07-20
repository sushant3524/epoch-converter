
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

	var dispose_hover=vscode.languages.registerHoverProvider({language: "*", scheme: "*"},
	{
		provideHover(document, position, token) 
		{
			var rnge=document.getWordRangeAtPosition(position);
			var y=document.getText(rnge);
			if(y.match(/^-?[0-9]+$/g)&&vscode.workspace.getConfiguration('epoch-converter').get('usingHover'))
			{
				if(y.length>13||y.length===11)
				return null;
				var nm=Number(y);
				var fl=" (millisec)";
				if(y.length<11)
				{
					fl=" (sec)";
					nm*=1000;
				}
				if(nm<315532800000)
				{
					return null;
				}
				var ans=new Date(nm);
				if(!vscode.workspace.getConfiguration('epoch-converter').get('setTimezone'))
					return new vscode.Hover(ans.toUTCString()+fl);
				var hvr=new vscode.Hover(ans.toDateString()+" "+ans.toTimeString()+fl);
				return hvr;
			}
			else return null;

		}
	});
	context.subscriptions.push(dispose_hover);

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
				else if(vscode.workspace.getConfiguration('epoch-converter').get('Unobstrusive'))
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
									var cont=ans.toString();
									if(!vscode.workspace.getConfiguration('epoch-converter').get('setTimezone'))
										cont=ans.toUTCString();
									var dec={renderOptions:{after:{backgroundColor: 'blue', color:'white', contentText: " "+cont+fl, fontWeight: 'normal',
									fontStyle: 'normal'}}, range:wrdRnge};
									decorationsArray.push(dec);
									
								}
								cnt++;
							}
							cnt++;
						}
						cnt=0;
						editor.setDecorations(annotationDecoration,decorationsArray);
						console.log("Created timestamp successfully");
						
					}
					catch (error) 
					{
						console.log("Error occurred: " + error);
						vscode.window.showInformationMessage("Unable to process text due to " + error);
					}
						
				}
				else
				{
					try
					{
						var nlines=doc.lineCount;
						var dte=[];
						var pos=[];
						var txt=doc.getText();
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						var ans;

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
									ans=new Date(nm);
									var cont=ans.toString();
									if(!vscode.workspace.getConfiguration('epoch-converter').get('setTimezone'))
										cont=ans.toUTCString();
									dte.push(" '"+cont+"' ");
									pos.push(cnt+1);

								}
								cnt++;
							}
							cnt++;
						}
						cnt=0;
						var final="";
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
				const textSelection = doc.getText().trim();
				if (!textSelection) 
				{
					vscode.window.showInformationMessage("Please provide some text");
				} 
				else if(vscode.workspace.getConfiguration('epoch-converter').get('Unobstrusive'))
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
									 }}, range:wrdRnge};
									decorationsArray.push(dec);
								}
								cnt++;
							}
							cnt++;
						}
						editor.setDecorations(annotationDecoration,decorationsArray);
						console.log("Removed timestamp successfully");
						
					}
					catch (error) 
					{
						console.log("Error occurred: " + error);
						vscode.window.showInformationMessage("Unable to process text due to " + error);
					}
					
				}
				else
				{
					try
					{
						var nlines=doc.lineCount;
						var pos=[];
						var txt=doc.getText();
						var cnt=0;
						var wrdRnge;
						var chck;
						var line;
						var str;
						var nm;
						var ans;
						var tmp1;
						var tmp2;

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
									//exp++;
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
									ans=new Date(nm);
									var cont=ans.toString();
									if(!vscode.workspace.getConfiguration('epoch-converter').get('setTimezone'))
										cont=ans.toUTCString();
									tmp1=" '"+cont+"' ";
									tmp2=txt.substr(cnt+1,cont.length+4);
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
						for(var i=0;i<pos.length;i++)
						{
							final=final+txt.slice(cnt,pos[i]);
							cnt=pos[i]+cont.length+4;
						}					
						final=final+txt.slice(cnt);
						editor.edit((builder) => builder.replace(new vscode.Range(new vscode.Position(0, 0),
							new vscode.Position(doc.lineCount, 0)),final)).then((success)=>
							{
								console.log("Removed timestamp successfully: " + success);

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
			
	});

	context.subscriptions.push(reverse);



}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
