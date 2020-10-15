import Sequelize from 'sequelize';
import * as Yup from 'yup';
import { getDistance } from 'geolib';
import Suggestion from '../models/Suggestion';
import User from '../models/User';
import City from '../models/City';

class SuggestionController {
  async store(request, response) {
    const schema = Yup.object().shape({
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
      description: Yup.string()
        .trim()
        .required(),
      solicitation: Yup.string()
        .trim()
        .oneOf(['Aprovado', 'Reprovado', 'Em Análise']),
      reason: Yup.string().trim(),
      reply_date_time: Yup.date(),
      user_id: Yup.number().required(),
      manager_id: Yup.number().nullable(),
      city_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados informados' });
    }
    const {
      id,
      district,
      street,
      number,
      latitude,
      longitude,
      description,
      user_id,
      city_id,
    } = await Suggestion.create(request.body);
    return response.status(201).json({
      id,
      district,
      street,
      number,
      latitude,
      longitude,
      description,
      user_id,
      city_id,
    });
  }

  async list(request, response) {
    const { page = 1 } = request.query;

    const count = await Suggestion.count();

    const suggestions = await Suggestion.findAll({
      attributes: [
        'id',
        'district',
        'street',
        'number',
        'solicitation',
        'latitude',
        'longitude',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: City,
          as: 'city',
          attributes: ['name'],
        },
      ],
      limit: 10,
      offset: (page - 1) * 10,
      order: [['id', 'DESC']],
    });

    const usersResideCity = await User.findAll({
      attributes: ['id', 'latitude', 'longitude'],
    });

    const usersTest = suggestions.map(suggestion => {
      const quantity = usersResideCity.filter(
        user =>
          getDistance(
            {
              latitude: suggestion.latitude,
              longitude: suggestion.longitude,
            },
            {
              latitude: user.latitude,
              longitude: user.longitude,
            }
          ) < 1000
      );
      return { ...suggestion.dataValues, usersProximity: quantity.length };
    });

    response.header('X-Total-Count', count);
    return response.status(200).json(usersTest);
  }

  async index(request, response) {
    const { id } = request.params;

    const suggestion = await Suggestion.findByPk(id, {
      attributes: [
        'id',
        'solicitation',
        'description',
        'createdAt',
        'reply_date_time',
        'reason',
        'district',
        'street',
        'number',
        'latitude',
        'longitude',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'cellphone', 'active', 'manager'],
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name'],
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'state'],
        },
      ],
    });

    return response.status(200).json(suggestion);
  }

  async indexUser(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(400).json({ error: 'Usuário não existe' });
    }

    const suggestion = await Suggestion.findAll({
      attributes: [
        'id',
        'solicitation',
        'description',
        'createdAt',
        'reply_date_time',
        'reason',
        'district',
        'street',
        'number',
        'latitude',
        'longitude',
      ],
      where: {
        user_id: id,
      },
    });

    return response.status(200).json(suggestion);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
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
      description: Yup.string()
        .trim()
        .required(),
      solicitation: Yup.string()
        .trim()
        .oneOf(['Aprovado', 'Reprovado', 'Em Análise']),
      reason: Yup.string().trim(),
      reply_date_time: Yup.date(),
      user_id: Yup.number().required(),
      manager_id: Yup.number().nullable(),
      city_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados' });
    }

    const { id } = request.params;

    const suggestion = await Suggestion.findByPk(id);

    await suggestion.update(request.body);

    return response.status(200).send();
  }

  async amountSolicitationStatus(request, response) {
    const suggestions = await Suggestion.findAll({
      attributes: [
        ['solicitation', 'name'],
        [Sequelize.literal('count(solicitation)::int'), 'amount'],
      ],
      group: ['solicitation'],
    });

    return response.status(200).json(suggestions);
  }
}

export default new SuggestionController();
