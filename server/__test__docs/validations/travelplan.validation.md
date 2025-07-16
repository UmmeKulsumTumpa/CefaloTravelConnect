## Functions to Test in `TravelPlan.validation`

1. **validateCreateTravelPlan**
   - Returns [] for valid input
   - Fails for missing/invalid name, status, start_date, end_date, total_cost, total_duration
2. **validateUpdateTravelPlan**
   - Returns [] for valid input
   - Fails for invalid name, status, start_date, end_date, total_cost, total_duration
3. **validatePlanService**
   - Returns [] for valid input
   - Fails for missing/invalid plan_id, service_id, estimated_cost, planned_visit_date, notify_when_near
4. **validatePlanTransport**
   - Returns [] for valid input
   - Fails for missing/invalid plan_id, service_id, estimated_cost, planned_departure_time, planned_arrival_time, start_point_latitude, start_point_longitude, end_point_latitude, end_point_longitude, notify_when_near
