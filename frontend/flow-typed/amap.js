/** 
 * amap.js
 *
 * AMap type. map version 1.3
 */

/// Basic

declare class AMap$Pixel {
  constructor(x: number, y: number): void,
  getX(): number,
  getY(): number,
  equals(point: AMap$Pixel): boolean,
  toString(): string
}

declare class AMap$Size {
  constructor(width: number, height: number): void,
  getWidth(): number,
  getHeight(): number,
  toString(): string
}

declare class AMap$LngLat {
  constructor(lng: number, lat: number): void,
  offset(w: number, s: number): AMap$LngLat,
  distance(lnglat: AMap$LngLat | Array<AMap$LngLat>): number,
  getLng(): number,
  getLat(): number,
  equals(lnglat: AMap$LngLat): boolean,
  toString(): string
}

declare class AMap$Bounds {
  constructor(southWest: AMap$LngLat, northEast: AMap$LngLat): void,
  contains(point: AMap$LngLat): boolean,
  getCenter(): AMap$LngLat,
  getSouthWest(): AMap$LngLat,
  getNorthEast(): AMap$LngLat,
  toString(): string
}

/// Map

declare type CRS = 'EPSG3857' | 'EPSG3395' | 'EPSG4326'
declare type Feature = 'bg' | 'point' | 'road' | 'building'
declare type Lang = 'zh_cn' | 'en' | 'zh_en'

declare type AMap$View2DOptions = {
  center: AMap$LngLat,
  rotation: number,
  zoom: number,
  crs: CRS
}

declare class AMap$View2D {
  constructor(opt: AMap$View2DOptions): AMap$View2D
}

declare type AMap$MapOptions = {
  view?: AMap$View2D,
  layers?: Array<AMap$TileLayer>,
  zoom?: number,
  center?: AMap$LngLat,
  labelzIndex?: number,
  zooms?: Array<$PropertyType<AMap$MapOptions, 'zoom'>>,
  lang?: Lang,
  cursor?: string,
  crs?: CRS,
  animateEnable?: boolean,
  isHotspot?: boolean,
  defaultLayer?: AMap$TileLayer,
  rotateEnable?: boolean,
  resizeEnable?: boolean,
  showIndoorMap?: boolean,
  // TODO IndoorMap
  indoorMap?: any,
  expandZoomRange?: boolean,
  dragEnable?: boolean,
  zoomEnable?: boolean,
  doubleClickZoom?: boolean,
  keyboardEnable?: boolean,
  jogEnable?: boolean,
  scrollWheel?: boolean,
  touchZoom?: boolean,
  mapStyle?: string,
  features?: Array<Feature>,
  showBuildingBlock?: boolean
}

declare class AMap$Map extends AMap$Event {
  constructor(container: string | HTMLElement, opts?: AMap$MapOptions): void,
  poiOnAMAP(obj: Object): void,
  detailOnAMAP(obj: Object): void,
  getZoom(): $PropertyType<AMap$MapOptions, 'zoom'>,
  getLayers(): $PropertyType<AMap$MapOptions, 'layers'>,
  getCenter(): $PropertyType<AMap$MapOptions, 'center'>,
  getContainer(): $PropertyType<AMap$MapOptions, 'container'>,
  getCity(
    cb: Function
  ): {
    province: string,
    city: string,
    citycode: string,
    district: string
  },
  getAMap$Bounds: $PropertyType<AMap$MapOptions, 'bounds'>,
  getlabelzIndex(): $PropertyType<AMap$MapOptions, 'labelzIndex'>,
  getLimitAMap$Bounds(): Array<$PropertyType<AMap$MapOptions, 'bounds'>>,
  getLang(): $PropertyType<AMap$MapOptions, 'lang'>,
  getSize(): AMap$Size,
  getRotation(): number,
  getStatus(): Object,
  getDefaultCursor: string,
  getResolution(point: AMap$LngLat): number,
  getScale(dpi: number): number,
  setZoom(zoom: $PropertyType<AMap$MapOptions, 'zoom'>): void,
  setlabelzIndex(index: $PropertyType<AMap$MapOptions, 'labelzIndex'>): void,
  setLayers(layers: $PropertyType<AMap$MapOptions, 'layers'>): void,
  add(overlayers: Array<any>): void,
  remove(overlayers: Array<any>): void,
  getAllOverlays(type: 'marker' | 'circle' | 'polyline' | 'polygon'): Object,
  setCenter(position: $PropertyType<AMap$MapOptions, 'center'>): void,
  setZoomAndCenter(
    zoom: $PropertyType<AMap$MapOptions, 'zoom'>,
    center: $PropertyType<AMap$MapOptions, 'center'>
  ): void,
  setCity(city: string, callback: Function): void,
  setBounds(bound: $PropertyType<AMap$MapOptions, 'bounds'>): void,
  setLimitAMap$Bounds(
    bounds: Array<$PropertyType<AMap$MapOptions, 'bounds'>>
  ): void,
  clearLimitAMap$Bounds(): void,
  setLang(lang: $PropertyType<AMap$MapOptions, 'lang'>): string,
  setRotation(rotate: number): number,
  setStatus(status: Object): void,
  setDefaultCursor(cursor: string): void,
  zoomIn(): void,
  zoomOut(): void,
  panTo(position: AMap$LngLat): void,
  panBy(x: number, y: number): void,
  setFitView(overlayList: Array<any>): void,
  clearMap(): void,
  destroy(): void,
  plugin(name: string | Array<string>, callback: Function): void,
  addControl(obj: Object): void,
  removeControl(obj: Object): void,
  clearInfoWindow(): void,
  pixelToAMap$LngLat(pixel: AMap$Pixel, level: number): AMap$LngLat,
  lnglatToAMap$Pixel(lnglat: AMap$LngLat, level: number): AMap$Pixel,
  containerToAMap$LngLat(pixel: AMap$Pixel): AMap$LngLat,
  lngLatToContainer(lnglat: AMap$LngLat): AMap$Pixel,
  setMapStyle(style: $PropertyType<AMap$MapOptions, 'mapStyle'>): void,
  getMapStyle(): string,
  setFeatures(feature: $PropertyType<AMap$MapOptions, 'features'>): void,
  getFeatures(): $PropertyType<AMap$MapOptions, 'features'>,
  setDefaultLayer(layer: AMap$TileLayer): void
}

