# BlenderExec

**BlenderExec** for VS Code  
Supercharge your Blender Python development with **IntelliSense**, **hot-reload**, and seamless script execution.

BlenderExec provides syntax highlighting, snippets, and **full auto-completion** powered by **Blender Python API stubs** (from [fake-bpy-module](https://github.com/nutti/fake-bpy-module)) — plus commands for sending scripts directly to a running Blender instance.

---

## ✨ Features

- 📦 **Bundled Blender API Stubs**  
  Provides IntelliSense, type hints, and docstrings for Blender’s Python API.  
  *(Stubs are generated using [fake-bpy-module](https://github.com/nutti/fake-bpy-module).)*

- ⚡ **Auto-Enable IntelliSense**  
  Automatically injects the Blender API stub path into `python.analysis.extraPaths` when opening a Python file in a workspace.

- 🛠 **Manual Command Support**  
  Enable Blender IntelliSense on demand via  
  `BlenderExec: Enable Blender API IntelliSense`.

- 🚀 **Direct Script Execution**  
  Send your Python scripts or selections from VS Code directly to a running Blender instance.

- 🔄 **Hot-Reloadable Development**  
  Instantly test scripts in Blender without restarting, perfect for fast iteration.

---

## 🛠 Commands

| Command | Description |
|---------|-------------|
| `BlenderExec: Select Blender Instance` | Select a running Blender instance to target for script execution. |
| `BlenderExec: Send Full File to Blender` | Sends the current `.py` file to Blender for execution. |
| `BlenderExec: Send Selection to Blender` | Sends only the currently selected code to Blender. |
| `BlenderExec: Enable Blender API IntelliSense` | Injects the Blender API stub path into workspace settings. |

### 🔑 Keybindings

| Keybinding | Action |
|------------|--------|
| `Ctrl+Alt+E` | Select Blender Instance |
| `Ctrl+Shift+E` | Send Full File to Blender |
| `Ctrl+Shift+S` | Send Selection to Blender |
| `Ctrl+Alt+Shift+B` | Enable Blender API IntelliSense |

---

## 🚀 Workflow

### 0. Install Blender Addon (Required)

Before using script execution features, install the **BlenderExec Bridge** addon in Blender:

1. Download: [BlenderExec.Bridge.Addon.zip](https://github.com/MCUnderground/BlenderExec/releases/latest/download/BlenderExec.Bridge.Addon.zip)
2. In Blender: `Edit` → `Preferences` → `Add-ons` → `Install...` → Select the zip → Enable addon

---

### 1. Enable Blender IntelliSense

Run **`BlenderExec: Enable Blender API IntelliSense`** (`Ctrl+Alt+Shift+B`).  
This automatically injects the bundled Blender stubs into VS Code, giving you **full autocomplete and type hints**.

> ⚠ Works only inside a workspace folder. Single-file editing without a workspace will not enable IntelliSense.

---

### 2. Select Blender Instance

Run **`BlenderExec: Select Blender Instance`** (`Ctrl+Alt+E`) to choose which Blender process will receive scripts.  
Multiple Blender instances? No problem — just select the desired one from the list.

---

### 3. Send Python Scripts

- **Full File**: `BlenderExec: Send Full File to Blender` (`Ctrl+Shift+E`)  
- **Selection Only**: `BlenderExec: Send Selection to Blender` (`Ctrl+Shift+S`)

Your code executes immediately inside Blender’s Python environment.  
Perfect for rapid testing and iterative development.

---

## ⚙ How It Works

1. **Stub Path Injection**  
   On activation or when opening a Python file, BlenderExec injects the bundled stubs into `python.analysis.extraPaths`.

2. **Instance Management**  
   Detects running Blender instances and lets you pick one as the execution target.

3. **Script Execution**  
   Sends the full file or selection to Blender using a TCP/IPC-based connection for immediate execution.

---

## 📦 Requirements

- **Blender** installed on your system (any recent version supported by fake-bpy-module).  
- **VS Code 1.60.0+**  
- **Python extension (Pylance)** for IntelliSense.  
- **BlenderExec Bridge Addon** installed in Blender for script execution.

### Installing the Blender Addon

To send code from VS Code to Blender, you need to install the BlenderExec Bridge addon:

1. **Download** the addon: [BlenderExec.Bridge.Addon.zip](https://github.com/MCUnderground/BlenderExec/releases/latest/download/BlenderExec.Bridge.Addon.zip)
2. **Install** in Blender:
   - Open Blender → `Edit` → `Preferences` → `Add-ons`
   - Click `Install...` and select the downloaded `.zip` file
   - Enable the **BlenderExec Bridge** addon

> 📥 **Latest Release**: [Release](https://github.com/MCUnderground/BlenderExec/releases/latest)  
> 🏪 **VS Code Marketplace**: [BlenderExec Extension](https://marketplace.visualstudio.com/items?itemName=MCUnderground.blenderexec)  
> 🔗 **Source Code**: [BlenderExec Bridge](https://github.com/MCUnderground/BlenderExec/tree/main/BlenderExec%20Bridge)  

---

## 🧪 Troubleshooting

- ❌ **No IntelliSense**: Ensure your workspace is a folder (not just a single `.py` file).  
- ⚠ **Wrong stub path**: Run `BlenderExec: Enable Blender API IntelliSense`.  
- 🔄 **Scripts not executing**: Ensure you have selected a running Blender instance.

---

## 🙏 Acknowledgments

Special thanks to:  

- [**Blender Foundation**](https://www.blender.org/) for creating an amazing open-source 3D suite.  
- [**nutti/fake-bpy-module**](https://github.com/nutti/fake-bpy-module) for the Blender API stubs used in IntelliSense.  

BlenderExec wouldn’t exist without their incredible work. 💙  

---

## 📷 Icon

![BlenderExec Icon](images/icon.png)