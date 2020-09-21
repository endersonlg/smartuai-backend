import City from '../models/City';
import User from '../models/User';
import Device from '../models/Device';
import Suggestion from '../models/Suggestion';
import DamageReport from '../models/DamageReport';
import Status from '../models/Status';

class TodoController {
  async list(request, response) {
    const cities = await City.findAll({
      attributes: ['id', 'name', 'state', 'latitude', 'longitude'],
    });

    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'cellphone',
        'manager',
        'latitude',
        'longitude',
        'active',
      ],
      include: [
        {
          model: Suggestion,
          as: 'suggestions',
          attributes: ['id', 'solicitation', 'createdAt'],
        },
        {
          model: DamageReport,
          as: 'damageReports',
          attributes: ['id'],
        },
      ],
    });

    const devices = await Device.findAll({
      attributes: [
        'id',
        'name',
        'latitude',
        'longitude',
        'type',
        'active',
        'time_collect',
      ],
      include: [
        {
          model: DamageReport,
          as: 'damageReports',
          attributes: [
            'id',
            'damage_percentage',
            'assumption',
            'situation',
            'createdAt',
          ],
        },
        {
          model: Status,
          as: 'status',
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
    });

    const suggestions = await Suggestion.findAll({
      attributes: [
        'id',
        'solicitation',
        'description',
        'createdAt',
        'latitude',
        'longitude',
      ],
    });

    return response.status(200).json({ cities, users, devices, suggestions });
  }
}

export default new TodoController();