/// Event

declare class AMap$Event {
  on(name: string, handle: Function, context: any): void,
  off(name: string, handle: Function, context: any): void
}

declare class AMap$EventListener {
  lnglat: AMap$LngLat,
  pixel: AMap$Pixel,
  type: string,
  target: Object
}

declare class AMap$EventEmitter {
  addDomListener(
    instance: any,
    name: string,
    handle: Function,
    context: any
  ): AMap$EventListener,
  addListener(
    instance: any,
    name: string,
    handle: Function,
    context: any
  ): AMap$EventListener,
  addListenerOnce(
    instance: any,
    name: string,
    handle: Function,
    context: any
  ): AMap$EventListener,
  removeListener(linstener: AMap$EventListener): void,
  trigger(linstener: AMap$EventListener): void
}

/// Layer
declare type AMap$TileLayerOptions = {
  map: AMap$Map,
  zIndex: number,
  opacity: number,
  zooms: Array<$PropertyType<AMap$MapOptions, 'zoom'>>,
  tileSize: 256 | 128 | 64,
  tileUrl: string,
  errorUrl: string,
  getTileUrl: string | Function,
  detectRetina: boolean
}

declare class AMap$TileLayer extends AMap$Event {
  constructor(opts: AMap$TileLayerOptions): AMap$TileLayer,
  setOpacity(alpha: number): void,
  show(): void,
  hide(): void,
  getZooms(): Array<$PropertyType<AMap$MapOptions, 'zoom'>>,
  setzIndex(index: number): void,
  setMap(map: AMap$Map): void,
  getTiles(): Array<any>,
  reload(): void,
  setTileUrl(): void
}

declare type AMap$CustomLayerOptions = {
  map: AMap$Map,
  zIndex: number,
  opacity: number,
  zooms: Array<$PropertyType<AMap$MapOptions, 'zoom'>>
}

declare class AMap$CustomLayer extends AMap$Event {
  constructor(opts: AMap$CustomLayerOptions): AMap$CustomLayer,
  setOpacity(alpha: number): void,
  show(): void,
  hide(): void,
  getZooms(): Array<$PropertyType<AMap$MapOptions, 'zoom'>>,
  setzIndex(index: number): void,
  setMap(map: AMap$Map): void
}

// TODO
declare class AMap$TileLayer$Satellite extends AMap$Event {}
declare class AMap$TileLayer$RoadNet extends AMap$Event {}
declare class AMap$TileLayer$Traffic extends AMap$Event {}
declare class AMap$Buildings extends AMap$Event {}
declare class AMap$ImageLayer extends AMap$Event {}
declare class AMap$MassMarks extends AMap$Event {}
declare class AMap$Heatmap extends AMap$Event {}

/// Overlayer

