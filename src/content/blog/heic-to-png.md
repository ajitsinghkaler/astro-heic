---
title: 'HEIC to PNG: Browser, Mac, FFmpeg and ImageMagick'
date: '2024-07-18T10:19:49+0530'
shortDescription: 'Convert HEIC to PNG with clear browser steps and tested FFmpeg and ImageMagick commands. Learn why PNG files grow and what conversion preserves.'
coverImage: '../../assets/blog/heic-to-png.png'
coverAlt: 'HEIC to PNG conversions.'
coverCaption: 'Practical HEIC conversion guidance.'
coverOgImage: '/og-image/heic-to-png.png'
updatedDate: '2026-11-02'
---

Need a PNG copy of an iPhone photo? The [HEIC to PNG converter](/heic-to-png/) creates one PNG for each selected HEIC file, directly in your browser. Use PNG when an editor or upload form asks for it. For an ordinary photo attachment, [JPG may be a better fit](/blog/heic-jpg-png-pdf-which-format/) because PNG can be much larger.

This guide covers the browser workflow, a Mac option and two tested command-line methods. Keep your original HEIC: a converted image is a copy for a specific task, not a complete archive of the source file.

## Convert HEIC to PNG in your browser

1. Open the [PNG converter](/heic-to-png/) and choose **Choose HEIC photos**.
2. Leave **Longest edge** at **Original size**, or choose a smaller maximum dimension. Select one or more `.heic` files from your device.
3. Review the selected filenames, remove any unwanted photos and choose **Convert to PNG**.
4. Wait for the image previews. Download each PNG using its named link. The output keeps the source basename: `holiday.heic` becomes `holiday.png`. Duplicate names receive a numbered suffix.
5. Use **Download All as ZIP** for an archive containing the separate PNGs. Extract the ZIP before uploading an individual image elsewhere.
6. Check the reported output dimensions and file size, then open a downloaded PNG to inspect its orientation and appearance.

The image conversion runs locally in the browser; selected photo bytes are not uploaded to a conversion server. The website still loads its scripts and other web resources. See [how conversion works](/how-it-works/) for the scope of this privacy claim and the current limitations.

A batch does not stitch photos into one picture. The longest-edge setting reduces dimensions while keeping the aspect ratio and never enlarges a smaller photo. There are no background-removal or metadata-preservation controls. If a large batch fails on a phone, try one photo first, then a smaller batch.

## Convert HEIC to PNG on a Mac

Open the HEIC in Preview, choose **File → Export**, select **PNG** in the Format menu, choose a destination and save a new copy. If Preview is not the default app, use Finder's **Open With → Preview** first. Apple documents [exporting images to another format](https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac).

Use a new filename or folder so the HEIC remains available. Review the exported file rather than assuming the extension alone proves that the conversion worked.

## Convert HEIC to PNG with FFmpeg

For a terminal workflow, run this in the folder containing your photo, replacing the filenames with yours:

```sh
ffmpeg -i "photo.heic" -frames:v 1 "photo.png"
```

`-frames:v 1` requests one output frame. This example is for a still photo; it does not export every image, auxiliary image or animation that a HEIC container might hold. We tested it with FFmpeg 7.1.1 on macOS using a synthetic 320 × 180 HEIC, and the result was a readable 320 × 180 PNG.

HEIC support depends on the FFmpeg version, the build and the source file. An older build may fail even when another app opens the photo. If you see an unsupported-format or decoder error, check `ffmpeg -version` and use a build with HEIC input and HEVC decoding support, or try the browser or Preview method. This test does not establish support for every phone, HDR file or HEIC variant.

## Convert with ImageMagick

A second terminal option is:

```sh
magick "photo.heic" "photo.png"
```

We tested this command with ImageMagick 7.1.1-47 and libheif 1.19.8 on the same synthetic photo. It produced a readable PNG at the original pixel dimensions. Your installation needs a HEIC-capable delegate; inspect `magick -list format` if it reports that decoding is unavailable. ImageMagick lists delegate requirements in its [supported formats reference](https://imagemagick.org/formats/).

Do not rename `photo.heic` to `photo.png`: that changes the name, not the encoded image.

## Does PNG conversion lose quality?

[PNG uses lossless compression](https://www.w3.org/TR/png-3/), but that describes how PNG stores the decoded pixels. It does not recover details already lost when the HEIC was made, or promise to preserve its HDR rendering, color profile, depth data, metadata or additional images. Different decoders can render the source differently. Keep the HEIC for later editing or archiving.

PNG supports transparency, but converting an opaque photo does not remove its background or create transparent areas. Choose a background-removal editor if that is the task.

## Why is my PNG larger than the HEIC?

A photograph can contain texture and color variation that compress poorly in PNG. A larger PNG is not proof of sharper detail. Compare the actual file sizes and view the result at its intended display size. If an upload has a small size limit and accepts JPEG, try [HEIC to JPG](/heic-to-jpg/) instead; for a website image, compare [WebP](/blog/heic-to-webp-ultimate-guide/).

If the PNG opens locally but the destination rejects it, check that destination's accepted formats, pixel dimensions and size limit. The [photo upload troubleshooting guide](/blog/heic-photo-upload-not-supported/) explains those separate checks.
