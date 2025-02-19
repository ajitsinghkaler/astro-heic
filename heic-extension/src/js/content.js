chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === "convertToPDF") {
        convertImageToPDF(request.imageUrl);
    }
});
import { jsPDF } from "jspdf";

async function convertImageToPDF(imageUrl) {
    try {
        const img = await loadImage(imageUrl);
        const pdf = new jsPDF({
            orientation: img.width > img.height ? 'l' : 'p',
            unit: 'px',
            format: [img.width, img.height]
        });

        pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
        pdf.save('converted_image.pdf');
    } catch (error) {
        console.error('Error converting image to PDF:', error);
    }
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}