
// Enums
Enum UserRole {
  Traveler
  Explorer
  Admin
}

Enum EffortLevel {
  Low
  Medium
  High
}

Enum Visibility {
  Public
  Private
  Friends
}

Enum DestStatus {
  Planned
  Travelled
  Cancelled
}

Enum ServiceType {
  Hotel
  Restaurant
  Attraction
  Transport
}

Enum TransportMode {
  Flight
  Car
  Rental
  Bus
  Train
  Boat
}

// Tables
Table users {
  user_id uuid [pk]
  username varchar(50) [not null, unique]
  email varchar(100) [not null, unique]
  password varchar(255) [not null]
  role UserRole [not null]
  created_at timestamp [default: `now()`]
}

Table posts {
  post_id uuid [pk]
  user_id uuid [not null, ref: > users.user_id]
  title varchar(255) [not null]
  total_cost decimal(10,2)
  total_duration int
  effort_level EffortLevel
  destination_id uuid [ref: > destinations.destination_id]
  categories varchar(255) []
  visibility Visibility [default: 'Public']
  created_at timestamp [default: `now()`]
}

Table wishlists {
  wishlist_id uuid [pk]
  user_id uuid [not null, ref: > users.user_id]
  name varchar(255) [not null]
  region varchar(100)
  theme varchar(100)
  is_public boolean [default: false]
  created_at timestamp [default: `now()`]
}

Table destinations {
  destination_id uuid [pk]
  wishlist_id uuid [not null, ref: > wishlists.wishlist_id]
  name varchar(255) [not null]
  latitude decimal(10,6) [not null]
  longitude decimal(10,6) [not null]
  address text
  notes text
  status DestStatus [default: 'Planned']
  created_at timestamp [default: `now()`]
}

Table trip_plans {
  plan_id uuid [pk]
  name varchar(255) [not null]
  start_date date
  end_date date
  created_at timestamp [default: `now()`]
}

Table services {
  service_id uuid [pk]
  name varchar(255) [not null]
  type ServiceType [not null]
  latitude decimal(10,6) [not null]
  longitude decimal(10,6) [not null]
  address text
  description text
  created_at timestamp [default: `now()`]
}

Table transports {
  transport_id uuid [pk]
  name varchar(255) [not null]
  mode TransportMode [not null]
  latitude_from decimal(10,6) [not null]
  longitude_from decimal(10,6) [not null]
  address_from text
  latitude_to decimal(10,6) [not null]
  longitude_to decimal(10,6) [not null]
  address_to text
  operator varchar(100)
  description text
  created_at timestamp [default: `now()`]
}

Table post_services {
  post_service_id uuid [pk]
  post_id uuid [not null, ref: > posts.post_id]
  service_id uuid [not null, ref: > services.service_id]
  cost decimal(10,2)
  rating float
  visit_date date
  notes text
  created_at timestamp [default: `now()`]
}

Table post_transports {
  post_transport_id uuid [pk]
  post_id uuid [not null, ref: > posts.post_id]
  transport_id uuid [not null, ref: > transports.transport_id]
  cost decimal(10,2)
  rating float
  departure_time timestamp
  arrival_time timestamp
  notes text
  created_at timestamp [default: `now()`]
}

Table plan_services {
  plan_service_id uuid [pk]
  plan_id uuid [not null, ref: > trip_plans.plan_id]
  service_id uuid [not null, ref: > services.service_id]
  estimated_cost decimal(10,2)
  planned_visit_date date
  notes text
  notify_when_near boolean [default: false]
  created_at timestamp [default: `now()`]
}

Table plan_transports {
  plan_transport_id uuid [pk]
  plan_id uuid [not null, ref: > trip_plans.plan_id]
  transport_id uuid [not null, ref: > transports.transport_id]
  estimated_cost decimal(10,2)
  planned_departure_time timestamp
  planned_arrival_time timestamp
  notes text
  notify_when_near boolean [default: false]
  created_at timestamp [default: `now()`]
}

Table notifications {
  notification_id uuid [pk]
  user_id uuid [not null, ref: > users.user_id]
  latitude decimal(10,6) [not null]
  longitude decimal(10,6) [not null]
  address text
  radius int [not null]
  message text
  created_at timestamp [default: `now()`]
}

Table images {
  image_id uuid [pk]
  post_id uuid [not null, ref: > posts.post_id]
  url varchar(255) [not null]
  caption text
  created_at timestamp [default: `now()`]
}

Table plan_comments {
  comment_id uuid [pk]
  plan_id uuid [not null, ref: > trip_plans.plan_id]
  user_id uuid [not null, ref: > users.user_id]
  content text [not null]
  posted_at timestamp [default: `now()`]
}

Table plan_participants {
  plan_id uuid [ref: > trip_plans.plan_id]
  user_id uuid [ref: > users.user_id]
  indexes {
    (plan_id, user_id) [pk]
  }
}

Table plan_destinations {
  plan_id uuid [ref: > trip_plans.plan_id]
  destination_id uuid [ref: > destinations.destination_id]
  indexes {
    (plan_id, destination_id) [pk]
  }
}