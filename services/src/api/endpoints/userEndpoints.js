const userEndpoints = {
  getUsers: "/users?populate=*",
  getUserById: (id) => `/users/${id}`,
  createUser: "/users",
  updateUser: (id) => `/users/${id}`,
  deleteUser: (id) => `/users/${id}`,
  getUserByUsername: (username) => `/users?filters[username][$eq]=${username}`,
  getUserByEmail: (email) => `/users?filters[email][$eq]=${email}`,
};

export default userEndpoints;