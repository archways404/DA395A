# DA395A - README

## Movie Recommendation System

This project implements a movie recommendation system where users can select their favorite movies, and through our API, the system will recommend additional movies based on their selections. It uses data from The Movie Database (TMDb) API to fetch movies and genres.

## Features

- **Genre Selection:** Users can select their favorite movies from a list of genres.
- **Movie Selection:** Users can browse through a selection of movies and select their favorites.
- **Recommendation Algorithm:** The system uses an algorithm to recommend additional movies based on user selections and genre preferences.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **API:** The Movie Database (TMDb) API

## Setup Instructions

1. Clone the repository to your local machine.
2. Install dependencies for both the backend and frontend:
```sh
npm install
```
3. Start the development server:
```sh
npm run dev
```
4. Access the application at [localhost:5173](http://localhost:5173) in your web browser.

## Documentation

- [API Routes](API_ROUTES.md) - Detailed information on the API endpoints available.
- [Function Descriptions](FUNCTIONS.md) - In-depth documentation of the functions used in the project.

## Usage

1. Upon accessing the application, users will be prompted to select their favorite movies from a list of genres.
2. After selecting genres, users can browse through a selection of movies and choose their favorites.
3. Once enough selections have been made, the system will generate recommendations based on user preferences.

## Contributors
- [archways404](https://github.com/archways404) - Philip
- [gorillagripcore](https://github.com/gorillagripcore) - Alexandra
- [TBD](https://github.com/TBD) - TBD

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
