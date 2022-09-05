export async function arrayBufferToBlob(
  buffer: Buffer,
  type: string
): Promise<Blob> {
  return new Blob([buffer], { type });
}

export async function blobToArrayBuffer(
  blob: Blob
): Promise<ArrayBuffer | string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
}

export async function base64ToBlob(base64String: string) {
  return await (await fetch(base64String)).blob();
}
