export const POST_EFFORT_LEVELS = ['Low', 'Medium', 'High'] as const;
export type EffortLevel = (typeof POST_EFFORT_LEVELS)[number];

export const POST_VISIBILITY = ['Public', 'Private', 'Friends'] as const;
export type Visibility = (typeof POST_VISIBILITY)[number];
