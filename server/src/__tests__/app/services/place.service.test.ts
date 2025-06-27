import { PlaceService } from "../../../app/services/Place.service";
import { mockPlaceRepository } from "../../../test-utils/mockPlaceRepository";
import type { IPlaceRepository } from "../../../app/interfaces/IPlaceRepository";

describe("PlaceService", () => {
    let placeRepository: ReturnType<typeof mockPlaceRepository>;
    let placeService: PlaceService;

    beforeEach(() => {
        placeRepository = mockPlaceRepository();
        placeService = new PlaceService(placeRepository);
    });

    describe("createPlace", () => {
        it("should create a place and return it", async () => {
            const place = {
                id: "1",
                name: "Test Place",
                latitude: 0,
                longitude: 0
            };

            placeRepository.create.mockResolvedValue(place);
            const result = await placeService.createPlace(place);

            expect(placeRepository.create).toHaveBeenCalledWith(place);
            expect(result).toBe(place);
        });
    });

    describe("getPlaceById", () => {
        it("should return a place if found", async () => {
            const place = { id: "1", name: "Test Place" };

            placeRepository.findById.mockResolvedValue(place);
            const result = await placeService.getPlaceById("1");

            expect(placeRepository.findById).toHaveBeenCalledWith("1");
            expect(result).toBe(place);
        });
        it("should return null if not found", async () => {
            placeRepository.findById.mockResolvedValue(null);

            const result = await placeService.getPlaceById("2");

            expect(result).toBeNull();
        });
    });

    describe("getAllPlaces", () => {
        it("should return all places with filters", async () => {
            const places = [{ id: "1" }, { id: "2" }];
            const filters = { name: "Test" };

            placeRepository.findAll.mockResolvedValue(places);
            const result = await placeService.getAllPlaces(filters);

            expect(placeRepository.findAll).toHaveBeenCalledWith(filters);
            expect(result).toBe(places);
        });
        it("should return all places with no filters", async () => {
            const places = [{ id: "1" }];

            placeRepository.findAll.mockResolvedValue(places);
            const result = await placeService.getAllPlaces();

            expect(placeRepository.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toBe(places);
        });
    });

    describe("updatePlace", () => {
        it("should update and return the place if found", async () => {
            const updated = { id: "1", name: "Updated" };

            placeRepository.update.mockResolvedValue(updated);
            const result = await placeService.updatePlace("1", { name: "Updated" });

            expect(placeRepository.update).toHaveBeenCalledWith("1", { name: "Updated" });
            expect(result).toBe(updated);
        });
        it("should return null if place not found", async () => {
            placeRepository.update.mockResolvedValue(null);
            const result = await placeService.updatePlace("2", { name: "Nope" });

            expect(result).toBeNull();
        });
    });

    describe("deletePlace", () => {
        it("should return true if deleted", async () => {
            placeRepository.delete.mockResolvedValue(true);
            const result = await placeService.deletePlace("1");

            expect(placeRepository.delete).toHaveBeenCalledWith("1");
            expect(result).toBe(true);
        });
        it("should return false if not deleted", async () => {
            placeRepository.delete.mockResolvedValue(false);
            
            const result = await placeService.deletePlace("2");
            expect(result).toBe(false);
        });
    });
});
