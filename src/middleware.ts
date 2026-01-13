import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
	const { request, url, locals } = context;

	if (url.pathname.startsWith('/admin')) {
		// i understand that cloudlfare blocks setting CF- headers externally, so this should be safe
		const userEmailValue = request.headers.get(
			'Cf-Access-Authenticated-User-Email'
		);

		if (import.meta.env.DEV && !userEmailValue) {
			locals.userEmail = 'admin@parsehex.dev';
		} else if (userEmailValue) {
			locals.userEmail = userEmailValue;
		} else {
			return new Response('Forbidden: Missing Authentication Header', {
				status: 403,
			});
		}
	}

	return next();
});
