import { isValidDate, isValidEmail } from "../../utils/validation.js";

export async function validatePatientDataMiddleware(req, res, next) {
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

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    return res
      .status(400)
      .json({ message: "The 'firstName' field is required and must be a non-empty string." });
  }

  if (lastName !== undefined && lastName !== null && typeof lastName !== "string") {
    return res.status(400).json({ message: "The 'lastName' field must be a string." });
  }

  if (email !== undefined && email !== null) {
    try {
      isValidEmail(email);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  if (dateOfBirth !== undefined && dateOfBirth !== null) {
    try {
      isValidDate(dateOfBirth);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  if (phoneNumber !== undefined && phoneNumber !== null && typeof phoneNumber !== "string") {
    return res.status(400).json({ message: "The 'phoneNumber' field must be a string." });
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    return res.status(400).json({ message: "The 'description' field must be a string." });
  }

  if (problem !== undefined && problem !== null && typeof problem !== "string") {
    return res.status(400).json({ message: "The 'problem' field must be a string." });
  }

  if (condition !== undefined && condition !== null && typeof condition !== "string") {
    return res.status(400).json({ message: "The 'condition' field must be a string." });
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
  if (patientConditionStatus !== undefined && patientConditionStatus !== null) {
    if (
      typeof patientConditionStatus !== "string" ||
      !allowedStatuses.includes(patientConditionStatus)
    ) {
      return res.status(400).json({
        message: "The 'patientConditionStatus' field must be a valid status string.",
      });
    }
  }

  if (
    problemDescription !== undefined &&
    problemDescription !== null &&
    typeof problemDescription !== "string"
  ) {
    return res.status(400).json({ message: "The 'problemDescription' field must be a string." });
  }

  if (quantityOfVisits !== undefined && quantityOfVisits !== null) {
    if (typeof quantityOfVisits !== "number" || quantityOfVisits < 0) {
      return res
        .status(400)
        .json({ message: "The 'quantityOfVisits' field must be a non-negative number." });
    }
  }

  if (summary !== undefined && summary !== null && typeof summary !== "string") {
    return res.status(400).json({ message: "The 'summary' field must be a string." });
  }

  next();
}
