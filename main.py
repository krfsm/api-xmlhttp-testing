import http.server
import json
import os
import random
import socketserver
import time

PORT = 8080

serve_from = os.getcwd()

class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = serve_from + self.path
        print(self.path)
        if not os.path.abspath(path).startswith(serve_from):
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'Private!')
        elif os.path.isdir(path):
            try:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(str(os.listdir(path)).encode())
            except Exception:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b'error')
        else:
            try:
                with open(path, 'rb') as f:
                    data = f.read()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(data)
            # error handling skipped
            except Exception:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b'error')
    def do_POST(self):
        print(self.path)
        if (self.path == "/login.json"):
            success = random.random()
            if (success < 0.01):
                self.send_error(500)
            elif (success < 0.02):
                self.send_error(403)
            elif (success < 0.03):
                self.send_error(404)
            else:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                content_len = int(self.headers.get('Content-Length'))
                post_body = json.loads(str(self.rfile.read(content_len), encoding="utf-8"))
                print("Request payload: " + json.dumps(post_body))
                endpoint = post_body['endpoint']
                locale = post_body['locale']
                market = post_body['market']
                currencies = ['EUR', 'SEK', 'RON', 'USD', 'GBP']
                currency = random.choice(currencies)
                return_string_1 = '{"login": "success", "currency": "' + currency + '", "locale": "' + locale
                return_string = return_string_1 + '", "market": "' + market + '", "endpoint": "' + endpoint + '"}'
                self.wfile.write(bytes(str(return_string), encoding="utf-8"))

httpd = socketserver.TCPServer(("", PORT), MyHandler)
print("Server started on ", PORT)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
print("Server stopped.")