declare type AMap$MarkerOptions = {
  map: AMap$Map,
  position: AMap$LngLat,
  offset: AMap$Pixel,
  icon: string | AMap$Icon,
  content: string | HTMLElement,
  topWhenClick: boolean,
  bubble: boolean,
  draggable: boolean,
  raiseOnDrag: boolean,
  cursor: string,
  visible: boolean,
  zIndex: number,
  angle: number,
  autoRotation: boolean,
  animation:
    | 'AMAP_ANIMATION_NONE'
    | 'AMAP_ANIMATION_DROP'
    | 'AMAP_ANIMATION_BOUNCE',
  shadow: AMap$Icon,
  title: string,
  clickable: string,
  shape: AMap$MarkerShape,
  extData: any,
  label: {
    content: $PropertyType<AMap$MarkerOptions, 'content'>,
    offset: $PropertyType<AMap$MarkerOptions, 'offset'>
  }
}

declare class AMap$Marker extends AMap$Event {
  constructor(opts: AMap$MarkerOptions): AMap$Marker,
  markOnAMAP(obj: Object): void,
  getOffset(): $PropertyType<AMap$MarkerOptions, 'offset'>,
  setOffset(offset: $PropertyType<AMap$MarkerOptions, 'offset'>): void,
  setAnimation(animate: $PropertyType<AMap$MarkerOptions, 'animation'>): void,
  getAnimation(): $PropertyType<AMap$MarkerOptions, 'animation'>,
  setClickable(clickable: boolean): void,
  getClickable(): void,
  getPosition(): $PropertyType<AMap$MarkerOptions, 'position'>,
  setPosition(lnglat: $PropertyType<AMap$MarkerOptions, 'position'>): void,
  setAngle(angle: $PropertyType<AMap$MarkerOptions, 'angle'>): void,
  getAngle(): $PropertyType<AMap$MarkerOptions, 'angle'>,
  setLabel(label: $PropertyType<AMap$MarkerOptions, 'label'>): void,
  getLabel(): $PropertyType<AMap$MarkerOptions, 'label'>,
  setzIndex(index: $PropertyType<AMap$MarkerOptions, 'zindex'>): void,
  getzIndex(): $PropertyType<AMap$MarkerOptions, 'zindex'>,
  setIcon(icon: $PropertyType<AMap$MarkerOptions, 'icon'>): void,
  getIcon(): $PropertyType<AMap$MarkerOptions, 'icon'>,
  setDraggable(draggable: $PropertyType<AMap$MarkerOptions, 'draggable'>): void,
  getDraggable(): $PropertyType<AMap$MarkerOptions, 'draggable'>,
  setContent(content: $PropertyType<AMap$MarkerOptions, 'content'>): void,
  getContent(): $PropertyType<AMap$MarkerOptions, 'content'>,
  hide(): void,
  show(): void,
  setCursor(cursor: $PropertyType<AMap$MarkerOptions, 'cursor'>): void,
  getCursor(): $PropertyType<AMap$MarkerOptions, 'cursor'>,
  moveAlong(
    path: Array<AMap$LngLat>,
    speed: number,
    f: Function,
    circlable: boolean
  ): void,
  moveTo(lnglat: AMap$LngLat, speed: number, f: Function): void,
  stopMove(): void,
  pauseMove(): void,
  resumeMove(): void,
  setMap(map: $PropertyType<AMap$MarkerOptions, 'map'>): void,
  getMap(): $PropertyType<AMap$MarkerOptions, 'map'>,
  setTitle(title: $PropertyType<AMap$MarkerOptions, 'title'>): void,
  getTitle(): $PropertyType<AMap$MarkerOptions, 'title'>,
  setTitle(isTop: boolean): void,
  getTitle(): boolean,
  setShadow(icon: $PropertyType<AMap$MarkerOptions, 'icon'>): void,
  getShadow(): $PropertyType<AMap$MarkerOptions, 'icon'>,
  setShape(shape: $PropertyType<AMap$MarkerOptions, 'shape'>): void,
  getShape(): $PropertyType<AMap$MarkerOptions, 'shape'>,
  setExtData(ext: $PropertyType<AMap$MarkerOptions, 'extData'>): void,
  getExtData(): $PropertyType<AMap$MarkerOptions, 'extData'>
}

declare type AMap$MarkershapeOptions = {
  coords: Array<number>,
  type: 'circle' | 'poly' | 'rect'
}

declare class AMap$MarkerShape extends AMap$Event {
  constructor(opt: AMap$MarkershapeOptions): AMap$MarkerShape
}

