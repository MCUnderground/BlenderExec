"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectInstanceCommand = selectInstanceCommand;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const net = __importStar(require("net"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
let selectedInstance = null;
function sendCodeToBlender(code) {
    return new Promise((resolve, reject) => {
        if (!selectedInstance) {
            vscode.window.showErrorMessage('No Blender instance selected!');
            return reject('No instance');
        }
        const client = new net.Socket();
        client.connect(selectedInstance.port, selectedInstance.host, () => {
            client.write(code);
            client.end();
            resolve();
        });
        client.on('error', (err) => {
            vscode.window.showErrorMessage('Failed to send code to Blender: ' + err.message);
            reject(err);
        });
    });
}
async function selectInstanceCommand() {
    const file = path.join(os.homedir(), '.blenderexec', 'instances.json');
    if (!fs.existsSync(file)) {
        vscode.window.showErrorMessage('No Blender instances found!');
        return;
    }
    let instances = JSON.parse(fs.readFileSync(file, 'utf-8'));
    instances = instances.filter(i => i.port && !isNaN(i.port));
    if (instances.length === 0) {
        vscode.window.showErrorMessage('No valid Blender instances found!');
        return;
    }
    const picked = await vscode.window.showQuickPick(instances.map(i => ({ label: i.title, description: i.port.toString() })), { placeHolder: 'Select Blender instance' });
    if (!picked)
        return;
    selectedInstance = { host: '127.0.0.1', port: parseInt(picked.description) };
    vscode.window.showInformationMessage(`BlenderExec instance selected: ${picked.label}`);
}
async function sendFullFileCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const code = editor.document.getText();
    await sendCodeToBlender(code);
    vscode.window.showInformationMessage('Full file sent to Blender!');
}
async function sendSelectionCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    let code = editor.document.getText(editor.selection);
    // If selection is empty, send the current line
    if (!code || code.trim() === "") {
        const line = editor.selection.active.line;
        code = editor.document.lineAt(line).text;
    }
    if (!code || code.trim() === "") {
        vscode.window.showWarningMessage('No code to send!');
        return;
    }
    await sendCodeToBlender(code);
    vscode.window.showInformationMessage('Selection sent to Blender!');
}
function activate(context) {
    console.log('BlenderExec extension is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.selectInstance', selectInstanceCommand));
    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.sendFullFile', sendFullFileCommand));
    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.sendSelection', sendSelectionCommand));
}
// Called when extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map