// Get DOM elements
const modal = document.getElementById('uploadModal');
const uploadBtn = document.querySelector('.upload-btn');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const choosePhotoBtn = document.getElementById('choosePhotoBtn');
const modalContent = modal.querySelector('.modal-content');

// Store original modal content
const originalModalContent = modalContent.innerHTML;

// Create camera elements
const cameraContainer = document.createElement('div');
cameraContainer.className = 'camera-container';
const video = document.createElement('video');
const captureBtn = document.createElement('button');
captureBtn.textContent = 'Capture Photo';
captureBtn.className = 'modal-btn';
const backBtn = document.createElement('button');
backBtn.textContent = 'Back';
backBtn.className = 'modal-btn';
cameraContainer.appendChild(video);
cameraContainer.appendChild(captureBtn);
cameraContainer.appendChild(backBtn);

// Create and hide gallery input
const galleryInput = document.createElement('input');
galleryInput.type = 'file';
galleryInput.accept = 'image/*';
galleryInput.style.display = 'none';
document.body.appendChild(galleryInput);

// Show upload modal when clicking the upload button
uploadBtn.addEventListener('click', () => {
  modalContent.innerHTML = originalModalContent;
  modal.style.display = 'flex';
  setupEventListeners();
});

function setupEventListeners() {
  const takePhotoBtn = document.getElementById('takePhotoBtn');
  const choosePhotoBtn = document.getElementById('choosePhotoBtn');

  if (takePhotoBtn) {
    takePhotoBtn.addEventListener('click', startCamera);
  }
  if (choosePhotoBtn) {
    choosePhotoBtn.addEventListener('click', () => {
      galleryInput.click();
    });
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      },
    });

    video.srcObject = stream;
    video.play();

    modalContent.innerHTML = '';
    modalContent.appendChild(cameraContainer);

    // Handle capture button click
    captureBtn.onclick = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      sessionStorage.setItem('capturedImage', imageData);

      stopCamera();
      modal.style.display = 'none';
      console.log('Photo captured and stored');
    };

    // Handle back button click
    backBtn.onclick = () => {
      stopCamera();
      modalContent.innerHTML = originalModalContent;
      setupEventListeners();
    };
  } catch (err) {
    console.error('Error accessing camera:', err);
    alert('Could not access camera. Please make sure you have granted camera permissions.');
    modalContent.innerHTML = originalModalContent;
    setupEventListeners();
  }
}

function stopCamera() {
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }
}

// Handle gallery input change
galleryInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      sessionStorage.setItem('selectedImage', e.target.result);
      modal.style.display = 'none';
      console.log('Image selected and stored');
    };
    reader.readAsDataURL(file);
  }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    stopCamera();
    modalContent.innerHTML = originalModalContent;
    modal.style.display = 'none';
    setupEventListeners();
  }
});

// Initial setup
setupEventListeners();
