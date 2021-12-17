export interface ICRUDRepository<T> {
  index(): Promise<T[]>;

  create(model: Partial<T>): Promise<T>;

  delete(id: number): Promise<T>;

  show(id: number): Promise<T>;

  update(model: T): Promise<T>;
}
