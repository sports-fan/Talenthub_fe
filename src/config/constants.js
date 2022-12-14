export const API_BASE = process.env.REACT_APP_API_BASE || '/'

export const API_AUTH_GET_URL = 'api/auth/me/'

export const ROLES = {
  ADMIN: 1,
  TEAM_MANAGER: 2,
  DEVELOPER: 3
}

export const ROLE_OPTIONS = [
  {
    value: ROLES.ADMIN,
    label: 'Admin'
  },
  {
    value: ROLES.TEAM_MANAGER,
    label: 'Team Manager'
  },
  {
    value: ROLES.DEVELOPER,
    label: 'Developer'
  }
]

export const URL_PREFIXES = {
  [ROLES.ADMIN]: 'admin',
  [ROLES.TEAM_MANAGER]: 'team-manager',
  [ROLES.DEVELOPER]: 'developer'
}

export const PROFILE_TYPES = {
  SELF: 1,
  PARTNER: 2
}

export const GENDER = {
  MALE: 1,
  FEMALE: 2
}

export const CLIENT_TYPES = {
  INDIVIDUAL: 1,
  COMPANY: 2
}

export const CLIENT_TYPE_LABELS = {
  [CLIENT_TYPES.INDIVIDUAL]: 'Individual',
  [CLIENT_TYPES.COMPANY]: 'Company'
}

export const CONTACT_METHOD_TYPES = [
  {
    value: 'Skype',
    label: 'Skype'
  },
  {
    value: 'Whatsapp',
    label: 'Whatsapp'
  },
  {
    value: 'Discord',
    label: 'Discord'
  },
  {
    value: 'Linkedin',
    label: 'Linkedin'
  },
  {
    value: 'Facebook',
    label: 'Facebook'
  }
]

export const CLIENT_TYPE_OPTIONS = [
  {
    value: CLIENT_TYPES.COMPANY,
    label: 'Company'
  },
  {
    value: CLIENT_TYPES.INDIVIDUAL,
    label: 'Individual'
  }
]

export const PROJECT_TYPE = {
  BUDGET: 1,
  HOURLYFT: 2,
  HOURLYPT: 3,
  CONTRACT: 4
}

export const PROJECT_TYPE_LABELS = {
  [PROJECT_TYPE.BUDGET]: 'Budget',
  [PROJECT_TYPE.HOURLYFT]: 'Hourly Full-time',
  [PROJECT_TYPE.HOURLYPT]: 'Hourly Part-time',
  [PROJECT_TYPE.CONTRACT]: 'Contract'
}

export const PROJECT_TYPE_OPTIONS = [
  {
    value: PROJECT_TYPE.BUDGET,
    label: 'Budget'
  },
  {
    value: PROJECT_TYPE.HOURLYFT,
    label: 'Hourly Full-time'
  },
  {
    value: PROJECT_TYPE.HOURLYPT,
    label: 'Hourly Part-time'
  },
  {
    value: PROJECT_TYPE.CONTRACT,
    label: 'Contract'
  }
]

export const PROJECT_STATUS = {
  ONGOING: 1,
  PAUSED: 2,
  ENDED: 3
}

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.ONGOING]: 'Ongoing',
  [PROJECT_STATUS.PAUSED]: 'Paused',
  [PROJECT_STATUS.ENDED]: 'Ended'
}

export const PROJECT_STATUS_OPTIONS = [
  {
    value: PROJECT_STATUS.ONGOING,
    label: 'Ongoing'
  },
  {
    value: PROJECT_STATUS.PAUSED,
    label: 'Paused'
  },
  {
    value: PROJECT_STATUS.ENDED,
    label: 'Ended'
  }
]

export const FINANCIALREQUEST_TYPE = {
  SENDINVOICE: 1,
  SENDPAYMENT: 2,
  RECEIVEPAYMENT: 3,
  REFUNDPAYMENT: 4
}

export const FINANCIALREQUEST_TYPE_LABELS = {
  [FINANCIALREQUEST_TYPE.SENDINVOICE]: 'Send Invoice',
  [FINANCIALREQUEST_TYPE.SENDPAYMENT]: 'Send Payment',
  [FINANCIALREQUEST_TYPE.RECEIVEPAYMENT]: 'Receive Payment',
  [FINANCIALREQUEST_TYPE.REFUNDPAYMENT]: 'Refund Payment'
}

export const FINANCIALREQUEST_TYPE_OPTIONS = [
  {
    value: FINANCIALREQUEST_TYPE.SENDINVOICE,
    label: 'Send Invoice'
  },
  {
    value: FINANCIALREQUEST_TYPE.SENDPAYMENT,
    label: 'Send Payment'
  },
  {
    value: FINANCIALREQUEST_TYPE.RECEIVEPAYMENT,
    label: 'Receive Payment'
  },
  {
    value: FINANCIALREQUEST_TYPE.REFUNDPAYMENT,
    label: 'Refund Payment'
  }
]

export const FINANCIALREQUEST_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  DECLINED: 3,
  CANCELED: 4
}

export const FINANCIALREQUEST_STATUS_LABELS = {
  [FINANCIALREQUEST_STATUS.PENDING]: 'Pending',
  [FINANCIALREQUEST_STATUS.APPROVED]: 'Approved',
  [FINANCIALREQUEST_STATUS.DECLINED]: 'Declined',
  [FINANCIALREQUEST_STATUS.CANCELED]: 'Canceled'
}

