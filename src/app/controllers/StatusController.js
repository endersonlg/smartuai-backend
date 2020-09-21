import * as Yup from 'yup';
import Status from '../models/Status';
import Device from '../models/Device';

class StatusController {
  async store(request, response) {
    const schema = Yup.object().shape({
      value: Yup.number().required(),
      device_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no cadastro, verifique seus dados' });
    }

    const { value, device_id } = request.body;
    const deviceExists = await Device.findByPk(device_id);

    if (!deviceExists) {
      return response.status(400).json({ error: 'Dispositivo não cadastrado' });
    }

    await Status.create({ value, device_id });

    return response.status(201).json({
      value,
      device_id,
    });
  }
}

export default new StatusController();
