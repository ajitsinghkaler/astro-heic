---
title: 'HEIC to JPG: Convert Existing Photos and Avoid Upload Errors'
date: '2025-02-19T10:19:49+0530'
shortDescription: 'Convert existing HEIC photos to JPG in your browser or on a Mac. Understand batch ZIP downloads, JPEG quality and when iPhone sharing changes the format.'
coverImage: '../../assets/blog/heic-to-jpg.png'
coverAlt: 'HEIC to JPG conversions.'
coverCaption: 'Practical HEIC conversion guidance.'
coverOgImage: '/og-image/heic-to-jpg.png'
updatedDate: '2026-11-02'
---

If a website or recipient asks for a JPG, create a JPEG copy of the HEIC rather than changing its filename. The [HEIC to JPG converter](/heic-to-jpg/) handles selected photos in your browser. JPG and JPEG refer to the same image format; an upload can still impose its own file-size and dimension limits.

Use this workflow for existing photos. Changing an iPhone camera setting affects new captures, not the HEIC files you already have.

## Convert HEIC to JPG in the browser

1. Open the [JPG converter](/heic-to-jpg/) and choose **Choose HEIC photos**.
2. Choose a **Quality setting** and leave **Longest edge** at **Original size**, or choose a smaller maximum dimension.
3. Select one or more `.heic` files, review the filenames and choose **Convert to JPG**.
4. Wait for the previews, then use a named download link to save its JPG.
5. Use **Download All as ZIP** to download an archive of separate JPG files. Extract it before attaching a photo to a form.
6. Check the reported dimensions and file size. Open the JPG to inspect its appearance and orientation before sharing it.

Outputs keep the source basename: `holiday.heic` becomes `holiday.jpg`. Duplicate basenames receive numbered suffixes so a batch ZIP does not overwrite one photo with another. The longest-edge setting preserves proportions and does not enlarge smaller photos. The converter does not join several photos into one image. Large batches can exhaust a phone's available memory; try fewer photos if conversion fails.

The selected photo bytes are converted locally in the browser, not uploaded to a conversion server. This describes the conversion step; the site still loads scripts and other web resources. See [how it works](/how-it-works/) for details.

## Convert on a Mac with Preview

Open the HEIC in Preview, choose **File → Export**, set the format to **JPEG**, choose the quality and save a separate copy. Apple documents [image-format export in Preview](https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac). If the file opens in another app, use Finder's **Open With → Preview** first.

The browser converter defaults to a quality setting of 92 and lets you choose a value from 10 to 100 before conversion. A lower setting usually reduces bytes at the cost of detail; compare a sample rather than treating the number as a percentage of retained quality. Preview offers a built-in alternative on a Mac.

## Will AirDrop automatically make a JPG?

Sometimes, but it is not guaranteed. Apple says sharing through AirDrop, Messages or email **may** use a more compatible format when the receiving device does not support the original. Check the received file instead of relying on an automatic conversion. See [Apple's HEIF sharing guidance](https://support.apple.com/en-us/116944).

For an existing photo that must be JPEG, explicitly export or convert it and inspect the resulting `.jpg` or `.jpeg` file. That gives you a file you can check before submission.

## Save future iPhone photos as JPEG

On supported devices, open **Settings → Camera → Formats → Most Compatible**. Apple explains that new photos then use JPEG. This does not convert photos already saved as HEIC. Keep the distinction in mind if a form still rejects an older photo after you change the setting.

## Does conversion preserve the original quality?

JPEG uses lossy compression. A conversion creates a new encoded image and can change fine detail, color rendering and metadata. It does not preserve a HEIC container's extra images, depth information or other features as a complete archive. Keep your original HEIC and use the JPG as a sharing copy.

For a photo that will be edited repeatedly, avoid repeatedly exporting over the same JPG. If your editor requires PNG, read the [PNG conversion guide](/blog/heic-to-png/) and compare its larger possible file size with your needs.

## The JPG opens, but the upload still fails

Check the destination's accepted extension, maximum bytes and pixel dimensions. A conversion does not automatically reduce all three. Make sure you selected the downloaded image rather than the original HEIC or the batch ZIP. If the portal accepts only PDF, use the [PDF tool](/heic-to-pdf/) and review its document requirements.

The [photo upload troubleshooting guide](/blog/heic-photo-upload-not-supported/) walks through these checks. If you are choosing a format for a website rather than a form, compare [WebP](/blog/heic-to-webp-ultimate-guide/) before publishing.
