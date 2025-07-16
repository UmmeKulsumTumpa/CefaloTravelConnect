import {
	validateCreateTravelPlan,
	validateUpdateTravelPlan,
} from "../../../app/validations/travelplan.validation";
import {
	validatePlanService,
	validatePlanTransport,
} from "../../../app/validations/travelplan.validation";

describe("validateCreateTravelPlan", () => {
	it("returns [] for valid input", () => {
		const data = {
			name: "Trip",
			status: undefined,
			start_date: undefined,
			end_date: undefined,
		};
		expect(validateCreateTravelPlan(data as any)).toEqual([]);
	});
	it("fails for missing/invalid name", () => {
		expect(validateCreateTravelPlan({} as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("Name is required")])
		);
		expect(validateCreateTravelPlan({ name: "" } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("Name is required")])
		);
		expect(validateCreateTravelPlan({ name: 123 } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("Name is required")])
		);
	});
	it("fails for invalid status", () => {
		expect(
			validateCreateTravelPlan({ name: "Trip", status: "bad" } as any)
		).toContain("Invalid status value.");
	});
	it("fails for invalid start_date", () => {
		expect(
			validateCreateTravelPlan({ name: "Trip", start_date: "bad" } as any)
		).toContain("Invalid start_date.");
	});
	it("fails for invalid end_date", () => {
		expect(
			validateCreateTravelPlan({ name: "Trip", end_date: "bad" } as any)
		).toContain("Invalid end_date.");
	});
	it("fails for invalid total_cost", () => {
		expect(
			validateCreateTravelPlan({ name: "Trip", total_cost: "bad" } as any)
		).toContain("total_cost must be a number.");
	});
	it("fails for invalid total_duration", () => {
		expect(
			validateCreateTravelPlan({ name: "Trip", total_duration: "bad" } as any)
		).toContain("total_duration must be a number.");
	});
});

describe("validateUpdateTravelPlan", () => {
	it("returns [] for valid input", () => {
		const data = {
			name: "Trip",
			status: undefined,
			start_date: undefined,
			end_date: undefined,
		};
		expect(validateUpdateTravelPlan(data as any)).toEqual([]);
	});
	it("fails for invalid status", () => {
		expect(validateUpdateTravelPlan({ status: "bad" } as any)).toContain(
			"Invalid status value."
		);
	});
	it("fails for invalid start_date", () => {
		expect(validateUpdateTravelPlan({ start_date: "bad" } as any)).toContain(
			"Invalid start_date."
		);
	});
	it("fails for invalid end_date", () => {
		expect(validateUpdateTravelPlan({ end_date: "bad" } as any)).toContain(
			"Invalid end_date."
		);
	});
	it("fails for invalid total_cost", () => {
		expect(validateUpdateTravelPlan({ total_cost: "bad" } as any)).toContain(
			"total_cost must be a number."
		);
	});
	it("fails for invalid total_duration", () => {
		expect(validateUpdateTravelPlan({ total_duration: "bad" } as any)).toContain(
			"total_duration must be a number."
		);
	});
});

describe("validatePlanService", () => {
	it("returns [] for valid input", () => {
		expect(validatePlanService({ plan_id: "p", service_id: "s" } as any)).toEqual(
			[]
		);
	});
	it("fails for missing/invalid plan_id", () => {
		expect(validatePlanService({ service_id: "s" } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("plan_id is required")])
		);
		expect(
			validatePlanService({ plan_id: 123, service_id: "s" } as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("plan_id is required")])
		);
	});
	it("fails for missing/invalid service_id", () => {
		expect(validatePlanService({ plan_id: "p" } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("service_id is required")])
		);
		expect(
			validatePlanService({ plan_id: "p", service_id: 123 } as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("service_id is required")])
		);
	});
	it("fails for invalid estimated_cost", () => {
		expect(
			validatePlanService({
				plan_id: "p",
				service_id: "s",
				estimated_cost: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("estimated_cost must be a number")])
		);
	});
	it("fails for invalid planned_visit_date", () => {
		expect(
			validatePlanService({
				plan_id: "p",
				service_id: "s",
				planned_visit_date: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("Invalid planned_visit_date")])
		);
	});
	it("fails for invalid notify_when_near", () => {
		expect(
			validatePlanService({
				plan_id: "p",
				service_id: "s",
				notify_when_near: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("notify_when_near must be a boolean")])
		);
	});
});

describe("validatePlanTransport", () => {
	it("returns [] for valid input", () => {
		expect(validatePlanTransport({ plan_id: "p", service_id: "s" } as any)).toEqual(
			[]
		);
	});
	it("fails for missing/invalid plan_id", () => {
		expect(validatePlanTransport({ service_id: "s" } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("plan_id is required")])
		);
		expect(
			validatePlanTransport({ plan_id: 123, service_id: "s" } as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("plan_id is required")])
		);
	});
	it("fails for missing/invalid service_id", () => {
		expect(validatePlanTransport({ plan_id: "p" } as any)).toEqual(
			expect.arrayContaining([expect.stringContaining("service_id is required")])
		);
		expect(
			validatePlanTransport({ plan_id: "p", service_id: 123 } as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("service_id is required")])
		);
	});
	it("fails for invalid estimated_cost", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				estimated_cost: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("estimated_cost must be a number")])
		);
	});
	it("fails for invalid planned_departure_time", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				planned_departure_time: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("Invalid planned_departure_time")])
		);
	});
	it("fails for invalid planned_arrival_time", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				planned_arrival_time: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("Invalid planned_arrival_time")])
		);
	});
	it("fails for invalid start_point_latitude", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				start_point_latitude: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("start_point_latitude must be a number")])
		);
	});
	it("fails for invalid start_point_longitude", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				start_point_longitude: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("start_point_longitude must be a number")])
		);
	});
	it("fails for invalid end_point_latitude", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				end_point_latitude: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("end_point_latitude must be a number")])
		);
	});
	it("fails for invalid end_point_longitude", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				end_point_longitude: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("end_point_longitude must be a number")])
		);
	});
	it("fails for invalid notify_when_near", () => {
		expect(
			validatePlanTransport({
				plan_id: "p",
				service_id: "s",
				notify_when_near: "bad",
			} as any)
		).toEqual(
			expect.arrayContaining([expect.stringContaining("notify_when_near must be a boolean")])
		);
	});
});
