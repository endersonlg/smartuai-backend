import Sequelize from 'sequelize';
import * as Yup from 'yup';
import DamageReport from '../models/DamageReport';
import User from '../models/User';
import Device from '../models/Device';
import City from '../models/City';
import Status from '../models/Status';

class DamageReportController {
  async store(request, response) {
    const schema = Yup.object().shape({
      description: Yup.string()
        .trim()
        .required(),
      damage_percentage: Yup.number()
        .positive()
        .required(),
      assumption: Yup.string()
        .trim()
        .oneOf(['Causas Naturais', 'Vandalismo'])
        .required(),
      repair_date_time: Yup.date().min(new Date()),
      situation: Yup.string()
        .trim()
        .oneOf(['Aberto', 'Progresso', 'Concluído']),
      user_id: Yup.number().required(),
      manager_id: Yup.number(),
      device_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados informados' });
    }
    const {
      id,
      description,
      damage_percentage,
      assumption,
      situation,
      user_id,
      device_id,
    } = await DamageReport.create(request.body);

    return response.status(201).json({
      id,
      description,
      damage_percentage,
      assumption,
      situation,
      user_id,
      device_id,
    });
  }

  async list(request, response) {
    const { page = 1 } = request.query;

    const count = await DamageReport.count();

    const DamageReports = await DamageReport.findAll({
      attributes: ['id', 'damage_percentage', 'situation', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Device,
          as: 'device',
          attributes: ['name', 'district', 'street', 'number'],
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['name'],
            },
            {
              model: Status,
              as: 'status',
              order: [['id', 'DESC']],
              attributes: ['value'],
            },
          ],
        },
      ],
      limit: 10,
      offset: (page - 1) * 10,
      order: [['id', 'DESC']],
    });

    response.header('X-Total-Count', count);
    return response.status(200).json(DamageReports);
  }

  async index(request, response) {
    const { id } = request.params;

    const damageReport = await DamageReport.findByPk(id, {
      attributes: [
        'id',
        'description',
        'damage_percentage',
        'assumption',
        'repair_date_time',
        'situation',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Device,
          as: 'device',
          attributes: [
            'id',
            'name',
            'district',
            'street',
            'number',
            'latitude',
            'longitude',
            'type',
            'time_collect',
            'active',
          ],
          include: [
            {
              model: DamageReport,
              as: 'damageReports',
              attributes: [
                'id',
                'description',
                'damage_percentage',
                'assumption',
                'repair_date_time',
                'situation',
                'createdAt',
              ],
            },
            {
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'state'],
            },
            {
              model: Status,
              as: 'status',
              attributes: ['value'],
            },
          ],
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    return response.status(200).json(damageReport);
  }

  async indexUser(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(400).json({ error: 'Usuário não existe' });
    }

    const damageReport = await DamageReport.findAll({
      attributes: [
        'id',
        'description',
        'damage_percentage',
        'assumption',
        'repair_date_time',
        'situation',
        'createdAt',
        'updatedAt',
      ],
      where: {
        user_id: id,
      },
    });

    return response.status(200).json(damageReport);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      description: Yup.string()
        .trim()
        .required(),
      damage_percentage: Yup.number()
        .positive()
        .required(),
      assumption: Yup.string()
        .trim()
        .oneOf(['Causas Naturais', 'Vandalismo'])
        .required(),
      repair_date_time: Yup.date(),
      situation: Yup.string()
        .trim()
        .oneOf(['Aberto', 'Progresso', 'Concluído']),
      user_id: Yup.number().required(),
      manager_id: Yup.number(),
      device_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados' });
    }

    const { id } = request.params;

    const damageReport = await DamageReport.findByPk(id);

    await damageReport.update(request.body);

    return response.status(200).send();
  }

  async amountDamageReportStatus(request, response) {
    const suggestions = await DamageReport.findAll({
      attributes: [
        ['situation', 'name'],
        [Sequelize.literal('count(situation)::int'), 'amount'],
      ],
      group: ['situation'],
    });

    return response.status(200).json(suggestions);
  }
}

export default new DamageReportController();
