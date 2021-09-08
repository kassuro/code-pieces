import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { RootState } from '@/store';

/**
 * A enum representing common action types
 */
export enum Actions {
  LOAD_ALL = 'loadAll',
  LOAD_SINGLE = 'loadSingle',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

/**
 * A enum representing common mutation types
 */
export enum Mutations {
  SET_LIST = 'setList',
  ADD_TO_LIST = 'addToList',
  REMOVE_FROM_LIST = 'removeFromList',
  UPDATE_IN_LIST = 'updateInList',
  SET_ONE = 'setSingle',
  SET_IS_LOADING = 'setIsLoading',
  SET_ERROR = 'setError',
}

/**
 * Interface representing the types of the common entity actions
 * Infers type of action payloads when used with
 * vuex-composition-helpers package.
 */
export interface EntityActions<S, T> extends ActionTree<S, RootState> {
  [Actions.CREATE]: (
    ctx: ActionContext<S, RootState>,
    payload: T,
  ) => Promise<void>;
  [Actions.LOAD_ALL]: (ctx: ActionContext<S, RootState>) => Promise<void>;
  [Actions.LOAD_SINGLE]: (
    ctx: ActionContext<S, RootState>,
    id: string,
  ) => Promise<void>;
  [Actions.UPDATE]: (
    ctx: ActionContext<S, RootState>,
    payload: T,
  ) => Promise<void>;
  [Actions.DELETE]: (
    ctx: ActionContext<S, RootState>,
    payload: T,
  ) => Promise<void>;
}

/**
 * Interface representing the types of the common entity mutations
 * Infers type of action payloads when used with
 * vuex-composition-helpers package.
 */
export interface EntityMutations<S, T> extends MutationTree<S> {
  [Mutations.SET_LIST]: (state: S, list: T[]) => void;
  [Mutations.ADD_TO_LIST]: (state: S, entity: T) => void;
  [Mutations.REMOVE_FROM_LIST]: (state: S, deletedEntity: T) => void;
  [Mutations.UPDATE_IN_LIST]: (state: S, updatedEntity: T) => void;
  [Mutations.SET_ONE]: (state: S, entity: T | string) => void;
  [Mutations.SET_ERROR]: (state: S, error: string) => void;
  [Mutations.SET_IS_LOADING]: (state: S, isLoading: boolean) => void;
}

/**
 * Interface repesenting the base state of an entity module
 */
interface BaseState<T> {
  list: T[];
  selected: T | undefined;
  isLoading: boolean;
  error: string;
}

/**
 * CreateEnitityModule function options object
 */
interface CreateEntityModuleOptions {
  namespace: string;
  apiURL: string;
}

/**
 * Reperesents the return type of createEntityModule factory function
 */
interface EntityModule<T> {
  NAMESPACE: string;
  state: () => BaseState<T>;
  actions: ActionTree<BaseState<T>, RootState>;
  mutations: MutationTree<BaseState<T>>;
}

export const createEntityModule = <EntityType extends { id?: string }>(
  options: CreateEntityModuleOptions,
): EntityModule<EntityType> => {
  const state = (): BaseState<EntityType> => ({
    list: [],
    selected: undefined,
    error: '',
    isLoading: false,
  });

  const mutations: MutationTree<BaseState<EntityType>> = {
    [Mutations.SET_LIST]: (state, list: EntityType[]) => {
      state.list = list;
    },
    [Mutations.ADD_TO_LIST]: (state, entity: EntityType) => {
      state.list.push(entity);
    },
    [Mutations.REMOVE_FROM_LIST]: (state, deletedEntity: EntityType) => {
      const index = state.list.findIndex(
        (entity) => entity.id === deletedEntity.id,
      );
      state.list.splice(index, 1);
    },
    [Mutations.UPDATE_IN_LIST]: (state, updatedEntity: EntityType) => {
      const index = state.list.findIndex(
        (entity) => entity.id === updatedEntity.id,
      );
      state.list.splice(index, 1, updatedEntity);
    },
    [Mutations.SET_ONE]: (state, entity: EntityType | string) => {
      if (typeof entity === 'string') {
        state.selected = state.list.find((ele) => ele.id === entity);
      } else {
        state.selected = entity;
      }
    },
    [Mutations.SET_ERROR]: (state, error: string) => {
      state.error = error;
    },
    [Mutations.SET_IS_LOADING]: (state, isLoading: boolean) => {
      state.isLoading = isLoading;
    },
  };

  const actions: ActionTree<BaseState<EntityType>, RootState> = {
    async [Actions.CREATE]({ commit }, payload: EntityType) {
      commit(Mutations.SET_IS_LOADING, true);
      commit(Mutations.SET_ERROR, '');
      try {
        const { data } = await this.$axios.post(`/${options.apiURL}`, payload);
        commit(Mutations.ADD_TO_LIST, data);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          commit(Mutations.SET_ERROR, error.response.data);
        } else {
          commit(
            Mutations.SET_ERROR,
            'Interner Fehler, bitte kontaktieren Sie den Administrator',
          );
        }
      } finally {
        commit(Mutations.SET_IS_LOADING, false);
      }
    },

    async [Actions.LOAD_ALL]({ commit }) {
      commit(Mutations.SET_IS_LOADING, true);
      commit(Mutations.SET_ERROR, '');

      let list = [];

      try {
        const { data } = await this.$axios.get(`/${options.apiURL}`);
        list = data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit(
            Mutations.SET_ERROR,
            'Es konnten keine Benutzer gefunden werden.',
          );
        }
      } finally {
        commit(Mutations.SET_LIST, list);
        commit(Mutations.SET_IS_LOADING, false);
      }
    },

    async [Actions.LOAD_SINGLE]({ commit }, id: string) {
      commit(Mutations.SET_IS_LOADING, true);
      commit(Mutations.SET_ERROR, '');

      let entityInstance;

      try {
        const { data } = await this.$axios.get(`/${options.apiURL}/${id}`);
        entityInstance = data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit(
            Mutations.SET_ERROR,
            `Es konnten keine Instanz mit der ID ${id} gefunden werden.`,
          );
        }
      } finally {
        commit(Mutations.UPDATE_IN_LIST, entityInstance);
        commit(Mutations.SET_IS_LOADING, false);
      }
    },

    async [Actions.UPDATE]({ commit }, payload: EntityType) {
      commit(Mutations.SET_IS_LOADING, true);
      commit(Mutations.SET_ERROR, '');
      try {
        await this.$axios.put(`/${options.apiURL}/${payload.id}`, payload);
        commit(Mutations.UPDATE_IN_LIST, payload);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit(Mutations.SET_ERROR, error.response.data);
        }
      } finally {
        commit(Mutations.SET_IS_LOADING, false);
      }
    },

    async [Actions.DELETE]({ commit }, payload: EntityType) {
      commit(Mutations.SET_IS_LOADING, true);
      commit(Mutations.SET_ERROR, '');
      try {
        await this.$axios.delete(`/${options.apiURL}/${payload.id}`);
        commit(Mutations.REMOVE_FROM_LIST, payload);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit(Mutations.SET_ERROR, error.response.data);
        }
      } finally {
        commit(Mutations.SET_IS_LOADING, false);
      }
    },
  };

  return {
    NAMESPACE: options.namespace,
    state,
    actions,
    mutations,
  };
};
