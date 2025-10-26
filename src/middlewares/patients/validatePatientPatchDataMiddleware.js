export async function validatePatientPatchDataMiddleware(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    phoneNumber,
    description,
    problem,
    condition,
    patientConditionStatus,
    problemDescription,
    quantityOfVisits,
    summary,
  } = req.body;

  if (firstName !== undefined && typeof firstName !== "string") {
    return res.status(400).json({ message: "'firstName' must be a string." });
  }

  if (lastName !== undefined && typeof lastName !== "string") {
    return res.status(400).json({ message: "'lastName' must be a string." });
  }

  if (email !== undefined) {
    try {
      isValidEmail(email);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  if (dateOfBirth !== undefined) {
    try {
      isValidDate(dateOfBirth);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  if (phoneNumber !== undefined && typeof phoneNumber !== "string") {
    return res.status(400).json({ message: "'phoneNumber' must be a string." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "'description' must be a string." });
  }

  if (problem !== undefined && typeof problem !== "string") {
    return res.status(400).json({ message: "'problem' must be a string." });
  }

  if (condition !== undefined && typeof condition !== "string") {
    return res.status(400).json({ message: "'condition' must be a string." });
  }

  const allowedStatuses = [
    "normal",
    "stable",
    "in_danger",
    "suicidal",
    "depressed",
    "anxious",
    "manic",
    "psychotic",
    "hospitalized",
    "under_observation",
    "undefined",
    "custom",
  ];
  if (patientConditionStatus !== undefined) {
    if (
      typeof patientConditionStatus !== "string" ||
      !allowedStatuses.includes(patientConditionStatus)
    ) {
      return res.status(400).json({ message: "'patientConditionStatus' is invalid." });
    }
  }

  if (problemDescription !== undefined && typeof problemDescription !== "string") {
    return res.status(400).json({ message: "'problemDescription' must be a string." });
  }

  if (quantityOfVisits !== undefined) {
    if (typeof quantityOfVisits !== "number" || quantityOfVisits < 0) {
      return res.status(400).json({ message: "'quantityOfVisits' must be a non-negative number." });
    }
  }

  if (summary !== undefined && typeof summary !== "string") {
    return res.status(400).json({ message: "'summary' must be a string." });
  }

  next();
}
