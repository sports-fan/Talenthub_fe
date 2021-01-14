export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/'

export const ROLES = {
  ADMIN: 1,
  TEAM_MANAGER: 2,
  DEVELOPER: 3
}

export const URL_PREFIXES = {
	[ROLES.ADMIN]: 'admin',
	[ROLES.TEAM_MANAGER]: 'team-manager',
	[ROLES.DEVELOPER]: 'developer',
}

export const PROFILE_TYPES = {
  SELF: 1,
  PARTNER: 2
}

export const GENDER = {
  MALE: 1,
  FEMALE: 2
}