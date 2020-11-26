import Sequelize from 'sequelize';
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import File from '../models/File';
import City from '../models/City';
import Suggestion from '../models/Suggestion';
import DamageReport from '../models/DamageReport';
import Device from '../models/Device';
import mail from '../../config/mail';
import authConfig from '../../config/auth';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(2)
        .required(),
      email: Yup.string()
        .trim()
        .email()
        .required(),
      cellphone: Yup.string()
        .trim()
        .length(11)
        .required(),
      cpf: Yup.string()
        .trim()
        .length(11)
        .required(),
      password: Yup.string()
        .trim()
        .min(8)
        .required(),
      manager: Yup.boolean(),
      district: Yup.string()
        .trim()
        .required(),
      street: Yup.string()
        .trim()
        .required(),
      number: Yup.number()
        .positive()
        .required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      active: Yup.boolean(),
      city_id: Yup.number().required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique seus dados' });
    }

    const { email, cellphone, cpf } = request.body;

    const userExists = await User.findOne({
      where: Sequelize.or({ email }, { cellphone }, { cpf }),
    });

    if (userExists) {
      return response.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const {
      name,
      manager,
      district,
      street,
      number,
      latitude,
      longitude,
      active,
      city_id,
    } = await User.create(request.body);

    return response.status(201).json({
      name,
      email,
      cellphone,
      cpf,
      manager,
      district,
      street,
      number,
      latitude,
      longitude,
      active,
      city_id,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(2)
        .required(),
      email: Yup.string()
        .trim()
        .email()
        .required(),
      cellphone: Yup.string()
        .trim()
        .length(11)
        .required(),
      oldPassword: Yup.string()
        .trim()
        .min(8),
      password: Yup.string()
        .trim()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .trim()
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      district: Yup.string()
        .trim()
        .required(),
      street: Yup.string()
        .trim()
        .required(),
      number: Yup.number()
        .positive()
        .required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      active: Yup.boolean(),
      city_id: Yup.number().required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha na alteração, verifique seus dados' });
    }

    const { email, cellphone, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return response.status(400).json({ error: 'E-mail já cadastrado' });
      }
    }

    if (cellphone !== user.cellphone) {
      const userExists = await User.findOne({ where: { cellphone } });
      if (userExists) {
        return response.status(400).json({ error: 'Celular já cadastrado' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Senha atual inválida' });
    }

    await user.update(request.body);

    const {
      id,
      name,
      cpf,
      manager,
      district,
      street,
      number,
      latitude,
      longitude,
      active,
      city_id,
      avatar,
    } = await User.findByPk(request.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return response.status(200).json({
      id,
      name,
      email,
      cellphone,
      cpf,
      manager,
      district,
      street,
      number,
      latitude,
      longitude,
      active,
      city_id,
      avatar,
    });
  }

  async list(request, response) {
    const { page = 1 } = request.query;

    const count = await User.count();

    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'district',
        'street',
        'active',
        // [
        //   Sequelize.fn('count', Sequelize.col('damageReports.id')),
        //   'damageReportsLength',
        // ],
        // [
        //   Sequelize.fn('count', Sequelize.col('suggestions.id')),
        //   'suggestionsLength',
        // ],
      ],
      include: [
        {
          model: DamageReport,
          as: 'damageReports',
          attributes: ['id'],
          // duplicating: false,
        },
        {
          model: Suggestion,
          as: 'suggestions',
          attributes: ['id'],
          // duplicating: false,
        },
        {
          model: City,
          as: 'city',
          attributes: ['name'],
        },
      ],
      // group: ['User.id', 'city.id'],
      limit: 10,
      offset: (page - 1) * 10,
      order: ['id'],
    });

    response.header('X-Total-Count', count);
    return response.status(200).json(users);
  }

  async index(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'cellphone',
        'cpf',
        'manager',
        'district',
        'street',
        'number',
        'latitude',
        'longitude',
        'active',
      ],
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
        { model: City, as: 'city', attributes: ['id', 'name', 'state'] },
        {
          model: Suggestion,
          as: 'suggestions',
          attributes: [
            'id',
            'latitude',
            'longitude',
            'description',
            'solicitation',
            'createdAt',
          ],
        },
        {
          model: DamageReport,
          as: 'damageReports',
          attributes: [
            'id',
            'description',
            'damage_percentage',
            'assumption',
            'situation',
            'createdAt',
          ],
          include: [
            {
              model: Device,
              as: 'device',
              attributes: ['id', 'latitude', 'longitude'],
            },
          ],
        },
      ],
    });
    return response.status(200).json(user);
  }

  async amountUserMonthAndYear(request, response) {
    const user = await User.findAll({
      attributes: [
        [Sequelize.literal('extract(YEAR FROM created_at)'), 'year'],
        [Sequelize.literal('extract(MONTH FROM created_at)'), 'month'],
        [
          Sequelize.literal('count(extract(MONTH FROM created_at))::int'),
          'amount',
        ],
      ],
      where: Sequelize.literal(
        "created_at > CURRENT_DATE - INTERVAL '6 MONTH'"
      ),
      group: ['month', 'year'],
      order: [Sequelize.literal('year'), Sequelize.literal('month')],
    });

    return response.status(200).json(user);
  }

  async recoveryPasswordLink(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .trim()
        .email()
        .required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Falha no pedido de alteração de senha, verifique seus dados',
      });
    }

    const { email } = request.body;

    const user = await User.findOne({
      where: { email },
    });

    const hash = jwt.sign({ id: user.id }, authConfig.secret);

    if (user) {
      await mail.sendMail({
        from: 'no-reply@smartuai.com',
        to: user.email,
        subject: 'Recuperação de senha - SmartUai',
        text: `
        Prezado ${user.name}
        
        Houve um pedido de alteração de senha. Segue o link para alterar senha: 
        https://smartuai.vercel.app/recovery-password/${hash}
        `,
      });
    }

    return response.status(200).send();
  }

  async recoveryPassword(request, response) {
    const schema = Yup.object().shape({
      hash: Yup.string().required(),
      password: Yup.string()
        .trim()
        .min(8)
        .required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Falha no pedido de alteração de senha, verifique seus dados',
      });
    }

    const { hash, password } = request.body;

    const { id } = jwt.decode(hash);

    if (!id) {
      return response.status(404).json({ error: 'ID inválido' });
    }

    const user = await User.findByPk(id);

    user.update({
      password,
    });

    return response.status(200).send();
  }
}

export default new UserController();
