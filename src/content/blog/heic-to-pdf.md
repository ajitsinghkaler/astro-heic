---
title: 'HEIC to PDF: Prepare Photos for a Document Upload'
date: '2024-06-19T10:19:49+0530'
shortDescription: 'Turn HEIC photos into a PDF for a document upload. Follow the actual download steps, then check page order, readability, file size and PDF requirements.'
coverImage: '../../assets/blog/heic-to-pdf.png'
coverAlt: 'HEIC to PDF conversions.'
coverCaption: 'Practical HEIC conversion guidance.'
coverOgImage: '/og-image/heic-to-pdf.png'
updatedDate: '2026-11-02'
---

A form that accepts PDF may reject an iPhone photo ending in `.heic`. The [HEIC to PDF converter](/heic-to-pdf/) places photo images on PDF pages so you can submit a document rather than an image file. This is useful for a photographed receipt, worksheet or set of reference photos when the recipient specifically asks for PDF.

Check the recipient's rules first. If the form asks for JPG or PNG, use an [image converter](/blog/heic-jpg-png-pdf-which-format/) instead. A PDF extension does not guarantee that a document meets a portal's size, page-size, accessibility or archival requirements.

## Convert a HEIC photo to PDF

1. Open the [HEIC to PDF tool](/heic-to-pdf/).
2. Use **Choose HEIC photos** to select the photo on your device.
3. Choose **Photo proportions**, **A4 portrait** or **US Letter portrait** under **PDF page size**, then select **Create PDF**.
4. Wait for **Download PDF**, save the result and open it in a PDF viewer. A single-photo PDF uses the source basename; a batch downloads as `heic-photos.pdf`.
5. Check that the whole photo is visible, correctly oriented and readable at the size the recipient will use.

The conversion runs on your device. It does not upload the selected photo bytes to a conversion server. It does not submit the finished PDF to anyone: you choose where to save it and whether to upload it to a separate service. See [how it works](/how-it-works/) for more detail.

## Put several HEIC photos in one PDF

Select the photos together in the file picker. The **Page order** list shows the sequence that will become the PDF. The browser may supply a different order from the one in which you clicked thumbnails; use **Up** and **Down** beside a filename to arrange the pages, and **Remove** to exclude a photo.

Choose the page size, then select **Create PDF**. After conversion, **Edit page order** returns to the selected files so you can rearrange them and create a replacement PDF without choosing the photos again. Check the downloaded pages before submission. Test a small batch first on a device with limited memory.

The PNG, JPG and WebP tools behave differently: their **Download All** button creates a ZIP of individual image files. Use the [PDF tool](/heic-to-pdf/) when you actually need a single multi-page document.

## What kind of PDF does this make?

The converter decodes each HEIC photo to a JPEG image and places it on a PDF page. **Photo proportions** follows each image shape, using its pixel dimensions at 96 pixels per inch rather than preserving source print-resolution metadata. **A4 portrait** and **US Letter portrait** fit each image within the selected paper size, centered with a fixed 24-point margin and without stretching. There are no custom margin, crop, target-file-size or compression controls.

The JPEG step uses a fixed quality setting, so this is not a lossless archive of your HEIC. Check small text and fine lines carefully, and retain the source photo.

This is an **image-only PDF**. It does not perform optical character recognition (OCR), turn photographed words into selectable text, or make a document accessible just by changing its format. A searchable or accessible PDF needs additional processing. The tool does not certify PDF/A compliance, add signatures or password-protect the result.

## Before uploading the PDF

- **Readability:** zoom in on receipt totals, handwriting and other important details. Conversion cannot fix a blurred source photo.
- **Page count and order:** look at every page, including the first and last. Confirm that no photo is missing or duplicated.
- **File size:** compare the saved PDF's size with the form's limit. The converter does not promise a smaller file than the HEIC.
- **Page requirements:** check whether the recipient needs a fixed paper size, selectable text or a particular PDF standard.
- **Privacy:** open the PDF yourself before sending it and confirm that it contains only the intended photos.

## If conversion or the upload fails

Try one HEIC file first. If that succeeds, use smaller batches. A large image can need much more memory while it is decoded than its compressed file size suggests. An incomplete download from cloud storage or an unsupported HEIC variant can also cause conversion to fail; obtain the complete original and try again.

If the PDF opens but a form rejects it, read the form's error message rather than converting it repeatedly. Changing the extension or putting an image in a PDF does not satisfy every upload rule. See [why a photo upload may be rejected](/blog/heic-photo-upload-not-supported/) for a checklist of format, size and dimension issues.

If you only need a normal photo attachment, [convert to JPG](/heic-to-jpg/). If an editor explicitly needs PNG, use the [PNG guide](/blog/heic-to-png/). Choose the file type for the recipient's task, and keep the original HEIC separately.
