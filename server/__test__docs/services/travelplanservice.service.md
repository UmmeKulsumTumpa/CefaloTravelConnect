## Methods to Test in `TravelPlanService` (Plan Service)

1. **addPlanService**
   - Throws if plan not found
   - Throws if service validation fails
   - Throws if transport validation fails
   - Calls repository.addPlanService and addPlanTransport, returns merged result
2. **getPlanService**
   - Throws if plan not found
   - Throws if service not found
   - Calls repository.getPlanService and getPlanTransport, returns merged result
3. **updatePlanService**
   - Throws if plan not found
   - Throws if service not found
   - Throws if service validation fails
   - Throws if transport validation fails
   - Calls repository.updatePlanService and updatePlanTransport, returns merged result
4. **deletePlanService**
   - Throws if plan not found
   - Throws if service not found
   - Calls repository.deletePlanService and deletePlanTransport
5. **getPlanServices**
   - Throws if plan not found
   - Calls repository.getPlanServices and getPlanTransports, returns merged results
