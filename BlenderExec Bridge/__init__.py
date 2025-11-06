bl_info = {
    "name": "BlenderExec Bridge",
    "author": "MCUnderground",
    "version": (1, 4),
    "blender": (4, 4, 3),
    "location": "Text Editor > Tools",
    "description": "Receive Python code from VS Code",
    "category": "Development",
}

import socket
import threading
import json
import os
import atexit
import bpy

# --- Paths & Globals ---
APPDATA = os.path.join(os.path.expanduser("~"), ".blenderexec")
os.makedirs(APPDATA, exist_ok=True)
INSTANCES_FILE = os.path.join(APPDATA, "instances.json")

port = None  # Assigned later
_server_thread = None
_last_filepath = None  # Track name changes


# --- Helper Functions ---
def find_free_port():
    s = socket.socket()
    s.bind(('', 0))
    port_num = s.getsockname()[1]
    s.close()
    return port_num


def update_instance_title(dummy=None):
    """Update this Blender instance in the instances.json file."""
    global port

    try:
        title = "Untitled"
        if bpy.data.filepath:
            title = os.path.basename(bpy.data.filepath)
    except Exception:
        title = "Untitled"

    instance = {"title": title, "port": port}

    # Load current list
    try:
        if os.path.exists(INSTANCES_FILE):
            with open(INSTANCES_FILE, "r") as f:
                instances = json.load(f)
        else:
            instances = []
    except Exception:
        instances = []

    # Replace this instance entry
    instances = [i for i in instances if i.get("port") != port]
    instances.append(instance)

    with open(INSTANCES_FILE, "w") as f:
        json.dump(instances, f)


def remove_instance():
    """Remove this Blender instance from instances.json on exit."""
    global port
    try:
        if os.path.exists(INSTANCES_FILE):
            with open(INSTANCES_FILE, "r") as f:
                instances = json.load(f)
            instances = [i for i in instances if i.get("port") != port]
            with open(INSTANCES_FILE, "w") as f:
                json.dump(instances, f)
    except Exception:
        pass


# --- TCP Server ---
def server_thread():
    global port
    s = socket.socket()
    s.bind(("localhost", port))
    s.listen(1)
    print(f"[BlenderExec] Listening on port {port}")
    while True:
        conn, _ = s.accept()
        data = b""
        while True:
            packet = conn.recv(4096)
            if not packet:
                break
            data += packet
        try:
            exec(data.decode(), globals(), globals())
        except Exception as e:
            print(f"[BlenderExec] Error executing code: {e}")
        conn.close()


# --- Handlers ---
def check_filename_change(scene=None):
    """Handler: detect file name changes and update instance list."""
    global _last_filepath
    current_path = bpy.data.filepath
    if current_path != _last_filepath:
        _last_filepath = current_path
        update_instance_title()


# --- Register / Unregister ---
def deferred_start(dummy=None):
    """Start TCP server and register instance after Blender is ready."""
    global port, _server_thread, _last_filepath
    port = find_free_port()
    _last_filepath = bpy.data.filepath
    update_instance_title()

    _server_thread = threading.Thread(target=server_thread, daemon=True)
    _server_thread.start()


def register():
    # Start after Blender UI is ready
    bpy.app.timers.register(deferred_start, first_interval=0.1)

    # Update title when saving/loading
    bpy.app.handlers.save_post.append(update_instance_title)
    bpy.app.handlers.load_post.append(update_instance_title)

    # Detect filename change dynamically
    bpy.app.handlers.depsgraph_update_post.append(check_filename_change)

    # Clean up on exit
    atexit.register(remove_instance)


def unregister():
    remove_instance()
    for handler_list, fn in [
        (bpy.app.handlers.save_post, update_instance_title),
        (bpy.app.handlers.load_post, update_instance_title),
        (bpy.app.handlers.depsgraph_update_post, check_filename_change),
    ]:
        if fn in handler_list:
            handler_list.remove(fn)
