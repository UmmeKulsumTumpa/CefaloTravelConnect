## Methods to Test in `TransportService`

1. **createTransport**
   - Throws 400 AppError if `service_id` missing
   - Throws 409 AppError if transport already exists
   - Throws 400 AppError if validation errors
   - Returns new transport if successful
2. **getTransportById**
   - Throws 404 AppError if not found
   - Returns transport if exists
3. **getTransportIfExists**
   - Returns null when not found (AppError 404)
   - Propagates other errors
   - Returns transport when exists
4. **getAllTransports**
   - Returns array from repository
5. **updateTransport**
   - Throws 404 if no existing transport
   - Throws 400 if validation errors
   - Throws 404 if update returns null
   - Returns transport when successful
6. **deleteTransport**
   - Throws 404 if not exists
   - Returns boolean when successful
7. **searchTransports**
   - Throws 404 if no results (empty array)
   - Returns results when found
