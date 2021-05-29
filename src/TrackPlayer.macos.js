import { Platform, AppRegistry, DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native'
// @ts-ignore
import * as resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'
import {
  MetadataOptions,
  PlayerOptions,
  Event,
  Track,
  State,
  TrackMetadataBase,
  NowPlayingMetadata,
} from './interfaces'

const { TrackPlayerModule: TrackPlayer } = NativeModules
const emitter = Platform.OS !== 'android' ? new NativeEventEmitter(TrackPlayer) : DeviceEventEmitter

// MARK: - Helpers

function resolveImportedPath(path) {
  if (!path) return undefined
  return resolveAssetSource(path) || path
}

// MARK: - General API

async function setupPlayer(options = {}){
  return TrackPlayer.setupPlayer(options || {})
}

function destroy() {
  return TrackPlayer.destroy()
}

function registerPlaybackService(factory) {
  if (Platform.OS === 'android') {
    // Registers the headless task
    AppRegistry.registerHeadlessTask('TrackPlayer', factory)
  } else {
    // Initializes and runs the service in the next tick
    setImmediate(factory())
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addEventListener(event, listener) {
  return emitter.addListener(event, listener)
}

// MARK: - Queue API

async function add(tracks, insertBeforeId) {
  // Clone the array before modifying it
  if (Array.isArray(tracks)) {
    tracks = [...tracks]
  } else {
    tracks = [tracks]
  }

  if (tracks.length < 1) return

  for (let i = 0; i < tracks.length; i++) {
    // Clone the object before modifying it
    tracks[i] = { ...tracks[i] }

    // Resolve the URLs
    tracks[i].url = resolveImportedPath(tracks[i].url)
    tracks[i].artwork = resolveImportedPath(tracks[i].artwork)

    // Cast ID's into strings
    tracks[i].id = `${tracks[i].id}`
  }

  return TrackPlayer.add(tracks, insertBeforeId)
}

async function remove(tracks) {
  if (!Array.isArray(tracks)) {
    tracks = [tracks]
  }

  return TrackPlayer.remove(tracks)
}

async function removeUpcomingTracks() {
  return TrackPlayer.removeUpcomingTracks()
}

async function skip(trackId) {
  return TrackPlayer.skip(trackId)
}

async function skipToNext() {
  return TrackPlayer.skipToNext()
}

async function skipToPrevious() {
  return TrackPlayer.skipToPrevious()
}

// MARK: - Control Center / Notifications API

async function updateOptions(options = {}) {
  options = { ...options }

  // Resolve the asset for each icon
  options.icon = resolveImportedPath(options.icon)
  options.playIcon = resolveImportedPath(options.playIcon)
  options.pauseIcon = resolveImportedPath(options.pauseIcon)
  options.stopIcon = resolveImportedPath(options.stopIcon)
  options.previousIcon = resolveImportedPath(options.previousIcon)
  options.nextIcon = resolveImportedPath(options.nextIcon)
  options.rewindIcon = resolveImportedPath(options.rewindIcon)
  options.forwardIcon = resolveImportedPath(options.forwardIcon)

  return TrackPlayer.updateOptions(options)
}

async function updateMetadataForTrack(trackId, metadata) {
  return TrackPlayer.updateMetadataForTrack(trackId, metadata)
}

function clearNowPlayingMetadata() {
  return TrackPlayer.clearNowPlayingMetadata()
}

function updateNowPlayingMetadata(metadata) {
  return TrackPlayer.updateNowPlayingMetadata(metadata)
}

// MARK: - Playback API

async function reset() {
  return TrackPlayer.reset()
}

async function play() {
  return TrackPlayer.play()
}

async function pause() {
  return TrackPlayer.pause()
}

async function stop() {
  return TrackPlayer.stop()
}

async function seekTo(position) {
  return TrackPlayer.seekTo(position)
}

async function setVolume(level) {
  return TrackPlayer.setVolume(level)
}

async function setRate(rate) {
  return TrackPlayer.setRate(rate)
}

// MARK: - Getters

async function getVolume() {
  return TrackPlayer.getVolume()
}

async function getRate() {
  return TrackPlayer.getRate()
}

async function getTrack(trackId) {
  return TrackPlayer.getTrack(trackId)
}

async function getQueue() {
  return TrackPlayer.getQueue()
}

async function getCurrentTrack() {
  return TrackPlayer.getCurrentTrack()
}

async function getDuration() {
  return TrackPlayer.getDuration()
}

async function getBufferedPosition() {
  return TrackPlayer.getBufferedPosition()
}

async function getPosition() {
  return TrackPlayer.getPosition()
}

async function getState() {
  return TrackPlayer.getState()
}

export * from './hooks'
export * from './interfaces'

export default {
  // MARK: - General API
  setupPlayer,
  destroy,
  registerPlaybackService,
  addEventListener,

  // MARK: - Queue API
  add,
  remove,
  removeUpcomingTracks,
  skip,
  skipToNext,
  skipToPrevious,

  // MARK: - Control Center / Notifications API
  updateOptions,
  updateMetadataForTrack,
  clearNowPlayingMetadata,
  updateNowPlayingMetadata,

  // MARK: - Playback API
  reset,
  play,
  pause,
  stop,
  seekTo,
  setVolume,
  setRate,

  // MARK: - Getters
  getVolume,
  getRate,
  getTrack,
  getQueue,
  getCurrentTrack,
  getDuration,
  getBufferedPosition,
  getPosition,
  getState,
}
