import File from '../models/File';
import googledrive from '../../service/googledrive';
import compressImage from '../../config/sharp';

class FileController {
  async store(request, response) {
    const path = await compressImage(request.file, 200);

    await googledrive.imageUpload(
      path,
      request.file.filename,
      async fileReturn => {
        const file = await File.create({
          name: fileReturn.data.id,
          path: fileReturn.data.id,
        });
        return response.status(201).json(file);
      }
    );
  }
}
export default new FileController();
