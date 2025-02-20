// frontend/src/services/uploadService.js
const { s3, bucketName } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

class UploadService {
  static async uploadFile(file, folder = 'general') {
    try {
      if (!file) throw new Error('No file provided');

      const fileExtension = file.name.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('File upload failed');
    }
  }

  static async deleteFile(fileUrl) {
    try {
      const key = fileUrl.split('/').slice(-2).join('/');
      
      const params = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('File deletion failed');
    }
  }

  static async uploadMultipleFiles(files, folder = 'general') {
    try {
      if (!Array.isArray(files)) {
        files = [files];
      }

      const uploadPromises = files.map(file => 
        this.uploadFile(file, folder)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw new Error('Multiple file upload failed');
    }
  }
}