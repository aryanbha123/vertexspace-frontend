// ========================================
// API ROUTES - Workspace Management System
// Each route is documented with HTTP method
// ========================================


// =====================================================
// AUTH ROUTES
// =====================================================

export const USER_ROUTES = {
  REGISTER_USER: "/api/auth/register", 
  // POST

  LOGIN_USER: "/api/auth/login", 
  // POST

  GET_ME: "/api/auth/me", 
  // GET

  LOGOUT: "/api/auth/logout", 
  // POST

  GET_ALL_USERS: "/api/users",
  // GET
};


// =====================================================
// DEPARTMENT ROUTES
// =====================================================

export const DEPARTMENT_ROUTES = {
  GET_ALL_DEPARTMENTS: "/api/departments", 
  // GET

  GET_ACTIVE_DEPARTMENTS: "/api/departments/active", 
  // GET

  GET_DEPARTMENT_BY_ID: (id: number) => 
    `/api/departments/${id}`, 
  // GET

  CREATE_DEPARTMENT: "/api/departments", 
  // POST

  UPDATE_DEPARTMENT: (id: number) => 
    `/api/departments/${id}`, 
  // PUT

  DELETE_DEPARTMENT: (id: number) => 
    `/api/departments/${id}`, 
  // DELETE (soft delete)

  HARD_DELETE_DEPARTMENT: (id: number) => 
    `/api/departments/${id}/hard`, 
  // DELETE (hard delete)
};


// =====================================================
// BUILDING ROUTES
// =====================================================

export const BUILDING_ROUTES = {
  GET_ALL_BUILDINGS: "/api/buildings", 
  // GET

  GET_ACTIVE_BUILDINGS: "/api/buildings/active", 
  // GET

  GET_BUILDING_BY_ID: (id: number) => 
    `/api/buildings/${id}`, 
  // GET

  CREATE_BUILDING: "/api/buildings", 
  // POST

  UPDATE_BUILDING: (id: number) => 
    `/api/buildings/${id}`, 
  // PUT

  DELETE_BUILDING: (id: number) => 
    `/api/buildings/${id}`, 
  // DELETE (soft delete)

  HARD_DELETE_BUILDING: (id: number) => 
    `/api/buildings/${id}/hard`, 
  // DELETE (hard delete)
};


// =====================================================
// FLOOR ROUTES
// =====================================================

export const FLOOR_ROUTES = {
  GET_ALL_FLOORS: "/api/floors", 
  // GET

  GET_FLOOR_BY_ID: (id: number) => 
    `/api/floors/${id}`, 
  // GET

  CREATE_FLOOR: "/api/floors", 
  // POST

  UPDATE_FLOOR: (id: number) => 
    `/api/floors/${id}`, 
  // PUT

  DELETE_FLOOR: (id: number) => 
    `/api/floors/${id}`, 
  // DELETE (soft delete)

  HARD_DELETE_FLOOR: (id: number) => 
    `/api/floors/${id}/hard`, 
  // DELETE (hard delete)

  GET_FLOORS_BY_BUILDING: (buildingId: number) =>
    `/api/floors/building/${buildingId}`, 
  // GET

  GET_ACTIVE_FLOORS_BY_BUILDING: (buildingId: number) =>
    `/api/floors/building/${buildingId}/active`, 
  // GET
};


// =====================================================
// RESOURCE ROUTES
// =====================================================

