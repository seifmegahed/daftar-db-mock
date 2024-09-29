export type UserTableType = {
  id: number;
  name: string;
  username: string;
  role: string;
  active: boolean;
  password: string;

  createdAt: Date;
  lastActive?: Date;
  updatedAt?: Date;
};

export type AddressTableType = {
  id: number;
  name: string;
  addressLine: string;
  country: string;
  city: string;
  notes?: string;

  createdBy: number;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: number;
} & ({ supplierId: number } | { clientId: number });

export type ContactTableType = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  notes?: string;

  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
} & ({ supplierId: number } | { clientId: number });

export type ClientTableType = {
  id: number;
  name: string;
  registrationNumber: string;
  website?: string;
  notes?: string;
  isActive: boolean;

  primaryAddressId: number;
  primaryContactId: number;

  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
};

export type SupplierTableType = {
  id: number;
  name: string;
  field: string;
  registrationNumber: string;
  website?: string;
  notes?: string;
  isActive: boolean;

  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
};

export type ProjectTableType = {
  id: number;
  name: string;
  status: number;
  description?: string;
  startDate: Date;
  endDate: Date;
  notes?: string;

  clientId: number;
  ownerId: number;

  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
};

export type ItemTableType = {
  id: number;
  name: string;
  type: string;
  description?: string;
  mpn: string;
  make: string;
  notes?: string;

  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
};

export type DocumentTableType = {
  id: number;
  name: string;
  path: string;
  extension: string;
  notes?: string;

  createdBy: number;
  createdAt: Date;
};

export type ProjectItemTableType = {
  id: number;
  projectId: number;
  itemId: number;
  supplierId: number;
  quantity: number;
  price: string;
  currency: number;
};

export type DocumentRelationTableType = {
  id: number;
  documentId: number;
} & (
  | { projectId: number }
  | { supplierId: number }
  | { itemId: number }
  | { clientId: number }
);
