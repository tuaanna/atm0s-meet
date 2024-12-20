'use client'

import { EventEmitter } from '@atm0s-media-sdk/core'
import { createContext } from 'react'

export enum ContextEvent {
  DeviceChanged = 'device.changed.',
}

export class Context extends EventEmitter {
  streams: Map<string, MediaStream> = new Map()
  streams_history: Map<string, string> = new Map()

  async requestDevice(source_name: string, kind: 'audio' | 'video' | 'screen', deviceId?: string): Promise<MediaStream> {
    const old_stream = this.streams.get(source_name)
    if (old_stream) {
      old_stream.getTracks().map((t) => t.stop())
      this.streams.delete(source_name)
      this.emit(ContextEvent.DeviceChanged + source_name, null)
    }

    const deviceId2 = deviceId || this.streams_history.get(source_name)
    console.warn('request device', source_name, kind, deviceId, deviceId2)

    switch (kind) {
      case 'audio': {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: deviceId2 ? { deviceId: deviceId2 } : true,
        })
        this.streams.set(source_name, stream)
        break
      }
      case 'video': {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId2 ? { deviceId: deviceId2 } : true,
        })
        this.streams.set(source_name, stream)
        break
      }
      case 'screen': {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
        this.streams.set(source_name, stream)
        break
      }
    }
    if (deviceId2) {
      this.streams_history.set(source_name, deviceId2)
    }
    const stream = this.streams.get(source_name)!
    this.emit(ContextEvent.DeviceChanged + source_name, stream)
    return stream
  }

  turnOffDevice(source_name: string) {
    const old_stream = this.streams.get(source_name)
    if (old_stream) {
      old_stream.getTracks().map((t) => t.stop())
      this.streams.delete(source_name)
      this.emit(ContextEvent.DeviceChanged + source_name, null)
    }
  }
}

export const MediaContext = createContext<Context>({} as any)
