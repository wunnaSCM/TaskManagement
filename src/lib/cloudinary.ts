/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
import crypto from 'crypto';
const FormData = require('form-data');

const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;

const getPublicIdFromUrl = (url: string): string | null => {
  const match = url.match(regex);
  return match ? match[1] : null;
};

const generateSHA1 = (data: string): string => {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

const generateSignature = (publicId: string, apiSecret: string): string => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  ).then((res) => res.json());
  return response['secure_url'];
};

export const deleteImageInCloudinary = async (cloudinaryUrl: string) => {
  const publicId = getPublicIdFromUrl(cloudinaryUrl);
  if (publicId) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const timestamp = new Date().getTime().toString();
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string;
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.error(response);
    } catch (error) {
      console.error(error);
    }
  }
};
