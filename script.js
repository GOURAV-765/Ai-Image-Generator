const API_KEY = 'vk-KiAe0Bquv3YCT5B92GD8z6NiwOXJ5L2eiq20B2D32FxCpzm5x';
const API_URL = 'https://api.vyro.ai/v2/image/generations';

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

//prepare from data for the API request
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + API_KEY);



const formData = new FormData();
formData.append('prompt', promptValue);
formData.append('style', styleValue);
formData.append('aspect_ratio', ratioValue);

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: formData,
   redirect: 'follow'
};

fetch(API_URL, requestOptions )
    .then(response => response.blob())
    .then(blob => {
    //Create an object URL for the blob
    const imageUrl = URL.createObjectURL(blob);
    //Set the image source to display it
    imageResultElement.src = imageUrl;
   })
   .catch(error => {
       console.log('error', error);
       alert('An error occured while generating the image.');
   } )
   .finally(() => {
    //Restore the Loading state
    setLoadingState(false);
   });

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

  //If image URL is empty
if  (!imageUrl) {
    alert('No image available for download');
    return;
  }

  //Create a temporary anchor element to initiate download
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'ai-generated-image.jpg';
  link.click();
}
