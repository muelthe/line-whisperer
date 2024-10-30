const vscode = require('vscode');

let statusBarItem;

function getConfig() {
    return vscode.workspace.getConfiguration('lineWhisperer');
}

async function getOriginalLineEndings(text) {
    const config = getConfig();
    const defaultPreference = config.get('defaultLineEnding');
    
    if (defaultPreference !== 'auto') {
        return defaultPreference === 'LF' ? '\n' : '\r\n';
    }

    // Detect existing line endings in the text
    const crlfMatch = text.match(/\r\n/g);
    const lfMatch = text.match(/[^\r]\n/g);
    
    // If we find mostly LF endings, preserve them
    if ((!crlfMatch && lfMatch) || (lfMatch && crlfMatch && lfMatch.length > crlfMatch.length)) {
        return '\n';
    }
    return '\r\n'; // Default to CRLF if unsure
}

async function updateStatusBarItem(editor) {
    const config = getConfig();
    if (!config.get('showStatusBarIcon')) {
        statusBarItem.hide();
        return;
    }

    if (!editor) {
        statusBarItem.hide();
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        statusBarItem.text = "$(paintcan) Line Whisperer";
        statusBarItem.tooltip = "Select text to copy with preserved line endings";
    } else {
        const text = editor.document.getText(selection);
        const lineEnding = await getOriginalLineEndings(text);
        const endingType = lineEnding === '\n' ? 'LF' : 'CRLF';
        statusBarItem.text = `$(paintcan) Line Whisperer (${endingType})`;
        statusBarItem.tooltip = `Click to copy with ${endingType} line endings`;
    }
    
    statusBarItem.show();
}

function activate(context) {
    console.log('Line Whisperer is now active!');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'line-whisperer.preserveCopy';
    context.subscriptions.push(statusBarItem);

    // Initialize status bar
    updateStatusBarItem(vscode.window.activeTextEditor);

    // Watch for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('lineWhisperer')) {
                updateStatusBarItem(vscode.window.activeTextEditor);
            }
        })
    );

    // Update status bar when selection changes
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(event => {
            updateStatusBarItem(event.textEditor);
        })
    );

    // Update status bar when active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            updateStatusBarItem(editor);
        })
    );

    let disposable = vscode.commands.registerCommand('line-whisperer.preserveCopy', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text) {
            vscode.window.showInformationMessage('No text selected!');
            return;
        }

        const lineEnding = await getOriginalLineEndings(text);
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const finalText = normalizedText.replace(/\n/g, lineEnding);

        await vscode.env.clipboard.writeText(finalText);
        
        // Flash the status bar item to indicate success
        const originalBg = statusBarItem.backgroundColor;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        setTimeout(() => {
            statusBarItem.backgroundColor = originalBg;
        }, 200);
        
        const endingType = lineEnding === '\n' ? 'LF' : 'CRLF';
        vscode.window.showInformationMessage(`Text copied with ${endingType} line endings!`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
}