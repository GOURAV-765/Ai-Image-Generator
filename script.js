const API_URL = 'https://image.pollinations.ai/prompt';

const imageContainer = document.getElementById('imageContainer');
const imageResultElement = document.getElementById('imageResult');
//Function to generate the image
function generateImage() {
//Get value from the input fields
const promptValue = document.getElementById('prompt').value;
const styleValue = document.getElementById('dropdownStyles').value;
const ratioValue = document.getElementById('dropdownRatio').value;

//If prompt is empty
if (!promptValue) {
    alert('Please enter a prompt.');
    return;
}

setLoadingState(true);

// Determine dimensions based on aspect ratio
let width = 1024;
let height = 1024;

if (ratioValue === '16:9') {
    height = 576;
} else if (ratioValue === '9:16') {
    width = 576;
}

// Construct the URL with parameters
const seed = Math.floor(Math.random() * 100000);
const fullPrompt = styleValue === 'realistic' ? promptValue + ' realistic high quality photorealistic' : (styleValue === 'anime' ? promptValue + ' anime style high quality' : promptValue);
const finalUrl = `${API_URL}/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

// Instead of fetch which might be blocked by Cloudflare (403), set the src directly
imageResultElement.referrerPolicy = "no-referrer"; // Helps bypass some WAF blocks
imageResultElement.onload = () => {
    setLoadingState(false);
};

imageResultElement.onerror = () => {
    setLoadingState(false);
    // If blocked by browser tracking prevention or Cloudflare, show a fallback
    imageResultElement.src = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    alert('The AI image was blocked by your browser (likely Edge Tracking Prevention or an Ad Blocker). A random placeholder image is shown instead. Try turning off Tracking Prevention for localhost or doing a Hard Refresh.');
};

// Set the source to trigger loading
imageResultElement.src = finalUrl;

}



function setLoadingState(isLoading) {
    if (isLoading) {
imageResultElement.style.display = 'none';
imageContainer.classList.add('loading');
    } else {
imageResultElement.style.display = 'block';
imageContainer.classList.remove('loading');
    }
}

function downloadImage() {
    const imageUrl = imageResultElement.src;

  //If image URL is empty or the default placeholder
if  (!imageUrl || imageUrl.includes('image%20of%20ai')) {
    alert('No image available for download');
    return;
  }

  // Try fetching to force direct download, otherwise fallback to opening in a new tab
  fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'ai-generated-image.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      })
      .catch(() => {
          // Fallback if fetch is blocked (CORS/403)
          window.open(imageUrl, '_blank');
      });
}
