## Functions to Test in `Service.validation`

1. **validateService**
   - Returns valid for correct input
   - Fails for missing/invalid name, type, latitude, longitude, address, description
   - Fails for invalid transport (calls validateCreateTransport)
2. **validateServiceUpdate**
   - Returns valid for correct input
   - Fails for invalid name, type, latitude, longitude, address, description
