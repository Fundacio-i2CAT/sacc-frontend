// @flow

import type { UserType } from '../shared/types/UserType';
import { apiCall } from '../network/api';

export default async function getUser(account: string): UserType {
  try {
    const response = await apiCall('get', 'user', account);
    return {
      surnames: response.data.surnames,
      name: response.data.firstName,
      email: response.data.email,
      phone: response.data.phone,
      cardId: response.data.cardId,
      institutionName: response.data.institutionName
    };
  } catch (err) {
    console.log(err);
  }
}
