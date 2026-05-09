import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.API_URL ?? 'http://prueba.test/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
})
let uiStore = null;
export function setUiStore(store) {
    uiStore = store;
}

api.interceptors.request.use(
    (config) => { uiStore?.startLoading(); return config },
    (error) => { uiStore?.stopLoading(); return Promise.reject(error) }
);

api.interceptors.response.use(
    (response) => { uiStore?.stopLoading(); return response },
    (error) => {
        uiStore?.stopLoading()
        let message = 'Ocurrió un error';
        if (error.response) {
            const { status, data } = error.response
            const serverMsg = data?.message || data?.error || data?.detail

            if (status === 422 && data?.errors) {
                const firstField = Object.values(data.errors)[0]
                message = Array.isArray(firstField) ? firstField[0] : firstField
            } else if (serverMsg) {
                message = serverMsg
            } else {
                const map = {
                    400: 'Solicitud incorrecta.',
                    401: 'No autorizado.',
                    403: 'Sin permisos para esta acción.',
                    404: 'Recurso no encontrado.',
                    409: 'El recurso ya existe.',
                    500: 'Error interno del servidor.',
                    503: 'Servicio no disponible.',
                }
                message = map[status] || `Error ${status}`
            }
        } else if (error.code === 'ECONNABORTED') {
            message = 'La solicitud tardó demasiado. Verifica tu conexión.'
        } else {
            message = 'Sin conexión al servidor.'
        }

        uiStore?.showToast({ type: 'error', message })
        return Promise.reject(error)

    }
);
export default api