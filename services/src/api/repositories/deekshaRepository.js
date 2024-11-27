import apiClient from '../../../apiClient';
import deekshaEndpoints from '../endpoints/deekshaEndpoints';

export const getDeekshas = () => apiClient.get(deekshaEndpoints.getDeekshas);

export const getDeekshaById = id => apiClient.get(deekshaEndpoints.getDeekshaById(id));

export const createDeeksha = data => apiClient.post(deekshaEndpoints.createDeeksha, data);

export const updateDeeksha = (id, data) => apiClient.put(deekshaEndpoints.updateDeeksha(id), data);

export const deleteDeeksha = id => apiClient.delete(deekshaEndpoints.deleteDeeksha(id));