export const RESOURCE_ROUTES = {
  GET_ALL_RESOURCES: "/api/resources", 
  // GET

  GET_RESOURCE_BY_ID: (id: number) => 
    `/api/resources/${id}`, 
  // GET

  CREATE_RESOURCE: "/api/resources", 
  // POST

  UPDATE_RESOURCE: (id: number) => 
    `/api/resources/${id}`, 
  // PUT

  DELETE_RESOURCE: (id: number) => 
    `/api/resources/${id}`, 
  // DELETE (soft delete)

  HARD_DELETE_RESOURCE: (id: number) => 
    `/api/resources/${id}/hard`, 
  // DELETE (hard delete)


  // ---------------------------------------
  // FILTER & QUERY ROUTES
  // ---------------------------------------

  GET_RESOURCES_BY_TYPE: (
    type: "ROOM" | "DESK" | "PARKING"
  ) => `/api/resources/type/${type}`, 
  // GET

  GET_RESOURCES_BY_FLOOR: (floorId: number) =>
    `/api/resources/floor/${floorId}`, 
  // GET

  GET_RESOURCES_BY_BUILDING: (buildingId: number) =>
    `/api/resources/building/${buildingId}`, 
  // GET

  GET_RESOURCES_BY_DEPARTMENT: (departmentId: number) =>
    `/api/resources/department/${departmentId}`, 
  // GET

  GET_BOOKABLE_RESOURCES: "/api/resources/bookable", 
  // GET

  GET_ASSIGNABLE_DESKS: "/api/resources/desks/assignable", 
  // GET

  GET_ASSIGNABLE_DESKS_BY_DEPARTMENT: (departmentId: number) =>
    `/api/resources/desks/assignable/department/${departmentId}`, 
  // GET


  // ---------------------------------------
  // BUSINESS LOGIC (PATCH)
  // ---------------------------------------

  CHANGE_ROOM_BOOKING_TYPE: (
    roomId: number,
    newBookingType: "EXCLUSIVE" | "SHARED"
  ) =>
    `/api/resources/rooms/${roomId}/booking-type?newBookingType=${newBookingType}`, 
  // PATCH

  CHANGE_DESK_MODE: (
    deskId: number,
    newMode: "ASSIGNED" | "HOT_DESK"
  ) =>
    `/api/resources/desks/${deskId}/mode?newMode=${newMode}`, 
  // PATCH
};


// =====================================================
// DESK ASSIGNMENT ROUTES
// =====================================================

export const DESK_ASSIGNMENT_ROUTES = {
  GET_ALL_ASSIGNMENTS: "/api/desk-assignments",
  // GET

  GET_ASSIGNMENT_BY_ID: (id: number) => 
    `/api/desk-assignments/${id}`,
  // GET

  CREATE_ASSIGNMENT: "/api/desk-assignments",
  // POST

  UPDATE_ASSIGNMENT: (id: number) => 
    `/api/desk-assignments/${id}`,
  // PUT

  DELETE_ASSIGNMENT: (id: number) => 
    `/api/desk-assignments/${id}`,
  // DELETE

  GET_ASSIGNMENTS_BY_DEPARTMENT: (departmentId: number) =>
    `/api/desk-assignments/department/${departmentId}`,
  // GET

  GET_ASSIGNMENTS_BY_USER: (userId: number) =>
    `/api/desk-assignments/user/${userId}`,
  // GET

  GET_ASSIGNMENTS_BY_DESK: (deskId: number) =>
    `/api/desk-assignments/desk/${deskId}`,
  // GET
};


// =====================================================
// WAITLIST ROUTES
// =====================================================

export const WAITLIST_ROUTES = {
  GET_ALL_ENTRIES: "/api/waitlist",
  // GET

  JOIN_WAITLIST: "/api/waitlist/join",
  // POST

  LEAVE_WAITLIST: (id: number) => 
    `/api/waitlist/leave/${id}`,
  // POST/DELETE

  GET_MY_ENTRIES: "/api/waitlist/my",
  // GET

  GET_OFFERS: "/api/waitlist/offers",
  // GET

  ACCEPT_OFFER: (id: number) => 
    `/api/waitlist/offers/${id}/accept`,
  // POST

  DECLINE_OFFER: (id: number) => 
    `/api/waitlist/offers/${id}/decline`,
  // POST
};


// =====================================================
// BOOKING ROUTES
// =====================================================

export const BOOKING_ROUTES = {
  GET_ALL_BOOKINGS: "/api/bookings",
  // GET

  GET_BOOKING_BY_ID: (id: number) => 
    `/api/bookings/${id}`,
  // GET

  CREATE_BOOKING: "/api/bookings",
  // POST

  CANCEL_BOOKING: (id: number) => 
    `/api/bookings/${id}/cancel`,
  // POST/PATCH

  GET_MY_BOOKINGS: "/api/bookings/my",
  // GET

  GET_BOOKINGS_BY_RESOURCE: (resourceId: number) =>
    `/api/bookings/resource/${resourceId}`,
  // GET

  GET_BOOKINGS_BY_USER: (userId: number) =>
    `/api/bookings/user/${userId}`,
  // GET

  GET_BOOKINGS_BY_RANGE: (start: string, end: string) =>
    `/api/bookings/range?start=${start}&end=${end}`,
  // GET

  GET_BEST_SLOTS: "/api/bookings/best-slots",
  // POST (Input: date, duration, resourceCriteria)
};