---
title: 'HEIC photo not accepted by a website? Check format, size, and the saved file'
date: '2026-11-01'
updatedDate: '2026-11-02'
shortDescription: 'A troubleshooting checklist for an iPhone photo rejected by an upload form, including real conversion, file-size limits, and checking the downloaded copy.'
coverImage: '../../assets/blog/HEIC.png'
coverAlt: 'Illustration of the HEIC image format'
coverCaption: 'Check the receiving website’s requirements before choosing an output format.'
coverOgImage: '/og-image/heic-to-jpg.png'
---

A website can reject a photo even though the picture opens on your phone. Start with the error message and the form’s accepted file types. A format error, a file-size limit, and a dimension requirement need different fixes. Converting to JPG addresses the format; it does not automatically satisfy every other rule.

## 1. Read the form’s requirements

Look next to the upload button for extensions such as `.jpg`, `.jpeg`, `.png`, or `.pdf`. Also check the maximum file size and any required width, height, or page count. Follow the actual instructions on the receiving website rather than assuming every form wants a JPG.

For a photo field that accepts JPEG, the [HEIC to JPG converter](/heic-to-jpg/) is the relevant tool. If a document field asks for PDF, use the [PDF converter](/heic-to-pdf/) instead. Putting a photo into a PDF does not turn it into an editable or searchable document.

## 2. Convert the contents, not just the filename

Changing `photo.heic` to `photo.jpg` only changes its name. It does not decode the image and create a JPEG file. The receiving website may still recognize the original format and reject it.

Open the relevant converter and choose the original `.heic` file. For JPG, PNG or WebP, review the output settings and choose the Convert button. For PDF, review page order and page size, then choose Create PDF. Download the result after conversion. The JPG tool can process multiple selected files, but if you choose Download All as ZIP it gives you an archive. Extract that archive and select an individual image for a form that asks for a photo; do not submit the ZIP itself.

## 3. Open the downloaded copy

Find the result in your Downloads folder or your browser’s download list. Open it and check that it is the correct photo, is readable, and has the orientation you expect. Keep the original so you can return to it if you need another output format.

The image tools offer maximum longest-edge resizing, which preserves proportions and never enlarges a smaller photo. JPG and WebP also offer quality settings. These can reduce bytes, but there is no exact target-file-size or crop control. Use an image editor if a form needs exact width and height or a particular crop. Check the displayed output dimensions and bytes rather than assuming a different extension is enough.

## 4. Select the new file on the form

Return to the form and choose the downloaded result. Watch for similar filenames: it is easy to select the original HEIC again. If the form still rejects it, compare the new file’s type, size, and dimensions with the stated limits. Save the exact error message if you need the website’s support team to help.

## A built-in option on a Mac

If the image opens in Preview on your Mac, you can use its export command to save a JPEG or PNG. Apple also documents the iPhone Camera “Most Compatible” setting for future captures. It changes new captures rather than converting files already taken. See [Apple’s HEIF and HEVC guide](https://support.apple.com/en-us/116944).

## Does online conversion upload my photo?

Online HEIC Convert’s conversion code processes selected images in the browser and creates local download objects. The photo bytes are not sent to a conversion server. The website still loads its own code and assets over the network. Read [how conversion works](/how-it-works/) for the distinction and current limits.
