export default function mapquery(address) {
	const apiKey = import.meta.env.VITE_LOCATIONIQ_API;
	if (!apiKey) return Promise.reject(new Error("Missing LocationIQ key"));

	const searchUrl = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(
		address
	)}&format=json`;

	return fetch(searchUrl, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
		},
	})
		.then((res) =>
			res.ok
				? res.json()
				: new Error("Unable to process location address")
		)
		.then((json) => {
			if (!json) {
				return Promise.reject(
					new Error("Unable to process location address")
				);
			}
			if (!json.length)
				return { coords: [14.62, 120.98], display_name: "Manila" };
			return {
				coords: [parseFloat(json[0].lat), parseFloat(json[0].lon)],
				display_name: json[0].display_name,
			};
		});
}
