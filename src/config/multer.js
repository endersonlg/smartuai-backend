import multer from 'multer';
import crypto from 'crypto';
import { extname } from 'path';

export default {
  storage: multer.diskStorage({
    filename: (request, file, cb) => {
      crypto.randomBytes(16, (err, response) => {
        if (err) return cb(err);
        return cb(null, response.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
