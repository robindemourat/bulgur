import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {v4 as uuid} from 'uuid';
import {persistentReducer} from 'redux-pouchdb';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

import {bootstrapColorsMap} from '../../helpers/colorHelpers';

import models from '../../models/visualizationTypes';

/*
 * Action names
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = 'START_PRESENTATION_CANDIDATE_CONFIGURATION';
export const APPLY_PRESENTATION_CANDIDATE_CONFIGURATION = 'APPLY_PRESENTATION_CANDIDATE_CONFIGURATION';


export const SET_ACTIVE_PRESENTATION = 'SET_ACTIVE_PRESENTATION';
export const UNSET_ACTIVE_PRESENTATION = 'UNSET_ACTIVE_PRESENTATION';

export const CHANGE_VIEW_BY_USER = 'CHANGE_VIEW_BY_USER';

export const ADD_SLIDE = 'ADD_SLIDE';
export const REMOVE_SLIDE = 'REMOVE_SLIDE';
export const SET_ACTIVE_SLIDE = 'SET_ACTIVE_SLIDE';
export const UPDATE_SLIDE = 'UPDATE_SLIDE';

const OPEN_PRESENTATION_CANDIDATE_MODAL = 'OPEN_PRESENTATION_CANDIDATE_MODAL';
const CLOSE_PRESENTATION_CANDIDATE_MODAL = 'CLOSE_PRESENTATION_CANDIDATE_MODAL';
const OPEN_TAKE_AWAY_MODAL = 'OPEN_TAKE_AWAY_MODAL';
const CLOSE_TAKE_AWAY_MODAL = 'CLOSE_TAKE_AWAY_MODAL';
const SET_UI_MODE = 'SET_UI_MODE';
const TOGGLE_SLIDE_SETTINGS_PANNEL = 'TOGGLE_SLIDE_SETTINGS_PANNEL';

export const SET_VIEW_COLOR = 'SET_VIEW_COLOR';
const TOGGLE_VIEW_COLOR_EDITION = 'TOGGLE_VIEW_COLOR_EDITION';
export const SET_VIEW_DATAMAP_ITEM = 'SET_VIEW_DATAMAP_ITEM';

export const RESET_APP = 'RESET_APP';

/*
 * Action creators
 */

export const startPresentationCandidateConfiguration = (presentation) => ({
  type: START_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation,
  id: presentation !== undefined && presentation.id ? presentation.id : uuid()
});

export const applyPresentationCandidateConfiguration = (presentation) => ({
  type: APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation
});

export const setActivePresentation = (presentation) => ({
  type: SET_ACTIVE_PRESENTATION,
  presentation
});

export const unsetActivePresentation = () => ({
  type: UNSET_ACTIVE_PRESENTATION
});

export const changeViewByUser = (id, event) => ({
  type: CHANGE_VIEW_BY_USER,
  event,
  id
});

export const addSlide = (id, slide = {}) => ({
  type: ADD_SLIDE,
  slide,
  id
});

export const updateSlide = (id, slide = {}) => ({
  type: UPDATE_SLIDE,
  slide,
  id
});

export const removeSlide = (id) => ({
  type: REMOVE_SLIDE,
  id
});

export const setActiveSlide = (id, slide) => ({
  type: SET_ACTIVE_SLIDE,
  slide,
  id
});

export const openPresentationCandidateModal = () => ({
  type: OPEN_PRESENTATION_CANDIDATE_MODAL
});

export const closePresentationCandidateModal = () => ({
  type: CLOSE_PRESENTATION_CANDIDATE_MODAL
});

export const openTakeAwayModal = () => ({
  type: OPEN_TAKE_AWAY_MODAL
});

export const closeTakeAwayModal = () => ({
  type: CLOSE_TAKE_AWAY_MODAL
});

export const setUiMode = (mode = 'edition') => ({
  type: SET_UI_MODE,
  mode
});

export const toggleSlideSettingsPannel = (to) => ({
  type: TOGGLE_SLIDE_SETTINGS_PANNEL,
  to
});

export const toggleViewColorEdition = (visualizationId, collectionId, category) => ({
  type: TOGGLE_VIEW_COLOR_EDITION,
  visualizationId,
  collectionId,
  category
});

export const setViewColor = (visualizationId, collectionId, category, color) => ({
  type: SET_VIEW_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});

export const setViewDatamapItem = (visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_VIEW_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName
});

export const resetApp = () => ({
  type: RESET_APP
});

/*
 * Reducers
 */

