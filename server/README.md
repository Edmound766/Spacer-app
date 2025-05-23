Sure! Here's the reformatted version of the backend endpoints and models for your "Spacer" app:

---

## 🔐 **Auth Endpoints**  
**Blueprint**: `auth`

- `POST /auth/register` — Register user with email/password  
- `POST /auth/login` — Local login  
- `POST /auth/social-login` — Social auth (e.g., Google, Facebook)  
- `GET /auth/logout` — Logout user  
- `GET /auth/me` — Get current authenticated user info  

---

## 🛠️ **Admin Endpoints**  
**Blueprint**: `admin`

### 📍 **Spaces Management**
- `POST /admin/spaces` — Add a new space  
- `GET /admin/spaces` — View all spaces  
- `GET /admin/spaces/<space_id>` — Get full details of a space  
- `PUT /admin/spaces/<space_id>` — Edit a space  
- `DELETE /admin/spaces/<space_id>` — Delete a space  

### 👤 **User Management**
- `POST /admin/users` — Add user (with role)  
- `GET /admin/users` — View all users  
- `GET /admin/users/<user_id>` — Get user details  
- `PUT /admin/users/<user_id>` — Edit user info  
- `DELETE /admin/users/<user_id>` — Remove user  

---

## 🧑‍💻 **Client/User Endpoints**  
**Blueprint**: `client`

- `GET /spaces` — List all available spaces  
- `GET /spaces/<space_id>` — Get more details about a space  
- `GET /my-bookings` — View user’s past & current bookings  

---

## 📅 **Booking Endpoints**  
**Blueprint**: `booking`

- `POST /bookings` — Create a booking for a space (includes duration)  
- `GET /bookings/<booking_id>` — View a specific booking  
- `PUT /bookings/<booking_id>/cancel` — Cancel booking (if allowed)  
- `PUT /bookings/<booking_id>/complete` — Mark booking as completed  
- `GET /spaces/<space_id>/availability` — Check space availability  

---

## 💳 **Payment & Billing Endpoints**  
**Blueprint**: `payments`

- `POST /payments/initiate` — Simulate a payment process  
- `POST /payments/verify` — Verify simulated payment  
- `GET /payments/invoices/<booking_id>` — Get invoice for a booking  

---

## 📄 **Agreement/Contract Endpoints**  
**Blueprint**: `agreements`

- `POST /agreements` — Create simulated agreement for a booking  
- `GET /agreements/<booking_id>` — View agreement for a specific booking  

---

### Optional: 📊 **Analytics / Admin Dashboard**  
**Blueprint**: `dashboard`

- `GET /dashboard/overview` — Admin view of platform stats  
- `GET /dashboard/space-usage` — Usage stats of spaces  
- `GET /dashboard/revenue` — Simulated revenue summary  

---

## Models Overview

### **User**
- For authentication and user roles.

### **Space**
- For the spaces that can be booked.

### **Booking**
- For managing bookings, including duration and status.

### **Payment**
- For simulating payments and billing.

### **Agreement**
- For the booking agreement/contract.

### **Role**
- To manage user roles and permissions.

---

Let me know if you'd like any further details or adjustments!