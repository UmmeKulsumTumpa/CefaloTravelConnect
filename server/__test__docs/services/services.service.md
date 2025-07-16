## Methods to Test in `ServiceService`

1. **buildServiceResponseWithTransport**
   - Non-Transport type returns DTO without transport
   - Transport type includes transport data or null
2. **createService**
   - Throws on invalid service
   - Throws if DB created but not returned
   - Handles transport creation properly
3. **getServiceById**
   - Throws if not found
   - Returns correct DTO including transport if applicable
4. **updateService**
   - Throws if service not found
   - Throws on invalid update
   - Throws if DB update fails
   - Handles transport update scenario correctly
   - Returns DTO via buildServiceResponseWithTransport if no transport or not Transport type
5. **deleteService**
   - Throws if not found
   - Calls transportService.deleteTransport if type==='Transport'
   - Throws if delete returns falsy
   - Returns deletion count on success
6. **getAll**
   - If query options given and transportService.searchTransports returns empty → returns []
   - If searchTransports returns results, wins the filter
   - If no mode/operator → calls serviceRepository.findAll and returns built DTOs
7. **findNearbyServices**
   - Calls repository.findNearby with correct radius conversion and returns built DTOs
