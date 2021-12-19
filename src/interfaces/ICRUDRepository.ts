export interface ICRUDRepository<T, PrimaryKeyType> {
  index(): Promise<T[]>;

  create(model: Partial<T>): Promise<T>;

  delete(id: PrimaryKeyType): Promise<T>;

  show(id: PrimaryKeyType): Promise<T>;

  update(model: T): Promise<T>;

  exists(id: PrimaryKeyType): Promise<boolean>;
}
