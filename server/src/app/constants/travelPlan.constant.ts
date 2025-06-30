export const TRAVEL_PLAN_STATUS = ['Planned', 'Travelled', 'Cancelled'] as const;
export type TravelPlanStatus = (typeof TRAVEL_PLAN_STATUS)[number];

export const TRAVEL_PLAN_PRIORITY = ['MustVisit', 'Optional'] as const;
export type VisitPriority = (typeof TRAVEL_PLAN_PRIORITY)[number];

export const TRAVEL_PLAN_PARTICIPANT_ROLE = ['Owner', 'Editor', 'Viewer'] as const;
export type ParticipantRole = (typeof TRAVEL_PLAN_PARTICIPANT_ROLE)[number];