export const FINANCIALREQUEST_STATUS_OPTIONS = [
  {
    value: FINANCIALREQUEST_STATUS.PENDING,
    label: 'Pending'
  },
  {
    value: FINANCIALREQUEST_STATUS.APPROVED,
    label: 'Approved'
  },
  {
    value: FINANCIALREQUEST_STATUS.DECLINED,
    label: 'Declined'
  },
  {
    value: FINANCIALREQUEST_STATUS.CANCELED,
    label: 'Canceled'
  }
]

export const FINANCIALREQUEST_COUNTER_PARTY_TYPE = {
  CLIENT: 6,
  PARTNER: 8
}

export const FINANCIALREQUEST_COUNTER_PARTY_OPTIONS = [
  {
    value: FINANCIALREQUEST_COUNTER_PARTY_TYPE.CLIENT,
    label: 'Client'
  },
  {
    value: FINANCIALREQUEST_COUNTER_PARTY_TYPE.PARTNER,
    label: 'Partner'
  }
]

export const PAYMENT_PLATFORMS = {
  payapl: 'PayPal',
  payoneer: 'Payoneer',
  upwork: 'Upwork',
  freelancer: 'Freelancer',
  toptal: 'Toptal',
  binance: 'Binance',
  metamask: 'MetaMask',
  usdc: 'USDC',
  usdt: 'USDT'
}

export const PAYMENT_PLATFORM_TYPE = {
  PAYPAL: 'paypal',
  PAYONEER: 'payoneer',
  UPWORK: 'upwork',
  FREELANCER: 'freelancer',
  TOPTAL: 'toptal',
  BINANCE: 'binance',
  METAMASK: 'metamask',
  BANK: 'bank',
  USDC: 'usdc',
  USDT: 'usdt'
}

export const PAYMENT_PLATFORM_OPTIONS = [
  {
    value: PAYMENT_PLATFORM_TYPE.PAYPAL,
    label: 'Paypal'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.PAYONEER,
    label: 'Payoneer'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.UPWORK,
    label: 'Upwork'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.FREELANCER,
    label: 'Freelancer'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.TOPTAL,
    label: 'Toptal'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.BINANCE,
    label: 'Binance'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.METAMASK,
    label: 'MetaMask'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.BANK,
    label: 'Bank'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.USDC,
    label: 'USDC'
  },
  {
    value: PAYMENT_PLATFORM_TYPE.USDT,
    label: 'USDT'
  }
]

export const profileTypeOptions = [
  {
    label: 'Self',
    value: PROFILE_TYPES.SELF
  },
  {
    label: 'Partner',
    value: PROFILE_TYPES.PARTNER
  }
]

export const genderOptions = [
  {
    label: 'Male',
    value: GENDER.MALE
  },
  {
    label: 'Female',
    value: GENDER.FEMALE
  }
]

export const profile_type_patterns = [
  {
    id: 0,
    role: null,
    color: ''
  },
  {
    id: PROFILE_TYPES.SELF,
    type: 'Self',
    color: 'success'
  },
  {
    id: PROFILE_TYPES.PARTNER,
    type: 'Partner',
    color: 'info'
  }
]

export const gender_patterns = {
  [GENDER.MALE]: 'Male',
  [GENDER.FEMALE]: 'Female'
}

export const periodOptions = [
  {
    value: 'this-week',
    label: 'This Week'
  },
  {
    value: 'this-month',
    label: 'This Month'
  },
  {
    value: 'this-quarter',
    label: 'This Quarter'
  },
  {
    value: 'custom',
    label: 'Custom'
  }
]

export const PAYMENT_PERIODS = {
  WEEKLY: 1,
  BI_WEEKLY: 2,
  MONTHLY: 3
}

export const PAYMENT_PERIOD_OPTIONS = [
  {
    value: PAYMENT_PERIODS.WEEKLY,
    label: 'Weekly'
  },
  {
    value: PAYMENT_PERIODS.BI_WEEKLY,
    label: 'Bi-Weekly'
  },
  {
    value: PAYMENT_PERIODS.MONTHLY,
    label: 'Monthly'
  }
]

export const LOG_OPTIONS = [
  {
    value: 'daily',
    label: 'Daily'
  },
  {
    value: 'weekly',
    label: 'Weekly'
  },
  {
    value: 'monthly',
    label: 'Monthly'
  }
]

export const INTERVALS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const NOTIFICATION_CONFIG = {
  finance_financialrequest: {
    title: 'Financial Request',
    objectName: 'financial request',
    path: 'financial-requests'
  },
  finance_project: {
    title: 'Project',
    objectName: 'project',
    path: 'projects'
  },
  reporting_log_daily: {
    title: 'Daily Log',
    objectName: 'daily log',
    path: 'logging/daily'
  },
  reporting_log_weekly: {
    title: 'Weekly Log',
    objectName: 'weely log',
    path: 'logging/weekly'
  },
  reporting_log_monthly: {
    title: 'Monthly Log',
    objectName: 'monthly log',
    path: 'logging/monthly'
  }
}

export const NOTIFICATION_PING_DELAY = 5000
export const SNACKBAR_TOUCHED = 'TH_SNACKBAR_TOUCHED'
export const NOTIFICATION_IDS = 'TH_NOTIFICATION_IDS'
export const TOKEN = 'TH_TOKEN'
