## Methods to Test in `TravelPlanService`

1. **createTravelPlan**
   - Calls repository.createTravelPlan and addPlanParticipant, returns plan
2. **updateTravelPlan**
   - Throws if not owner
   - Calls repository.updateTravelPlan and returns result
3. **deleteTravelPlan**
   - Throws if not owner
   - Calls repository.deleteTravelPlan and returns result
4. **getTravelPlanById**
   - Calls repository.getTravelPlanById and returns result
5. **getAllTravelPlans**
   - Calls repository.getAllTravelPlans with filters and returns result
6. **addPlanParticipant**
   - Throws if not owner/editor
   - Throws if participant already exists
   - Calls repository.addPlanParticipant and returns result
7. **getPlanParticipants**
   - Calls repository.getPlanParticipants and returns result
8. **updatePlanParticipant**
   - Throws if not owner
   - Throws if participant not found
   - Calls repository.updatePlanParticipant and returns result
9. **deletePlanParticipant**
   - Throws if not owner
   - Throws if participant not found
   - Calls repository.deletePlanParticipant and returns result
10. **addPlanComment**
    - Throws if not owner/editor
    - Calls repository.addPlanComment and returns result
11. **getPlanComments**
    - Calls repository.getPlanComments and returns result