declare type AMap$IconOptions = {
  size: AMap$Size,
  imageOffset: AMap$Pixel,
  image: string,
  imageSize: AMap$Size
}

declare class AMap$Icon extends AMap$Event {
  constructor(opt: AMap$IconOptions): AMap$Icon,
  setImageSize(size: $PropertyType<AMap$IconOptions, 'size'>): void,
  getImageSize(): $PropertyType<AMap$IconOptions, 'size'>
}

// TODO
declare class AMap$Polyline extends AMap$Event {}
declare class AMap$Polygon extends AMap$Event {}
declare class AMap$Circle extends AMap$Event {}
declare class AMap$GroundImage extends AMap$Event {}
declare class AMap$ContextMenu extends AMap$Event {}

/// Window

declare type AMap$InfoWindowOptions = {
  isCustom: boolean,
  autoMove: boolean,
  closeWhenClickMap: boolean,
  content: string | HTMLElement,
  size: AMap$Size,
  offset: AMap$Pixel,
  position: AMap$LngLat,
  showShadow: boolean
}

declare class AMap$InfoWindow extends AMap$Event {
  constructor(opt: AMap$InfoWindowOptions): AMap$InfoWindow,
  open(map: AMap$Map, pos: AMap$LngLat): void,
  close(): void,
  getIsOpen(): boolean,
  setContent(content: $PropertyType<AMap$InfoWindowOptions, 'content'>): void,
  getContent(): $PropertyType<AMap$InfoWindowOptions, 'content'>,
  setPosition(
    position: $PropertyType<AMap$InfoWindowOptions, 'position'>
  ): void,
  getPosition(): $PropertyType<AMap$InfoWindowOptions, 'position'>,
  setSize(size: $PropertyType<AMap$InfoWindowOptions, 'size'>): void,
  getSize(): $PropertyType<AMap$InfoWindowOptions, 'size'>
}

// TODO
declare class AMap$ContextMenu extends AMap$Event {}

/// Geo

declare type AMap$GeocoderOptions = {
  city: string,
  radius: number,
  batch: boolean,
  extensions: string
}

declare class AMap$Geocoder extends AMap$Event {
  constructor(opts: AMap$GeocoderOptions): AMap$Geocoder,
  // TODO callback
  getLocation(address: string, callback: Function): void,
  setCity(city: $PropertyType<AMap$GeocoderOptions, 'city'>): void,
  getAddress(
    location: AMap$LngLat | Array<AMap$LngLat>,
    callback: Function
  ): void
}

declare class AMap$convertFrom extends AMap$Event {}

/// Tools

declare type AMap$ToolPosition = 'LT' | 'RT' | 'LB' | 'RB'

declare type AMap$ToolBarOptions = {
  offset: AMap$Pixel,
  position: AMap$ToolPosition,
  ruler: boolean,
  noIpLocate: boolean,
  locate: boolean,
  liteStyle: boolean,
  direction: boolean,
  autoPosition: boolean,
  locationMarker: AMap$Marker,
  useNative: boolean
}

declare class AMap$ToolBar extends AMap$Event {
  constructor(opts: AMap$ToolBarOptions): AMap$ToolBarOptions,
  setOffset(offset: $PropertyType<AMap$ToolBarOptions, 'offset'>): void,
  getOffset(): $PropertyType<AMap$ToolBarOptions, 'offset'>,
  hideRuler(): void,
  showRuler(): void,
  hideDirection(): void,
  showDirection(): void,
  hideLocation(): void,
  showLocation(): void,
  hide(): void,
  show(): void,
  doLocation(): void,
  getLocation(): AMap$LngLat
}

declare type AMap$ScaleOptions = {}
declare class AMap$Scale extends AMap$Event {
  constructor(): AMap$Scale,
  show(): void,
  hide(): void,
  offset(): AMap$Pixel,
  position(): AMap$ToolPosition
}

declare class AMap$MapType extends AMap$Event {}
declare class AMap$OverView extends AMap$Event {}

/// AMap

declare var AMap: {
  event: AMap$EventEmitter,
  EventListener: AMap$EventListener,
  plugin: Function,
  service: Function,
  Pixel: AMap$Pixel,
  Size: AMap$Size,
  LngLat: AMap$LngLat,
  Bounds: AMap$Bounds,
  Map: typeof AMap$Map,
  TileLayer: AMap$TileLayer,
  CustomLayer: AMap$CustomLayer,
  Marker: AMap$Marker,
  InfoWindow: AMap$InfoWindow,
  Geocoder: AMap$Geocoder,
  ToolBar: AMap$ToolBar,
  Scale: AMap$Scale
}
