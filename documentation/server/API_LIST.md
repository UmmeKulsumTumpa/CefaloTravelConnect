# API Endpoints

This document lists all API endpoints grouped by feature.

---

### user.router.ts
- `POST   /` — Signup
- `POST   /login` — Login
- `POST   /logout` — Logout
- `POST   /refresh` — Refresh token
- `GET    /` — Get users
- `PATCH  /:id` — Update user
- `PATCH  /:id/password` — Change password
- `PATCH  /:id/role` — Change user role
- `DELETE /:id` — Delete user

### post.router.ts
- `POST   /` — Create post
- `GET    /` — Get all posts
- `GET    /:id` — Get post by ID
- `PATCH  /:id` — Update post
- `DELETE /:id` — Delete post
- `POST   /:id/like` — Like post
- `/:postId/services` — Post services (see post.service.router.ts)
- `/:postId/images` — Post images (see post.image.router.ts)

### post.service.router.ts
- `POST   /` — Add service to post
- `GET    /` — Get services for post
- `DELETE /:postServiceId` — Delete service from post

### post.image.router.ts
- `POST   /` — Add image to post
- `GET    /` — Get images for post
- `DELETE /:imageId` — Delete image from post

### travelplan.router.ts
- `POST   /` — Create travel plan
- `GET    /` — Get all travel plans
- `GET    /:plan_id` — Get travel plan by ID
- `PATCH  /:plan_id` — Update travel plan
- `DELETE /:plan_id` — Delete travel plan
- `POST   /:plan_id/comments` — Add comment to plan
- `GET    /:plan_id/comments` — Get comments for plan
- `/:plan_id/participants` — Plan participants (see plan.participant.router.ts)
- `/:plan_id/places` — Plan places (see travelplan.place.router.ts)
- `/:plan_id/services` — Plan services (see travelplan.service.router.ts)

### plan.participant.router.ts
- `POST   /` — Add plan participant
- `GET    /` — Get plan participants
- `PATCH  /:user_id` — Update plan participant
- `DELETE /:user_id` — Delete plan participant

### travelplan.place.router.ts
- `POST   /` — Add planned place
- `GET    /` — Get planned places

### travelplan.service.router.ts
- `POST   /` — Add plan service
- `GET    /` — Get plan services
- `PATCH  /:service_id` — Update plan service
- `DELETE /:service_id` — Delete plan service

### service.router.ts
- `POST   /` — Create service
- `GET    /` — Get all services
- `GET    /nearby` — Find nearby services
- `GET    /:id` — Get service by ID
- `PATCH  /:id` — Update service
- `DELETE /:id` — Delete service

### wishlist.router.ts
- `POST   /` — Create wishlist
- `GET    /` — Get all wishlists
- `PATCH  /:id` — Update wishlist
- `DELETE /:id` — Delete wishlist

### notification.router.ts
- `POST   /` — Create notification
- `GET    /user/:userId` — Get notifications for user
- `PATCH  /:notificationId/read` — Mark notification as read
- `DELETE /:notificationId` — Delete notification

### place.router.ts
- `POST   /` — Create place
- `GET    /` — Get all places
- `GET    /:place_id` — Get place by ID
- `PATCH  /:place_id` — Update place
- `DELETE /:place_id` — Delete place
