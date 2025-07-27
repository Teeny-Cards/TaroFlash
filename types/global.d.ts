declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[]
      preload?: boolean
      autoplay?: boolean
      loop?: boolean
      volume?: number
      onload?: () => void
    })
    play(): void
    pause(): void
    stop(): void
    seek(): number
    duration(): number
    playing(): boolean
    volume(volume: number): void
  }

  export class Howler {
    static mute(muted: boolean): void
    static volume(volume: number): void
    static autoUnlock: boolean
  }
}
