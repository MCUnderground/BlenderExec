import * as vscode from 'vscode';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { registerEnableStubs } from './commands/enableStubs';

let selectedInstance: { host: string, port: number } | null = null;

function sendCodeToBlender(code: string) {
    return new Promise<void>((resolve, reject) => {
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

        // <-- This is where the error handler goes -->
        client.on('error', (err) => {
            vscode.window.showErrorMessage('Failed to send code to Blender: ' + err.message);

            // Auto-remove dead instance
            const file = path.join(os.homedir(), '.blenderexec', 'instances.json');
            if (fs.existsSync(file) && selectedInstance) {
                try {
                    let list = JSON.parse(fs.readFileSync(file, 'utf-8')) as BlenderInstance[];
                    list = list.filter(i => i.port !== selectedInstance!.port);
                    fs.writeFileSync(file, JSON.stringify(list, null, 2));
                } catch {}
            }

            reject(err);
        });
    });
}


interface BlenderInstance {
    title: string;
    port: number;
}


export async function selectInstanceCommand() {
    const file = path.join(os.homedir(), '.blenderexec', 'instances.json');

    if (!fs.existsSync(file)) {
        vscode.window.showErrorMessage('No Blender instances found!');
        return;
    }

    let instances: BlenderInstance[] = [];
    try {
        instances = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
        vscode.window.showErrorMessage('Failed to read instances.json');
        return;
    }

    instances = instances.filter(i => i.port && !isNaN(i.port));

    // --- Check which instances are still alive ---
    const alive: BlenderInstance[] = [];
    for (const inst of instances) {
        const socket = new net.Socket();
        const isAlive = await new Promise<boolean>((resolve) => {
            socket.setTimeout(250);
            socket.once('error', () => resolve(false));
            socket.once('timeout', () => resolve(false));
            socket.connect(inst.port, '127.0.0.1', () => {
                socket.end();
                resolve(true);
            });
        });
        if (isAlive) alive.push(inst);
    }

    // --- Save cleaned list ---
    if (alive.length !== instances.length) {
        fs.writeFileSync(file, JSON.stringify(alive, null, 2));
    }

    if (alive.length === 0) {
        vscode.window.showErrorMessage('No active Blender instances found!');
        return;
    }

    const picked = await vscode.window.showQuickPick(
        alive.map(i => ({ label: i.title, description: i.port.toString() })),
        { placeHolder: 'Select Blender instance' }
    );

    if (!picked) return;

    selectedInstance = { host: '127.0.0.1', port: parseInt(picked.description!) };
    vscode.window.showInformationMessage(`BlenderExec instance selected: ${picked.label}`);
}


async function sendFullFileCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const code = editor.document.getText();
    await sendCodeToBlender(code);
    vscode.window.showInformationMessage('Full file sent to Blender!');
}

async function sendSelectionCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

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

export function activate(context: vscode.ExtensionContext) {
    console.log('BlenderExec extension is now active!');
    const stubPath = path.join(context.extensionPath, 'blender-lang');
    registerEnableStubs(context, stubPath);

    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.selectInstance', selectInstanceCommand));
    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.sendFullFile', sendFullFileCommand));
    context.subscriptions.push(vscode.commands.registerCommand('blenderexec.sendSelection', sendSelectionCommand));
}

// Called when extension is deactivated
export function deactivate() {}
