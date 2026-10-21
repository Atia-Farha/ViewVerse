let _id = 0;

const DEFAULT_DURATION = 4000;

export function useToast() {
	const toasts = useState('toast:items', () => []);

	function add({ message, type = 'info', duration = DEFAULT_DURATION }) {
		const id = ++_id;
		toasts.value = [...toasts.value, { id, message, type, duration }];

		if (duration > 0 && typeof window !== 'undefined') {
			setTimeout(() => remove(id), duration);
		}

		return id;
	}

	function remove(id) {
		toasts.value = toasts.value.filter((t) => t.id !== id);
	}

	function success(message, opts = {}) {
		return add({ message, type: 'success', ...opts });
	}

	function error(message, opts = {}) {
		return add({ message, type: 'error', duration: 6000, ...opts });
	}

	function info(message, opts = {}) {
		return add({ message, type: 'info', ...opts });
	}

	function warning(message, opts = {}) {
		return add({ message, type: 'warning', duration: 5000, ...opts });
	}

	return { toasts, add, remove, success, error, info, warning };
}
