import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';
import File from '../models/File';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .trim()
        .email()
        .required(),
      password: Yup.string()
        .trim()
        .min(8)
        .required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha na autentificação, verifique seus dados' });
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      return response.status(401).json({ error: 'Usuario não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'Senha inválida' });
    }

    const {
      id,
      name,
      cellphone,
      cpf,
      manager,
      district,
      street,
      number,
      avatar,
      city_id,
    } = user;

    return response.json({
      user: {
        id,
        name,
        email,
        cellphone,
        cpf,
        manager,
        district,
        street,
        number,
        avatar,
        city_id,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
