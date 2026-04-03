from flask import Flask, render_template, request, jsonify, send_file
import qrcode
import io
import base64

app = Flask(__name__)

def generate_vcard(name, phone, email, company, job_title, website, address, phone2='', whatsapp='', photo_base64=''):
    """Generate vCard format string for contact information
    Note: Photo is NOT included in QR code as it makes the data too large.
    Photo is only shown on the card preview.
    """
    # Start vCard - Using version 3.0 for best compatibility
    vcard = "BEGIN:VCARD\nVERSION:3.0\n"

    # Name - properly formatted
    if ' ' in name:
        name_parts = name.split()
        last_name = name_parts[-1]
        first_name = ' '.join(name_parts[:-1])
        vcard += f"FN:{name}\n"
        vcard += f"N:{last_name};{first_name};;;\n"
    else:
        vcard += f"FN:{name}\n"
        vcard += f"N:{name};;;;\n"

    # Primary phone - marked as cell
    vcard += f"TEL;TYPE=CELL:{phone}\n"

    # Second phone if provided
    if phone2:
        vcard += f"TEL;TYPE=HOME:{phone2}\n"

    # WhatsApp - Multiple approaches for maximum compatibility
    if whatsapp:
        # Clean the number for wa.me link (remove everything except digits and plus)
        clean_whatsapp = ''.join(c for c in whatsapp if c.isdigit() or c == '+')

        # Method 1: Add as a separate phone with WhatsApp identifier
        vcard += f"TEL;TYPE=WORK;X-WhatsApp:{whatsapp}\n"

        # Method 2: Add WhatsApp as a URL (works on iOS and Android)
        vcard += f"URL;TYPE=WhatsApp:https://wa.me/{clean_whatsapp}\n"

        # Method 3: Add as a social profile (newer method)
        vcard += f"X-SOCIALPROFILE;TYPE=WhatsApp:https://wa.me/{clean_whatsapp}\n"

        # Method 4: Add a note mentioning WhatsApp
        vcard += f"NOTE:WhatsApp: {whatsapp}\n"

    # Email
    if email:
        vcard += f"EMAIL:{email}\n"

    # Organization and title
    if company:
        vcard += f"ORG:{company}\n"
    if job_title:
        vcard += f"TITLE:{job_title}\n"

    # Website (only if not WhatsApp, since we added WhatsApp URL above)
    if website and website != whatsapp:
        vcard += f"URL:{website}\n"

    # Address
    if address:
        vcard += f"ADR;TYPE=WORK:;;{address};;;;\n"

    # NOTE: We do NOT include PHOTO in QR code as it makes data too large
    # Photo is only displayed on the card itself

    vcard += "END:VCARD"
    return vcard

def generate_qr_code(data):
    """Generate QR code from data and return as base64 image"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Convert image to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    return img_base64

@app.route('/')
def index():
    """Render the main page with the visiting card form"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Generate visiting card with QR code"""
    data = request.json

    name = data.get('name', '')
    phone = data.get('phone', '')
    phone2 = data.get('phone2', '')
    whatsapp = data.get('whatsapp', '')
    email = data.get('email', '')
    company = data.get('company', '')
    job_title = data.get('job_title', '')
    website = data.get('website', '')
    address = data.get('address', '')
    photo_base64 = data.get('photo', '')

    # Generate vCard format
    vcard_data = generate_vcard(name, phone, email, company, job_title, website, address, phone2, whatsapp, photo_base64)

    # Generate QR code
    qr_code_base64 = generate_qr_code(vcard_data)

    return jsonify({
        'success': True,
        'qr_code': qr_code_base64,
        'vcard_data': vcard_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