const EDITOR_DEFAULT_STATE = {
    activeViews: undefined,
    activeSlideId: undefined,
    editedColor: undefined
};
function editor(state = EDITOR_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return EDITOR_DEFAULT_STATE;

    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
    case SET_ACTIVE_PRESENTATION:
      const defaultViews = Object.keys(action.presentation.visualizations).reduce((result, visualizationKey) => {
        const visualization = action.presentation.visualizations[visualizationKey];
        const viewParameters = {
          ...models[visualization.metadata.visualizationType].defaultViewParameters,
          colorsMap: visualization.colorsMap
        };
        let data;
        // flatten datamap fields (#todo: refactor as helper)
        const dataMap = Object.keys(visualization.dataMap).reduce((dataMapResult, collectionId) => ({
          ...dataMapResult,
          [collectionId]: Object.keys(visualization.dataMap[collectionId]).reduce((propsMap, parameterId) => {
            const parameter = visualization.dataMap[collectionId][parameterId];
            if (parameter.mappedField) {
              return {
                ...propsMap,
                [parameterId]: parameter.mappedField
              };
            }
            return propsMap;
          }, {})
        }), {});
        switch (visualization.metadata.visualizationType) {
          case 'map':
            data = mapMapData(visualization.data, dataMap);
            break;
          case 'timeline':
            data = mapTimelineData(visualization.data, dataMap);
            break;
          case 'network':
            data = mapNetworkData(visualization.data, dataMap);
            break;
          default:
            data = visualization.data;
            break;
        }
        const colorsMap = visualization.colorsMap;
        // delete visualization.colorsMap;
        return {
          ...result,
          [visualizationKey]: {
            ...visualization,
            viewParameters: {
              ...viewParameters,
              colorsMap
            },
            data
          }
        };
      }, {});
      return {
        ...state,
        activeViews: {
          ...defaultViews
        },
        activeSlideId: action.presentation.order && action.presentation.order.length ?
          action.presentation.order[0]
          : state.activeSlideId
      };
    case CHANGE_VIEW_BY_USER:
      return {
        ...state,
        activeViews: {
          ...state.activeViews,
          [action.id]: {
            ...state.activeViews[action.id],
            viewParameters: {
              ...state.activeViews[action.id].viewParameters,
              ...action.event.viewParameters
            }
          }
        }
      };


    case ADD_SLIDE:
    case SET_ACTIVE_SLIDE:
      return {
        ...state,
        activeSlideId: action.id,
        activeViews: Object.keys(state.activeViews).reduce((activeViews, id) => ({
          ...activeViews,
          [id]: {
            ...state.activeViews[id],
            // update data map
            dataMap: action.slide.views[id].dataMap,
            // updated view parameters
            viewParameters: action.slide.views[id].viewParameters
          }
        }), {})
      };

    case TOGGLE_VIEW_COLOR_EDITION:
      const {collectionId, category, visualizationId} = action;
      if (state.editedColor === undefined || state.editedColor.collectionId !== collectionId || state.editedColor.category !== category) {
        return {
          ...state,
          editedColor: {
            visualizationId,
            collectionId,
            category
          }
        };
      }
      return {
        ...state,
        editedColor: undefined
      };
    case SET_VIEW_COLOR:
      const {color} = action;
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            viewParameters: {
              ...state.activeViews[action.visualizationId].viewParameters,
              colorsMap: {
                ...state.activeViews[action.visualizationId].viewParameters.colorsMap,
                [action.collectionId]: {
                  ...state.activeViews[action.visualizationId].viewParameters.colorsMap[action.collectionId],
                  [action.category]: color
                }
              }
            }
          }
        }
      };
    case SET_VIEW_DATAMAP_ITEM:
      let newcolorsMap;
      if (action.parameterId === 'category') {
        newcolorsMap = {...state.activeViews[action.visualizationId].viewParameters.colorsMap} || {};
        const dataset = state.activeViews[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = bootstrapColorsMap(dataset, action.propertyName);
      }
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            // update colorsMap
            colorsMap: newcolorsMap || state.activeViews[action.visualizationId].viewParameters.colorsMap,
            // updatedatamap
            dataMap: {
              ...state.activeViews[action.visualizationId].dataMap,
              [action.collectionId]: {
                ...state.activeViews[action.visualizationId].dataMap[action.collectionId],
                [action.parameterId]: {
                  ...state.activeViews[action.visualizationId].dataMap[action.collectionId][action.parameterId],
                  mappedField: action.propertyName
                }
              }
            }
          }
        }
      };

    default:
      return state;
  }
}

const GLOBAL_UI_DEFAULT_STATE = {
    presentationCandidateModalOpen: false,
    takeAwayModalOpen: false,
    activePresentationId: undefined,
    slideSettingsPannelOpen: false,
    uiMode: 'edition' // in ['edition', 'preview']
};
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return GLOBAL_UI_DEFAULT_STATE;
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return {
        ...state,
        presentationCandidateModalOpen: false,
        activePresentationId: action.presentation.id
      };
    case SET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: action.presentation.id
      };
    case UNSET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: undefined
      };
    case START_PRESENTATION_CANDIDATE_CONFIGURATION:
    case OPEN_PRESENTATION_CANDIDATE_MODAL:
      return {
        ...state,
        presentationCandidateModalOpen: true
      };
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
      return {
        ...state,
        presentationCandidateModalOpen: false
      };
    case OPEN_TAKE_AWAY_MODAL:
      return {
        ...state,
        takeAwayModalOpen: true
      };
    case CLOSE_TAKE_AWAY_MODAL:
      return {
        ...state,
        takeAwayModalOpen: false
      };
    case SET_UI_MODE:
      return {
        ...state,
        uiMode: action.mode
      };
    case TOGGLE_SLIDE_SETTINGS_PANNEL:
      return {
        ...state,
        slideSettingsPannelOpen: typeof action.to === 'boolean' ? action.to : !state.slideSettingsPannelOpen
      };
    default:
      return state;
  }
}


// export default combineReducers({
//   globalUi,
//   editor
// });
export default persistentReducer(combineReducers({
  globalUi,
  editor
}), 'bulgur-editor');

/*
 * Selectors
 */

 const activePresentationId = state => state.globalUi.activePresentationId;

const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;

const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;

const slideSettingsPannelIsOpen = state => state.globalUi.slideSettingsPannelOpen;

const globalUiMode = state => state.globalUi.uiMode;


const editedColor = state => state.editor.editedColor;
const activeViews = state => state.editor.activeViews;
const activeSlideId = state => state.editor.activeSlideId;

export const selector = createStructuredSelector({
  activePresentationId,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  globalUiMode,
  slideSettingsPannelIsOpen,
  editedColor,

  activeViews,
  activeSlideId
});
