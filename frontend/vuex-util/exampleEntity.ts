import {
  createEntityModule,
  EntityActions,
  EntityMutations,
} from '@/utils/store/createEntityModule';
import { Category } from '@/types/entities';

const entityModule = createEntityModule<Category>({
  apiURL: 'categories',
  namespace: 'categories',
});

export const NAMESPACE = entityModule.NAMESPACE;

export const state = entityModule.state;

export const mutations = entityModule.mutations;

export const actions = entityModule.actions;

export type CategoriesState = ReturnType<typeof state>;

export interface CategoriesActions
  extends EntityActions<CategoriesState, Category> {}

export interface CategoriesMutations
  extends EntityMutations<CategoriesState, Category> {}
