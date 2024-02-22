const databaseErrorMessages: Record<string, TeenyErrorMessage> = {
  'storage/unknown': {
    name: 'UnknownError',
    message: 'Looks like you just found a bug, please contact us',
    severity: 'severe'
  },
  'storage/object-not-found': {
    name: 'ObjectNotFoundError',
    message: "We couldn't find the item you're looking for",
    severity: 'warning'
  },
  'storage/quota-exceeded': {
    name: 'QuotaExceededError',
    message: "We're currently receiving a lot of traffic, please try again later",
    severity: 'warning'
  },
  'storage/unauthenticated': {
    name: 'AuthenticationError',
    message: "Oops you're actually logged out",
    severity: 'warning'
  },
  'storage/unauthorized': {
    name: 'AuthorizationError',
    message: "You don't have access to do that",
    severity: 'error'
  },
  'storage/retry-limit-exceeded': {
    name: 'RequestTimeoutError',
    message: 'TIt looks like the network may be a bit slow',
    severity: 'warning'
  },
  'storage/server-file-wrong-size': {
    name: 'FileSizeMismatchError',
    message: "The file you're trying to upload is too large",
    severity: 'warning'
  }
}

const firestoreErrorMessages: Record<string, TeenyErrorMessage> = {
  unknown: { name: 'UnknownError', message: '', severity: 'error' },
  'deadline-exceeded': {
    name: 'RequestTimeoutError',
    message: 'It looks like the network may be a bit slow',
    severity: 'error'
  },
  'not-found': {
    name: 'ObjectNotFoundError',
    message: "We couldn't find the item you're looking for",
    severity: 'warning'
  },
  'already-exists': {
    name: 'ResourceConflictError',
    message: 'It seems like this item already exists, please try again',
    severity: 'error'
  },
  'permission-denied': {
    name: 'AuthorizationError',
    message: "You don't have access to do that",
    severity: 'error'
  },
  'resource-exhausted': {
    name: 'ResourceLimitError',
    message:
      'Not enough space left on this account. Please upgrade your plan to access more storage',
    severity: 'warning'
  },
  'failed-precondition': {
    name: 'TemporaryServerError',
    message: 'Looks like something went wrong on our end. Please try again later',
    severity: 'error'
  },
  aborted: { name: 'GenericFirestoreError', message: 'race condition', severity: 'info' },
  internal: {
    name: 'BackendUnavailableError',
    message: 'Looks like something went wrong on our end. Please try again later',
    severity: 'severe'
  },
  unavailable: { name: 'BackendUnavailableError', message: 'backend is down', severity: 'error' },
  'data-loss': { name: 'DataLossError', message: 'some data was lost', severity: 'severe' },
  unauthenticated: {
    name: 'AuthenticationError',
    message: "Oops you're actually logged out",
    severity: 'warning'
  },
  'invalid-argument': {
    name: 'OtherError',
    message: 'Looks like you just found a bug, please contact us',
    severity: 'severe'
  }
}

const firebaseErrorMessages: Record<string, TeenyErrorMessage> = {
  ...databaseErrorMessages,
  ...firestoreErrorMessages
}

export default firebaseErrorMessages
