export const baseUrl = 'localhost:3000';

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

const log = getLogger('api');

export interface ResponseProps<T> {
    data: T;
}

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    /**
     * The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
     * It allows you to associate handlers with an asynchronous action's eventual success value or failure reason.
     * This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value,
     * the asynchronous method returns a promise to supply the value at some point in the future.
     */
    log(`${fnName} - started`);
    return promise
        .then((result: any) => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(result.data);
        })
        .catch((error: any) => {
            log(`${fnName} - failed`);
            return Promise.reject(error);
        })
}

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const authConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
});
