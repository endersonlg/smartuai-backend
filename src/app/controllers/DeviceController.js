import Sequelize from 'sequelize';
import * as Yup from 'yup';
import Device from '../models/Device';
import City from '../models/City';
import User from '../models/User';
import DamageReport from '../models/DamageReport';
import Status from '../models/Status';

class DeviceController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(2)
        .required(),
      series: Yup.number()
        .positive()
        .required(),
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
      height: Yup.number()
        .positive()
        .required(),
      weight_supported: Yup.number()
        .positive()
        .required(),
      type: Yup.string()
        .trim()
        .oneOf(['Orgânico', 'Inorgânico'])
        .required(),
      time_collect: Yup.string().trim(),
      time_average: Yup.string().trim(),
      city_id: Yup.number().required(),
      manager_id: Yup.number().required(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique os dados informados' });
    }

    const { name } = request.body;

    const deviceExists = await Device.findOne({ where: { name } });

    if (deviceExists) {
      return response.status(400).json({ error: 'Dispositivo já cadastrado' });
    }

    const {
      id,
      series,
      district,
      street,
      number,
      latitude,
      longitude,
      height,
      weight_supported,
      type,
      time_collect,
      time_average,
      active,
    } = await Device.create(request.body);

    await Status.create({ value: 0, device_id: id });

    return response.status(201).json({
      id,
      name,
      series,
      district,
      street,
      number,
      latitude,
      longitude,
      height,
      weight_supported,
      type,
      time_collect,
      time_average,
      active,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(2)
        .required(),
      series: Yup.number()
        .positive()
        .required(),
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
      height: Yup.number()
        .positive()
        .required(),
      weight_supported: Yup.number()
        .positive()
        .required(),
      type: Yup.string()
        .trim()
        .oneOf(['Orgânico', 'Inorgânico'])
        .required(),
      time_collect: Yup.string().trim(),
      time_average: Yup.string().trim(),
      city_id: Yup.number().required(),
      manager_id: Yup.number().required(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha na alteração, verifique os dados informados' });
    }

    const { name } = request.body;

    const { id } = request.params;

    const device = await Device.findByPk(id);

    if (name !== device.name) {
      const deviceExists = await Device.findOne({ where: { name } });

      if (deviceExists) {
        return response
          .status(400)
          .json({ error: 'Dispositivo já cadastrado' });
      }
    }

    const {
      series,
      district,
      street,
      number,
      latitude,
      longitude,
      height,
      weight_supported,
      type,
      time_collect,
      time_average,
      active,
    } = await device.update(request.body);

    return response.status(200).json({
      id,
      name,
      series,
      district,
      street,
      number,
      latitude,
      longitude,
      height,
      weight_supported,
      type,
      time_collect,
      time_average,
      active,
    });
  }

  async list(request, response) {
    const { page = 1 } = request.query;

    const count = await Device.count();

    const devices = await Device.findAll({
      attributes: [
        'id',
        'name',
        'district',
        'street',
        'time_average',
        'active',
      ],
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
          limit: 1,
        },
      ],
      limit: 10,
      offset: (page - 1) * 10,
      order: ['id'],
    });

    response.header('X-Total-Count', count);
    return response.status(200).json(devices);
  }

  async index(request, response) {
    const { id } = request.params;

    const device = await Device.findByPk(id, {
      attributes: [
        'id',
        'name',
        'series',
        'district',
        'street',
        'number',
        'latitude',
        'longitude',
        'height',
        'weight_supported',
        'type',
        'time_collect',
        'time_average',
        'active',
        'createdAt',
      ],
      include: [
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
          model: Status,
          as: 'status',
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
    });

    return response.status(200).json(device);
  }

  async delete(request, response) {
    const { id } = request.params;

    const containsStatus = await Status.findAll({ where: { device_id: id } });
    if (containsStatus) {
      containsStatus.map(async status => {
        await status.destroy();
      });
    }

    const containsDamageReports = await DamageReport.findAll({
      where: { device_id: id },
    });
    if (containsDamageReports) {
      containsDamageReports.map(async damageReport => {
        await damageReport.destroy();
      });
    }

    const device = await Device.findByPk(id);

    if (device) {
      await device.destroy();
    }

    return response.status(204).send();
  }

  async amountDeviceMonthAndYear(request, response) {
    const device = await Device.findAll({
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

    return response.status(200).json(device);
  }
}

export default new DeviceController();
