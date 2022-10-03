export type StoredArrayBuffer = {
  type: string;
  buffer: ArrayBuffer;
};

export async function storedArrayBufferToBlob({
  buffer,
  type,
}: StoredArrayBuffer): Promise<Blob> {
  return new Blob([buffer], { type });
}

export async function blobToStoredArrayBuffer(
  blob: Blob
): Promise<StoredArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const buffer = reader.result;
      if (buffer === null || typeof buffer === "string") {
        resolve(null);
      } else {
        resolve({
          type: blob.type,
          buffer,
        });
      }
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
}

export async function stringToBlob(str: string) {
  return await (await fetch(str)).blob();
}

export async function blobToString(blob: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const result = reader.result;
      if (typeof result !== "string") {
        resolve(null);
      } else {
        resolve(result);
      }
    });
    reader.addEventListener("error", reject);
    reader.readAsText(blob);
  });
}

export async function base64ToBlob(base64String: string) {
  return await stringToBlob(base64String);
}

export async function blobToBase64(blob: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const result = reader.result;
      if (typeof result !== "string") {
        resolve(null);
      } else {
        resolve(result);
      }
    });
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}
