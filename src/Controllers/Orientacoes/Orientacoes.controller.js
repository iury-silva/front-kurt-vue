import api from '@/api'

export default {
  async getOrientacoes() {
    return await api.get('/orientacoes/getAll').then((response) => {
      if (response.data) {
        return response.data
      }
    })
  },

  async getCronogramas() {
    return await api.get('/cronogramas/getAll').then((response) => {
      if (response.data) {
        return response.data
      }
    })
  },

  async getAlunos() {
    return await api.get('/alunos/getAll').then((response) => {
      if (response.data) {
        return response.data
      }
    })
  },

  async getProfessores() {
    return await api.get('/professores/getAll').then((response) => {
      if (response.data) {
        return response.data
      }
    })
  },

  async createOrientacao(dados) {
    return await api
      .post('/orientacoes/create', dados)
      .then((response) => {
        if (response.data) {
          return true
        }
      })
      .catch(() => {
        return false
      })
  },

  async deleteOrientacao(id) {
    return await api
      .delete(`/orientacoes/${id}`)
      .then((response) => {
        if (response.data) {
          return true
        }
      })
      .catch(() => {
        return false
      })
  }
}
