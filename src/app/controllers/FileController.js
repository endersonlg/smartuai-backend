import File from '../models/File';
import googledrive from '../../service/googledrive';

class FileController {
  async store(request, response) {
    await googledrive.imageUpload(request.file, async fileReturn => {
      const file = await File.create({
        name: fileReturn.data.id,
        path: fileReturn.data.id,
      });
      return response.status(201).json(file);
    });
  }
}
export default new FileController();
