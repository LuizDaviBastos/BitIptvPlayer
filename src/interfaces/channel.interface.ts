export interface IChannel {
    num: number
    name: string
    stream_type: string
    stream_id: number
    stream_icon: string
    epg_channel_id: string
    added: string
    category_id: string
    custom_sid: string
    tv_archive: number
    direct_source: string
    tv_archive_duration: number

    series_id: number
    cover: string
    plot: string
    cast: string
    director: string
    genre: string
    releaseDate: string
    last_modified: string
    rating: string
    rating_5based: number
    backdrop_path: string[]
    youtube_trailer: string
    episode_run_time: string
  }
  
  export interface Root {
    num: number
    name: string
    series_id: number
    cover: string
    plot: string
    cast: string
    director: string
    genre: string
    releaseDate: string
    last_modified: string
    rating: string
    rating_5based: number
    backdrop_path: string[]
    youtube_trailer: string
    episode_run_time: string
    category_id: string
  }
  