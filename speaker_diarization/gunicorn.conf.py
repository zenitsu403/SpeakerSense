import os

port = int(os.environ.get('PORT', 8000))
bind = f"0.0.0.0:{port}"
workers = 4