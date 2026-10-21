export function useDebouncedSearch(fetcher, options = {}) {
	const { debounceMs = 300, initialQuery = '' } = options;

	const query = ref(initialQuery);
	const results = ref(null);
	const isLoading = ref(false);
	const error = ref(null);
	const lastCompletedQuery = ref('');

	let debounceHandle = null;
	let activeController = null;
	let requestSeq = 0;

	function runSearch(value) {
		if (activeController) activeController.abort();

		const controller = new AbortController();
		activeController = controller;
		const seq = ++requestSeq;

		isLoading.value = true;
		error.value = null;

		fetcher(value, controller.signal)
			.then((data) => {
				if (controller.signal.aborted || seq !== requestSeq) return;
				results.value = data;
				lastCompletedQuery.value = value;
			})
			.catch((err) => {
				if (controller.signal.aborted || seq !== requestSeq) return;
				if (err?.name === 'AbortError' || err?.code === 'ABORTED') return;
				error.value = err;
				results.value = null;
			})
			.finally(() => {
				if (seq === requestSeq) isLoading.value = false;
			});
	}

	function clearDebounce() {
		if (debounceHandle !== null) {
			clearTimeout(debounceHandle);
			debounceHandle = null;
		}
	}

	watch(query, (value) => {
		clearDebounce();
		const trimmed = value.trim();

		if (!trimmed) {
			if (activeController) activeController.abort();
			results.value = null;
			error.value = null;
			isLoading.value = false;
			lastCompletedQuery.value = '';
			return;
		}

		debounceHandle = setTimeout(() => {
			debounceHandle = null;
			runSearch(trimmed);
		}, debounceMs);
	});

	onScopeDispose(() => {
		clearDebounce();
		if (activeController) activeController.abort();
	});

	function setQuery(value) {
		query.value = value;
	}

	function reset() {
		clearDebounce();
		if (activeController) activeController.abort();
		results.value = null;
		error.value = null;
		isLoading.value = false;
		query.value = initialQuery;
		lastCompletedQuery.value = '';
		requestSeq++;
	}

	return {
		query,
		setQuery,
		results,
		isLoading,
		error,
		lastCompletedQuery,
		reset,
	};
}
