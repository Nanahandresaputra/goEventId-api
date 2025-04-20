export enum role_user {
  super_admin = 'super_admin',
  admmin = 'admin',
  customer = 'customer',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Feature {
  User,
  Pemesanan,
}
