import { jsPDF } from "jspdf";
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const convertBtn = document.getElementById('convertBtn');
    const status = document.getElementById('status');
    const fileList = document.getElementById('fileList');
    const spinner = convertBtn.querySelector('svg');

    convertBtn.addEventListener('click', async () => {
        const files = imageInput.files;
        if (!files || files.length === 0) {
            status.textContent = 'Please select at least one image.';
            return;
        }

        status.textContent = 'Converting...';
        spinner.classList.remove('hidden');
        convertBtn.disabled = true;

        let pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [1, 1]  // Temporary size, will be changed for each image
        });

        let firstPage = true;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const img = await createImageBitmap(file);
            
            // Determine orientation based on image dimensions
            const orientation = img.width > img.height ? 'l' : 'p';
            
            // Set the PDF page size to match the image dimensions
            if (!firstPage) {
                pdf.addPage([img.width, img.height], orientation);
            } else {
                pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'px',
                    format: [img.width, img.height]
                });
                firstPage = false;
            }

            // Convert the image to a data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL('image/jpeg');

                // Add the image to the PDF, filling the entire page
                pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);
            } else {
                console.error('Could not get 2D context from canvas');
            }
        }

        pdf.save('converted_images.pdf');
        status.textContent = 'Conversion complete!';
        spinner.classList.add('hidden');
        convertBtn.disabled = false;

        // Reset the file input and update the file list display
        imageInput.value = '';
        updateFileList();
    });

    // Update the updateFileList function to handle empty file input
    const updateFileList = () => {
        fileList.innerHTML = '';
        if (imageInput.files && imageInput.files.length > 0) {
            Array.from(imageInput.files).forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center justify-between bg-gray-100 p-2 rounded mb-2';
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    fileItem.innerHTML = `
                        <div class="flex items-center">
                            <img src="${e.target?.result}" alt="Preview" class="w-12 h-12 object-cover mr-3 rounded">
                            <span class="text-sm text-gray-700">${file.name}</span>
                        </div>
                        <button class="text-red-500 hover:text-red-700" data-index="${index}">Remove</button>
                    `;
                };
                reader.readAsDataURL(file);
                
                fileList.appendChild(fileItem);
            });
        } else {
            // Display a message when no files are selected
            fileList.innerHTML = '<p class="text-gray-500 text-center">No files selected</p>';
        }
    };

    // Call updateFileList initially to show the "No files selected" message
    updateFileList();

    // Add event listener for file input change
    imageInput.addEventListener('change', updateFileList);

    // Add event delegation for remove buttons
    fileList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            const dt = new DataTransfer();
            const { files } = imageInput;
            for (let i = 0; i < files.length; i++) {
                if (i !== index) {
                    dt.items.add(files[i]);
                }
            }
            imageInput.files = dt.files;
            updateFileList();
        }
    });
});