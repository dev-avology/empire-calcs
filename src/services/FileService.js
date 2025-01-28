import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import stream from 'stream';

export class FileService {
    constructor() {
        this.bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
    }

    /**
     * Upload a file to GridFS
     * @param {Buffer|Blob} fileData - The file data to upload
     * @param {string} filename - Name of the file
     * @param {string} contentType - MIME type of the file
     * @returns {Promise<Object>} Object containing file id and other metadata
     */
    async uploadFile(fileData, filename, contentType) {
        try {
            // Convert Blob to Buffer if necessary
            let buffer = fileData;
            if (fileData instanceof Blob) {
                buffer = await fileData.arrayBuffer().then(ab => Buffer.from(ab));
            }

            // Create upload stream
            const uploadStream = this.bucket.openUploadStream(filename, {
                contentType
            });

            // Create readable stream from buffer
            const readableStream = new stream.Readable();
            readableStream.push(buffer);
            readableStream.push(null);

            // Pipe the data
            return new Promise((resolve, reject) => {
                readableStream
                    .pipe(uploadStream)
                    .on('error', reject)
                    .on('finish', () => {
                        resolve({
                            fileId: uploadStream.id,
                            filename: uploadStream.filename,
                            contentType: uploadStream.options.contentType
                        });
                    });
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    /**
     * Get a file from GridFS
     * @param {ObjectId} fileId - The ID of the file to retrieve
     * @returns {Promise<Buffer>} The file data
     */
    async getFile(fileId) {
        try {
            const downloadStream = this.bucket.openDownloadStream(
                new mongoose.Types.ObjectId(fileId)
            );

            return new Promise((resolve, reject) => {
                const chunks = [];
                downloadStream
                    .on('data', chunk => chunks.push(chunk))
                    .on('error', reject)
                    .on('end', () => resolve(Buffer.concat(chunks)));
            });
        } catch (error) {
            console.error('Error retrieving file:', error);
            throw error;
        }
    }

    /**
     * Delete a file from GridFS
     * @param {ObjectId} fileId - The ID of the file to delete
     */
    async deleteFile(fileId) {
        try {
            await this.bucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}
