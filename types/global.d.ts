declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[]
      preload?: boolean
      autoplay?: boolean
      loop?: boolean
      volume?: number
    })

    play(): void
    pause(): void
    stop(): void
    seek(): number
    duration(): number
    playing(): boolean
    volume(volume: number): void
    on(event: string, callback: () => void): void
    once(event: string, callback: () => void): void
  }

  export class Howler {
    static mute(muted: boolean): void
    static volume(volume: number): void
    static autoUnlock: boolean
  }
}
