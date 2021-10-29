import {
  Deck, 
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {Tile3DLayer} from '@deck.gl/geo-layers';
import {GsiTerrainLayer} from 'deckgl-gsi-terrain-layer';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidGE5dGE5IiwiYSI6InZCSDEtaW8ifQ.6XJrdNdKWoyuixwX-BG6xQ';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

const TERRAIN_IMAGE = 'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png';
const SURFACE_IMAGE = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const ELEVATION_DECODER = {
    scaler: 0.01, // 分解能, 実寸なら0.01
    offset: 0, // RGB値がゼロの場合の標高値
};

const TILESET_TERRAINS_URL = 'http://localhost:8887/gsi_enoshima_5m_unleveled/terrain/tileset.json'
const TILESET_BLDGS_URL = 'http://localhost:8887/gsi_enoshima_5m_unleveled/bldgs/tileset.json'
const TILESET_ROADS_URL = 'http://localhost:8887/gsi_enoshima_5m_unleveled/roads/tileset.json'

const INITIAL_VIEW_STATE = {
  latitude: 35.36,
  longitude: 138.73,
  zoom: 8,
  bearing: 0,
  pitch: 30,
  maxPitch: 89
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.5
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 0),
  color: [255, 255, 255],
  intensity: 3.0,
  _shadow: true
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];

const map = new mapboxgl.Map({
  container: 'map',
  style: MAP_STYLE,
  // Note: deck.gl will be in charge of interaction and event handling
  interactive: false,
  center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
  zoom: INITIAL_VIEW_STATE.zoom,
  bearing: INITIAL_VIEW_STATE.bearing,
  pitch: INITIAL_VIEW_STATE.pitch
});

export const deck = new Deck({
  canvas: 'deck-canvas',
  width: '100%',
  height: '100%',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  onViewStateChange: ({viewState}) => {
    map.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch
    });
  },
  // effects: [lightingEffect],
  layers: [
    // new GsiTerrainLayer({
    //   id: 'gsiTerrain',
    //   minZoom: 0,
    //   maxZoom: 15,
    //   strategy: "no-overlap",
    //   elevationDecoder: ELEVATION_DECODER,
    //   elevationData: TERRAIN_IMAGE,
    //   texture: SURFACE_IMAGE,
    //   color: [255, 255, 255]
    // }),
    new Tile3DLayer({
      id: 'terrain-layer',
      pointSize: 2,
      data: TILESET_TERRAINS_URL,
      loader: Tiles3DLoader,
    }),
    new Tile3DLayer({
      id: 'bldgs-layer',
      pointSize: 2,
      data: TILESET_BLDGS_URL,
      loader: Tiles3DLoader,
    }),
    new Tile3DLayer({
      id: 'roads-layer',
      pointSize: 2,
      data: TILESET_ROADS_URL,
      loader: Tiles3DLoader,
    })
  ]
});

// For automated test cases
/* global document */
document.body.style.margin = '0px';
