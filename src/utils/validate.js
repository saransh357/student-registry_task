/**
 * Validates the student form fields.
 * @param {{ name: string, email: string, age: string }} form
 * @returns {Object} errors - keyed by field name
 */
export function validateStudent(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!form.age) {
    errors.age = "Age is required";
  } else if (isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) {
    errors.age = "Age must be a number between 1 and 120";
  }

  return errors;
}
