import dataStore from 'nedb-promise';

export class movieStore {
    constructor({ filename, autoload }) {
        this.store = dataStore({ filename, autoload });
    }

    async find(props) {
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(movie) {
        let movieTitle = movie.title;
        if (!movieTitle) { // validation
            throw new Error('Missing title property')
        }
        return this.store.insert(movie);
    };

    async update(props, movie) {
        return this.store.update(props, movie);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new movieStore({ filename: './db/movies.json', autoload: true });
