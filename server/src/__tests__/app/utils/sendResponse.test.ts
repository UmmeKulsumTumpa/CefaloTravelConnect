/**
 * What to test:
 * - it calls the status() once with the correct statusCode
 * - it call json() with properly structured payload(success, optional message, data)
 */

import sendResponse from '../../../app/utils/sendResponse';

function mockResponse() {
	const res = {} as any;
	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn();
	return res;
}

describe('sendResponse', () => {
	it('handle message + data', () => {
		const res = mockResponse();
		const payload = {
			statusCode: 201,
			success: true,
			message: 'OK',
			data: {}
		};

		sendResponse(res, payload);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'OK',
			data: {}
		})
	});

	it('handles no message', () => {
		const res = mockResponse();
		const payload = { 
			statusCode: 200, 
			success: true, 
			data: [1, 2, 3] 
		} as any;
		
		sendResponse(res, payload);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ 
			success: true, 
			message: undefined, 
			data: [1, 2, 3] }
		);
	});
});
