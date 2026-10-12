import http.server
import socketserver
import os
import sys
import threading
import random
import string
class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

PAGE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')

class CustomHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.rstrip('/')
        # Log every request to console
        print(f"GET {self.client_address[0]} {self.path}", flush=True)
        if path == '' or path == '/':
            self.serve_file('index.html')
        elif path == '/app.js':
            self.serve_file('app.js')
        elif path == '/styles.css':
            self.serve_file('styles.css')
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes("".join(random.choices(string.ascii_letters + string.digits + " ", k=random.randint(100, 1000))), "utf-8"))
    
    def serve_file(self, filename):
        filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            self.send_response(200)
            if filename.endswith('.html'):
                self.send_header('Content-type', 'text/html')
            elif filename.endswith('.js'):
                self.send_header('Content-type', 'application/javascript')
            elif filename.endswith('.css'):
                self.send_header('Content-type', 'text/css')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes("".join(random.choices(string.ascii_letters + string.digits + " ", k=random.randint(100, 1000))), "utf-8"))
    
    def log_message(self, format, *args):
        # Custom logging to show in console
        print(f"[HTTP] {self.path}", flush=True)

PORT = 3000
httpd = ReusableTCPServer(("", PORT), CustomHandler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
print(f"Server running at http://localhost:{PORT}", flush=True)
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nShutting down", flush=True)
    httpd.shutdown()
