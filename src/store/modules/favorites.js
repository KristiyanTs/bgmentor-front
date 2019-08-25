import {
  FavoriteService
} from "@/common/api.service";

import {
  FETCH_FAVORITES,
  CREATE_FAVORITE,
  DESTROY_FAVORITE,
} from "../actions.type";

import {
  SET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE
} from "../mutations.type";

const state = {
  favorites: []
}

const getters = {
  favorites(state) {
    return state.favorites;
  }
}

const actions = {
  async [FETCH_FAVORITES](context) {
    const { data } = await FavoriteService.all();
    context.commit(SET_FAVORITES, data);
  },
  async [CREATE_FAVORITE](context, params) { // should be checked
    const { data } = await FavoriteService.create(params);
    context.commit(ADD_FAVORITE, data);
  },
  async [DESTROY_FAVORITE](context, slug) { // should be checked
    const { data } = await FavoriteService.delete(slug);
    context.commit(REMOVE_FAVORITE, data);
  }
}

const mutations = {
  [SET_FAVORITES](state, favorites) {
    state.favorites = favorites;
  },
  [ADD_FAVORITE](state, favorite) {

  },
  [REMOVE_FAVORITE](state, favorite) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}