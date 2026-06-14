import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || 'bestivault';

/**
 * Generate a presigned URL for uploading a file to R2
 */
export async function getPresignedUploadUrl(fileKey, contentType, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Generate a presigned URL for downloading/viewing a file from R2
 */
export async function getPresignedDownloadUrl(fileKey, expiresIn = 3600) {
  // If a public URL is configured, use it directly
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${fileKey}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Delete an object from R2
 */
export async function deleteR2Object(fileKey) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Generate a unique file key for R2 storage
 */
export function generateFileKey(albumId, fileName) {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `albums/${albumId}/${timestamp}-${sanitizedName}`;
}
