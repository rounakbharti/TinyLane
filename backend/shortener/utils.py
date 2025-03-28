import random
import string
import qrcode
import os
from django.conf import settings

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_qr_code(url, short_code):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    path = os.path.join(settings.MEDIA_ROOT, 'qr_codes', f'{short_code}.png')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)
    return f'qr_codes/{short_code}.png'