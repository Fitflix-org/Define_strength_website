import api from './api';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  addresses: Address[];
}

export interface SingleAddressResponse {
  address: Address;
}

class AddressService {
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<AddressResponse>('/addresses');
      return response.data.addresses;
    } catch (error) {
      console.error('Get addresses error:', error);
      throw error;
    }
  }

  async createAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      const response = await api.post<SingleAddressResponse>('/addresses', addressData);
      return response.data.address;
    } catch (error) {
      console.error('Create address error:', error);
      throw error;
    }
  }

  async updateAddress(addressId: string, addressData: CreateAddressData): Promise<Address> {
    try {
      const response = await api.put<SingleAddressResponse>(`/addresses/${addressId}`, addressData);
      return response.data.address;
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  }

  async deleteAddress(addressId: string): Promise<void> {
    try {
      await api.delete(`/addresses/${addressId}`);
    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId: string): Promise<Address> {
    try {
      const response = await api.post<SingleAddressResponse>(`/addresses/${addressId}/set-default`, {});
      return response.data.address;
    } catch (error) {
      console.error('Set default address error:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
