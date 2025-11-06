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
exports.registerEnableStubs = registerEnableStubs;
const vscode = __importStar(require("vscode"));
const patchSettings_1 = require("../utils/patchSettings");
function registerEnableStubs(context, stubPath) {
    const disposable = vscode.commands.registerCommand('blenderexec.enableBlenderStubs', () => {
        const wsFolders = vscode.workspace.workspaceFolders;
        if (!wsFolders) {
            vscode.window.showErrorMessage('Open a workspace folder first.');
            return;
        }
        (0, patchSettings_1.patchSettingsWithBlenderStubs)(wsFolders[0].uri.fsPath, stubPath);
    });
    context.subscriptions.push(disposable);
    const watcher = vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'python' && vscode.workspace.workspaceFolders?.length) {
            (0, patchSettings_1.patchSettingsWithBlenderStubs)(vscode.workspace.workspaceFolders[0].uri.fsPath, stubPath);
        }
    });
    context.subscriptions.push(watcher);
}
//# sourceMappingURL=enableStubs.js.map