export type EntityInit<TEntity> = Promise<
  | { exists: true; get: () => TEntity }
  | { exists: false; create: () => Promise<TEntity> }
>;

export const entityExists = <TEntity>(
  get: () => TEntity,
): { exists: true; get: () => TEntity } => ({
  exists: true,
  get,
});

export const entityDoNotExists = <TEntity>(
  create: () => Promise<TEntity>,
): { exists: false; create: () => Promise<TEntity> } => ({
  exists: false,
  create,
});
