# Visiting Card QR Code Generator

A web application that allows you to create digital visiting cards with QR codes. When someone scans the QR code with their phone, they can save your contact information directly to their contacts.

## Features

- Create beautiful digital visiting cards
- Generate QR codes with vCard format
- Scan QR code to save contact information to phone
- Download QR code as PNG image
- Responsive design for mobile and desktop
- Beautiful gradient UI

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Navigate to the visting_cards directory:
```bash
cd visting_cards
```

2. Run the Flask application:
```bash
python app.py
```

3. Open your browser and go to:
```
http://localhost:5000
```

## How to Use

1. Fill in your contact information in the form:
   - Full Name (required)
   - Phone Number (required)
   - Email (required)
   - Company (optional)
   - Job Title (optional)
   - Website (optional)
   - Address (optional)

2. Click "Generate QR Code"

3. Your visiting card will be displayed with a QR code

4. To save the contact:
   - Open your phone's camera app
   - Point it at the QR code on your screen
   - Tap the notification that appears
   - Choose "Add to Contacts" or "Save Contact"

5. You can also download the QR code as an image to print on physical business cards

## Technical Details

- **Backend**: Flask (Python)
- **QR Code Generation**: qrcode library with Pillow
- **Contact Format**: vCard 3.0 (universally supported by all phones)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## vCard Format

The application generates QR codes in vCard format, which is a standard format for electronic business cards. This ensures compatibility with all smartphones (iPhone, Android, etc.) and contact management systems.

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
