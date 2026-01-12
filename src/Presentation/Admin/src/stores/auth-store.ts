import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'admin_access_token'
const REFRESH_TOKEN = 'admin_refresh_token'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    refreshToken: string
    setRefreshToken: (refreshToken: string) => void
    resetRefreshToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieAccessToken = getCookie(ACCESS_TOKEN)
  const cookieRefreshToken = getCookie(REFRESH_TOKEN)
  const initAccessToken = cookieAccessToken ? JSON.parse(cookieAccessToken) : ''
  const initRefreshToken = cookieRefreshToken ? JSON.parse(cookieRefreshToken) : ''

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initAccessToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      refreshToken: initRefreshToken,
      setRefreshToken: (refreshToken) =>
        set((state) => {
          setCookie(REFRESH_TOKEN, JSON.stringify(refreshToken))
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      resetRefreshToken: () =>
        set((state) => {
          removeCookie(REFRESH_TOKEN)
          return { ...state, auth: { ...state.auth, refreshToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
          }
        }),
    },
  }
})
