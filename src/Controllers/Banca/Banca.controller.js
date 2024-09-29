import api from "@/api";

export default {
  async getBancas() {
    return await api.get("/bancas/getAll").then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async getBanca(id) {
    return await api.get(`/bancas/${id}`).then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async criarBanca(dados) {
    return await api.post("/bancas", dados).then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async atualizarBanca(id, dados) {
    return await api.put(`/bancas/${id}`, dados).then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async deletarBanca(id) {
    return await api.delete(`/bancas/${id}`).then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },
};