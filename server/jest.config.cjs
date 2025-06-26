const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
    moduleNameMapper: {
        '^src/(.*)\\.js$': '<rootDir>/src/$1.ts',
        '^../config/env.config.js$': '<rootDir>/src/app/config/env.config.ts',
		'^../../../app/(.*)\\.js$': '<rootDir>/src/app/$1.ts',
    },
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
};