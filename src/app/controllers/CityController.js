import * as Yup from 'yup';
import { Op } from 'sequelize';

import City from '../models/City';
import User from '../models/User';
import Device from '../models/Device';
import DamageReport from '../models/DamageReport';
import Suggestion from '../models/Suggestion';
import Status from '../models/Status';

class CityController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .required(),
      state: Yup.string()
        .trim()
        .length(2)
        .required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados' });
    }

    const cityExists = await City.findOne({
      where: { name: request.body.name, state: request.body.state },
    });

    if (cityExists) {
      return response.status(400).json({ error: 'Cidade já cadastrada' });
    }

    const { id, name, state, latitude, longitude } = await City.create(
      request.body
    );

    return response.status(201).json({ id, name, state, latitude, longitude });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      state: Yup.string()
        .length(2)
        .required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados' });
    }

    const { name, state } = request.body;

    const { id } = request.params;

    const city = await City.findByPk(id);

    if (name !== city.name) {
      const cityExists = await City.findOne({ where: { name, state } });

      if (cityExists) {
        return response.status(400).json({ error: 'Cidade já cadastrada' });
      }
    }

    const { latitude, longitude } = await city.update(request.body);

    return response.status(200).json({ id, name, state, latitude, longitude });
  }

  async list(request, response) {
    const { page = 1 } = request.query;

    const count = await City.count();

    const cities = await City.findAll({
      attributes: ['id', 'name', 'state'],
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id'],
        },
        {
          model: Device,
          as: 'devices',
          attributes: ['id'],
        },
      ],
      group: ['City.id'],
      limit: 10,
      offset: (page - 1) * 10,
      order: ['id'],
    });

    response.header('X-Total-Count', count);
    return response.status(200).json(cities);
  }

  async index(request, response) {
    const { id } = request.params;
    const city = await City.findByPk(id, {
      attributes: ['name', 'state', 'latitude', 'longitude'],
      include: [
        {
          model: User,
          as: 'users',
          attributes: [
            'id',
            'name',
            'email',
            'cellphone',
            'latitude',
            'longitude',
            'manager',
            'active',
          ],
          include: [
            {
              model: DamageReport,
              as: 'damageReports',
              attributes: [
                'id',
                'damage_percentage',
                'assumption',
                'repair_date_time',
                'situation',
                'createdAt',
              ],
              order: [['id', 'DESC']],
            },
            {
              model: Suggestion,
              as: 'suggestions',
              attributes: ['id', 'solicitation', 'createdAt'],
            },
          ],
        },
        {
          model: Device,
          as: 'devices',
          attributes: [
            'id',
            'name',
            'type',
            'time_collect',
            'latitude',
            'longitude',
            'active',
            'updatedAt',
          ],
          include: [
            {
              model: DamageReport,
              as: 'damageReports',
              attributes: [
                'id',
                'damage_percentage',
                'assumption',
                'repair_date_time',
                'situation',
                'createdAt',
              ],
              where: { situation: { [Op.or]: ['Aberto', 'Progresso'] } },
              order: [['id', 'DESC']],
              limit: 1,
            },
            {
              model: Status,
              as: 'status',
              order: [['id', 'DESC']],
              limit: 1,
            },
          ],
        },
      ],
    });
    return response.status(200).json(city);
  }

  async delete(request, response) {
    const { id } = request.params;

    const city = await City.findByPk(id);

    await city.destroy();

    return response.status(204).send();
  }
}

export default new CityController();
