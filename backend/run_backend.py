import os
import sys
import time
import subprocess
import socket

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def kill_port_8000():
    try:
        cmd = 'powershell -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"'
        subprocess.run(cmd, shell=True)
    except Exception as e:
        print(f"Kill error: {e}")

if __name__ == "__main__":
    print("Stopping any process on port 8000...")
    kill_port_8000()
    time.sleep(2)
    
    print("Starting FastAPI Uvicorn server on http://localhost:8000...")
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
