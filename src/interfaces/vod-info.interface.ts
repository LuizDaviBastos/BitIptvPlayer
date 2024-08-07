export interface IVodInfo {
    info: Info
    movie_data: MovieData
  }
  
  export interface Info {
    duration_secs: number
    duration: string
    video: Video
    audio: Audio
    bitrate: number
    kinopoisk_url: string
    name: string
    o_name: string
    cover_big: string
    movie_image: string
    releasedate: string
    episode_run_time: number
    youtube_trailer: string
    director: string
    actors: string
    cast: string
    description: string
    plot: string
    age: string
    rating_mpaa: string
    rating_count_kinopoisk: number
    country: string
    genre: string
    backdrop_path: string[]
    tmdb_id: string
    rating: string
  }
  
  export interface Video {
    index: number
    codec_name: string
    codec_long_name: string
    profile: string
    codec_type: string
    codec_time_base: string
    codec_tag_string: string
    codec_tag: string
    width: number
    height: number
    coded_width: number
    coded_height: number
    has_b_frames: number
    sample_aspect_ratio: string
    display_aspect_ratio: string
    pix_fmt: string
    level: number
    chroma_location: string
    refs: number
    is_avc: string
    nal_length_size: string
    r_frame_rate: string
    avg_frame_rate: string
    time_base: string
    start_pts: number
    start_time: string
    duration_ts: number
    duration: string
    bit_rate: string
    bits_per_raw_sample: string
    nb_frames: string
    disposition: Disposition
    tags: Tags
  }
  
  export interface Disposition {
    default: number
    dub: number
    original: number
    comment: number
    lyrics: number
    karaoke: number
    forced: number
    hearing_impaired: number
    visual_impaired: number
    clean_effects: number
    attached_pic: number
    timed_thumbnails: number
  }
  
  export interface Tags {
    language: string
    handler_name: string
  }
  
  export interface Audio {
    index: number
    codec_name: string
    codec_long_name: string
    profile: string
    codec_type: string
    codec_time_base: string
    codec_tag_string: string
    codec_tag: string
    sample_fmt: string
    sample_rate: string
    channels: number
    channel_layout: string
    bits_per_sample: number
    r_frame_rate: string
    avg_frame_rate: string
    time_base: string
    start_pts: number
    start_time: string
    duration_ts: number
    duration: string
    bit_rate: string
    max_bit_rate: string
    nb_frames: string
    disposition: Disposition2
    tags: Tags2
  }
  
  export interface Disposition2 {
    default: number
    dub: number
    original: number
    comment: number
    lyrics: number
    karaoke: number
    forced: number
    hearing_impaired: number
    visual_impaired: number
    clean_effects: number
    attached_pic: number
    timed_thumbnails: number
  }
  
  export interface Tags2 {
    language: string
    handler_name: string
  }
  
  export interface MovieData {
    stream_id: number
    name: string
    added: string
    category_id: string
    container_extension: string
    custom_sid: string
    direct_source: string
  }
  