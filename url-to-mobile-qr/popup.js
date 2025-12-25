document.addEventListener('DOMContentLoaded', async () => {
  const qrcodeContainer = document.getElementById('qrcode');
  const urlDisplay = document.getElementById('url-display');
  const copyBtn = document.getElementById('copy-btn');

  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url) {
      const url = tab.url;
      const shortenedUrl = url.length > 40 ? url.substring(0, 37) + '...' : url;
      urlDisplay.textContent = shortenedUrl;
      urlDisplay.title = url;

      // Generate QR Code
      new QRCode(qrcodeContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#1f2937",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

    
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(url);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.backgroundColor = '#10b981'; 
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      });
    } else {
      urlDisplay.textContent = 'No active URL found.';
    }
  } catch (error) {
    console.error('Error fetching tab:', error);
    urlDisplay.textContent = 'Error: ' + error.message;
  }
});
