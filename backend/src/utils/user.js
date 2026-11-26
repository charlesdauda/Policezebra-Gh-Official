// The only user fields that are ever sent to the browser.
// Never send passwordHash or anything else from the database row.
export function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  };
}