let currentQRCodeData = null;
let currentLogoData = null;
let currentUserPhotoData = null;

// Handle user photo upload
document.getElementById('userPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const removeBtn = document.getElementById('removeUserPhoto');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentUserPhotoData = event.target.result;
            removeBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    }
});

// Handle user photo remove
document.getElementById('removeUserPhoto').addEventListener('click', function() {
    document.getElementById('userPhoto').value = '';
    currentUserPhotoData = null;
    this.style.display = 'none';

    // Update card if already generated
    const userPhotoContainer = document.getElementById('userPhotoContainer');
    if (userPhotoContainer) {
        userPhotoContainer.style.display = 'none';
    }
});

// Handle logo upload
document.getElementById('logo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const removeBtn = document.getElementById('removeLogo');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentLogoData = event.target.result;
            removeBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    }
});

// Handle logo remove
document.getElementById('removeLogo').addEventListener('click', function() {
    document.getElementById('logo').value = '';
    currentLogoData = null;
    this.style.display = 'none';

    // Update card if already generated
    const cardLogo = document.getElementById('cardLogo');
    if (cardLogo) {
        cardLogo.style.display = 'none';
    }
});

// Handle theme change
document.getElementById('cardTheme').addEventListener('change', function() {
    updateCardTheme();
});

// Handle accent color change
document.getElementById('accentColor').addEventListener('input', function() {
    updateAccentColor(this.value);
});

// Handle font style change
document.getElementById('fontStyle').addEventListener('change', function() {
    updateFontStyle(this.value);
});

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Determine WhatsApp number
    const usePhoneAsWhatsapp = document.getElementById('usePhoneAsWhatsapp').checked;
    const phone = document.getElementById('phone').value;
    const whatsappNumber = usePhoneAsWhatsapp ? phone : '';

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: phone,
        phone2: document.getElementById('phone2').value,
        whatsapp: whatsappNumber,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        job_title: document.getElementById('job_title').value,
        website: document.getElementById('website').value,
        address: document.getElementById('address').value,
        photo: currentUserPhotoData || ''
    };

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Generating...';
    submitBtn.disabled = true;

    try {
        // Send request to backend
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Store QR code data for download
            currentQRCodeData = result.qr_code;

            // Display the visiting card
            displayCard(formData, result.qr_code);

            // Show preview content, hide placeholder
            document.querySelector('.preview-placeholder').style.display = 'none';
            document.getElementById('previewContent').style.display = 'block';
        } else {
            alert('Error generating QR code. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate QR code. Please check your connection and try again.');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }
});

function displayCard(data, qrCodeBase64) {
    // Update card information
    document.getElementById('cardName').textContent = data.name.toUpperCase();
    document.getElementById('cardTitle').textContent = data.job_title || '';

    // Update user photo
    const userPhotoContainer = document.getElementById('userPhotoContainer');
    const cardUserPhoto = document.getElementById('cardUserPhoto');
    if (currentUserPhotoData) {
        cardUserPhoto.src = currentUserPhotoData;
        userPhotoContainer.style.display = 'block';
    } else {
        userPhotoContainer.style.display = 'none';
    }

    // Update address
    const addressItem = document.getElementById('addressItem');
    const cardAddress = document.getElementById('cardAddress');
    if (data.address) {
        cardAddress.textContent = data.address;
        addressItem.style.display = 'flex';
    } else {
        addressItem.style.display = 'none';
    }

    // Update phone numbers
    const phoneItem = document.getElementById('phoneItem');
    const cardPhone = document.getElementById('cardPhone');
    const cardPhone2 = document.getElementById('cardPhone2');

    if (data.phone || data.phone2) {
        cardPhone.textContent = data.phone || '';
        cardPhone2.textContent = data.phone2 || '';
        phoneItem.style.display = 'flex';
    } else {
        phoneItem.style.display = 'none';
    }

    // Update WhatsApp
    const whatsappItem = document.getElementById('whatsappItem');
    const cardWhatsapp = document.getElementById('cardWhatsapp');
    if (data.whatsapp) {
        cardWhatsapp.textContent = data.whatsapp;
        whatsappItem.style.display = 'flex';
    } else {
        whatsappItem.style.display = 'none';
    }

    // Update email
    const emailItem = document.getElementById('emailItem');
    const cardEmail = document.getElementById('cardEmail');
    if (data.email) {
        cardEmail.textContent = data.email;
        emailItem.style.display = 'flex';
    } else {
        emailItem.style.display = 'none';
    }

    // Update website
    const websiteItem = document.getElementById('websiteItem');
    const cardWebsite = document.getElementById('cardWebsite');
    if (data.website) {
        cardWebsite.textContent = data.website;
        websiteItem.style.display = 'flex';
    } else {
        websiteItem.style.display = 'none';
    }

    // Update company and logo
    const cardCompany = document.getElementById('cardCompany');
    const cardLogo = document.getElementById('cardLogo');

    if (data.company) {
        cardCompany.textContent = data.company.toUpperCase();
    } else {
        cardCompany.textContent = '';
    }

    // Display logo if uploaded
    if (currentLogoData) {
        cardLogo.src = currentLogoData;
        cardLogo.style.display = 'block';
    } else {
        cardLogo.style.display = 'none';
    }

    // Update QR code
    document.getElementById('qrCode').src = `data:image/png;base64,${qrCodeBase64}`;

    // Apply current theme and styles
    updateCardTheme();
    updateAccentColor(document.getElementById('accentColor').value);
    updateFontStyle(document.getElementById('fontStyle').value);
}

