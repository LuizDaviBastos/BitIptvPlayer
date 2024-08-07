export interface IAuthInfo {
    user_info: IUserInfo
    server_info: IServerInfo
  }
  
  export interface IUserInfo {
    username: string
    password: string
    message: string
    auth: number
    status: string
    exp_date: string
    is_trial: string
    active_cons: string
    created_at: string
    max_connections: string
    allowed_output_formats: string[]
  }
  
  export interface IServerInfo {
    url: string
    port: string
    https_port: string
    server_protocol: string
    rtmp_port: any
    timezone: string
    timestamp_now: number
    time_now: string
  }
  