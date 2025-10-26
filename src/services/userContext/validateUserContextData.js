export const validateUserContextData = (data) => {
  const errors = [];

  if (data.firstName !== undefined) {
    if (typeof data.firstName !== "string") {
      errors.push("firstName must be a string");
    } else if (data.firstName.length > 50) {
      errors.push("firstName cannot exceed 50 characters");
    }
  }

  if (data.lastName !== undefined) {
    if (typeof data.lastName !== "string") {
      errors.push("lastName must be a string");
    } else if (data.lastName.length > 50) {
      errors.push("lastName cannot exceed 50 characters");
    }
  }

  if (data.interests !== undefined) {
    if (!Array.isArray(data.interests)) {
      errors.push("interests must be an array of strings");
    } else {
      const invalidInterests = data.interests.filter((item) => typeof item !== "string");
      if (invalidInterests.length > 0) {
        errors.push("all interests must be strings");
      }
      if (data.interests.length > 20) {
        errors.push("interests cannot exceed 20 items");
      }
    }
  }

  if (data.longTermGoals !== undefined) {
    if (!Array.isArray(data.longTermGoals)) {
      errors.push("longTermGoals must be an array of strings");
    } else {
      const invalidGoals = data.longTermGoals.filter((item) => typeof item !== "string");
      if (invalidGoals.length > 0) {
        errors.push("all longTermGoals must be strings");
      }
      if (data.longTermGoals.length > 10) {
        errors.push("longTermGoals cannot exceed 10 items");
      }
    }
  }

  if (data.recentIssues !== undefined) {
    if (!Array.isArray(data.recentIssues)) {
      errors.push("recentIssues must be an array of strings");
    } else {
      const invalidIssues = data.recentIssues.filter((item) => typeof item !== "string");
      if (invalidIssues.length > 0) {
        errors.push("all recentIssues must be strings");
      }
      if (data.recentIssues.length > 15) {
        errors.push("recentIssues cannot exceed 15 items");
      }
    }
  }

  if (data.chatResponsePreferences !== undefined) {
    if (typeof data.chatResponsePreferences !== "string") {
      errors.push("chatResponsePreferences must be a string");
    } else if (data.chatResponsePreferences.length > 500) {
      errors.push("chatResponsePreferences cannot exceed 500 characters");
    }
  }

  if (data.otherImportantInfo !== undefined) {
    if (typeof data.otherImportantInfo !== "string") {
      errors.push("otherImportantInfo must be a string");
    } else if (data.otherImportantInfo.length > 1000) {
      errors.push("otherImportantInfo cannot exceed 1000 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    data: data,
  };
};
