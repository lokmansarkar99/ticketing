// FUNCTION TO CREATE AN IMAGE FROM A URL AND RETURN A PROMISE
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // NEEDED TO AVOID CROSS-ORIGIN ISSUES
    image.src = url;
  });

// FUNCTION TO CONVERT DEGREE TO RADIAN
export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

// FUNCTION TO CALCULATE THE NEW BOUNDING AREA OF A ROTATED RECTANGLE
export function rotateSize(
  width: number,
  height: number,
  rotation: number
): { width: number; height: number } {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

// FUNCTION TO CROP AN IMAGE BASED ON THE PROVIDED PARAMETERS
export default async function getCroppedImg(
  imageSrc: string | undefined,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation: number = 0,
  flip: { horizontal: boolean; vertical: boolean } = {
    horizontal: false,
    vertical: false,
  }
): Promise<string> {
  // CREATE AN IMAGE FROM THE SOURCE URL
  const image = await createImage(imageSrc || "");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    // RETURN REJECTED PROMISE IF CANVAS CONTEXT IS NOT AVAILABLE
    return Promise.reject("Failed to get canvas context");
  }

  const rotRad = getRadianAngle(rotation);

  // CALCULATE BOUNDING BOX OF THE ROTATED IMAGE
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // SET CANVAS SIZE TO MATCH THE BOUNDING BOX
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // TRANSLATE CANVAS CONTEXT TO A CENTRAL LOCATION TO ALLOW ROTATING AND FLIPPING AROUND THE CENTER
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // DRAW ROTATED IMAGE
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    // RETURN REJECTED PROMISE IF CROPPED CANVAS CONTEXT IS NOT AVAILABLE
    return Promise.reject("Failed to get cropped canvas context");
  }

  // SET THE SIZE OF THE CROPPED CANVAS
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // DRAW THE CROPPED IMAGE ONTO THE NEW CANVAS
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // RETURN AS A BLOB URL
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        reject("Failed to create blob");
      }
    }, "image/jpeg");
  });
}
