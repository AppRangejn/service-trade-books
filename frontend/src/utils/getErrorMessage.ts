interface ErrorWithData {
  data?: {
    message?: string;
    errors?: string[];
  };
  error?: string;
  message?: string;
}

export const getErrorMessage = (
  error: unknown,
  fallback = 'An unexpected error occurred',
): string => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const err = error as ErrorWithData;

  if (err.data?.errors && err.data.errors.length > 0) {
    return err.data.errors.join(', ');
  }

  if (err.data?.message) {
    return err.data.message;
  }

  if (err.error) {
    return err.error;
  }

  if (err.message) {
    return err.message;
  }

  return fallback;
};
