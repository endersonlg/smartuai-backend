import City from '../models/City';

class StateController {
  async listStates(request, response) {
    const data = await City.findAll({
      attributes: ['state'],
      group: ['state'],
      order: ['state'],
    });
    const states = data.map(state => state.state);

    return response.status(200).json(states);
  }

  async listCities(request, response) {
    const cities = await City.findAll({
      attributes: ['id', 'name'],
      where: {
        state: request.params.state,
      },
      order: ['name'],
    });

    return response.status(200).json(cities);
  }
}
export default new StateController();
