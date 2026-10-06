const TECHNICAL_ERROR_PATTERNS = [
  /failed to fetch/i,
  /networkerror/i,
  /entitymanager/i,
  /hibernate/i,
  /hikaripool/i,
  /sql/i,
  /jdbc/i,
  /jpa/i,
  /razorpayexception/i,
  /nullpointerexception/i,
  /illegalstateexception/i,
  /stacktrace/i,
  /unexpected token/i,
];

export function getUserFacingError(
  error,
  fallback = "Something went wrong. Please try again."
) {
  const message = typeof error === "string" ? error : error?.message;

  if (
    !message ||
    TECHNICAL_ERROR_PATTERNS.some((pattern) => pattern.test(message))
  ) {
    return fallback;
  }

  return message;
}
