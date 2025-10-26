export const isValidDate = (dateInput) => {
  if (typeof dateInput !== "string") {
    throw new Error("The 'dateOfBirth' field must be a string");
  }

  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoRegex.test(dateInput)) {
    throw new Error("Date must be in format YYYY-MM-DD");
  }

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }

  return date;
};

export const isValidEmail = (email) => {
  if (typeof email !== "string") {
    throw new Error("Email must be a string");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  return true;
};
