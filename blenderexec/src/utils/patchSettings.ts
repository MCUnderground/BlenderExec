import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function patchSettingsWithBlenderStubs(wsRoot: string, stubPath: string) {
    const settingsPath = path.join(wsRoot, '.vscode', 'settings.json');
    let settings: any = {};

    if (fs.existsSync(settingsPath)) {
        try {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        } catch {
            vscode.window.showErrorMessage('Could not parse existing settings.json');
            return;
        }
    }

    const existing: string[] = settings['python.analysis.extraPaths'] || [];
    const normalized = existing.map(p => path.normalize(p));

    if (!normalized.includes(path.normalize(stubPath))) {
        existing.push(stubPath);
        settings['python.analysis.extraPaths'] = existing;
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
        vscode.window.showInformationMessage(
            'Blender stubs enabled for this workspace. Start writing.'
        );
    }
}
