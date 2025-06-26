/**
 * What to test:
 * - when the async handler resolves successfully -> next() shuld not be called with an error
 * - when it rejects or throws -> next() should be called
 */

import { asyncHandler } from '../../../app/utils/asyncHandler';

describe('asyncHandler', () => {
	it('calls next() when resolved', async () => {
		const fn = jest.fn().mockResolvedValue(undefined);
		const handler = asyncHandler(fn);

		const req = {} as any;
		const res = {} as any;
		const next = jest.fn();

		await handler(req, res, next);

		expect(fn).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	it('passes error to next when rejected', async () => {
		const err = new Error('fail');
		const fn = jest.fn().mockRejectedValue(err);
		const handler = asyncHandler(fn);

		const req = {} as any;
		const res = {} as any;
		const next = jest.fn();

		await handler(req, res, next);

		expect(next).toHaveBeenCalledWith(err);
	});
});

