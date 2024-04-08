export default {
    methods: {
        $checkLocalStorage(key) {
            return localStorage.getItem(key) ? true : false;
        },
        $getLocalStorage(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        $setLocalStorage(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        $deleteLocalStorage(key) {
            localStorage.removeItem(key);
        }
    }
}