function updateCardTheme() {
    const theme = document.getElementById('cardTheme').value;
    const card = document.getElementById('businessCard');

    // Remove all theme classes
    card.classList.remove('theme-dark', 'theme-light', 'theme-blue', 'theme-green', 'theme-gradient');

    // Add selected theme
    card.classList.add('theme-' + theme);
}

function updateAccentColor(color) {
    const brandBar = document.getElementById('brandBar');
    if (brandBar) {
        brandBar.style.background = `linear-gradient(180deg, ${color} 0%, ${adjustBrightness(color, -30)} 100%)`;
    }

    // Update user photo border
    const userPhoto = document.getElementById('cardUserPhoto');
    if (userPhoto) {
        userPhoto.style.borderColor = color;
    }
}

function updateFontStyle(style) {
    const card = document.getElementById('businessCard');
    card.classList.remove('font-modern', 'font-classic', 'font-tech', 'font-elegant');
    card.classList.add('font-' + style);
}

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 +
        (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

async function downloadCard() {
    const card = document.getElementById('businessCard');
    const name = document.getElementById('name').value.replace(/\s+/g, '_');

    try {
        // Show loading message
        const btnDownload = document.querySelector('.btn-download');
        const originalHTML = btnDownload.innerHTML;
        btnDownload.innerHTML = '<span class="loading"></span> Generating...';
        btnDownload.disabled = true;

        // Use html2canvas to capture the card
        const canvas = await html2canvas(card, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        // Convert to blob and download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${name}_Business_Card.png`;
            link.click();
            URL.revokeObjectURL(url);

            // Reset button
            btnDownload.innerHTML = originalHTML;
            btnDownload.disabled = false;
        });
    } catch (error) {
        console.error('Error downloading card:', error);
        alert('Failed to download card. Please try again.');

        // Reset button
        const btnDownload = document.querySelector('.btn-download');
        btnDownload.innerHTML = '<i class="fas fa-download"></i> Download Card';
        btnDownload.disabled = false;
    }
}

function downloadQRCode() {
    if (!currentQRCodeData) {
        alert('No QR code to download');
        return;
    }

    const name = document.getElementById('name').value.replace(/\s+/g, '_');

    // Create download link
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${currentQRCodeData}`;
    link.download = `${name}_QR_Code.png`;
    link.click();
}

function resetForm() {
    // Reset form
    document.getElementById('contactForm').reset();

    // Hide preview content, show placeholder
    document.getElementById('previewContent').style.display = 'none';
    document.querySelector('.preview-placeholder').style.display = 'block';

    // Clear current data
    currentQRCodeData = null;
    currentLogoData = null;
    currentUserPhotoData = null;

    // Hide remove buttons
    document.getElementById('removeUserPhoto').style.display = 'none';
    document.getElementById('removeLogo').style.display = 'none';
}
