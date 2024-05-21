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

1. Install dependencies for both the backend and frontend:

    ```
    npm install
    ```

1. Start the development server:

    ```
    npm run dev
    ```

1. Access the application at [localhost:5173](http://localhost:5173) in your web browser.

## Documentation

- [API Routes](API_ROUTES.md) - Detailed information on the API endpoints available.
- [Function Descriptions](FUNCTIONS.md) - In-depth documentation of the functions used in the project.

## Usage

1. Upon accessing the application, users will be prompted to select their favorite movies from a list of genres.

1. After selecting genres, users can browse through a selection of movies and choose their favorites.

1. Once enough selections have been made, the system will generate recommendations based on user preferences.

## [Rationale for Framework Choice](https://www.tatvasoft.com/blog/angular-vs-react-vs-vue/)

### Why We Chose React

1. Learning Curve

    React is simple and focus on building UI components. The core library is minimalistic, focusing on the view layer, which allows people to learn the basics quickly.

1. Flexibility and Customization

    React is flexible. This flexibility allows us to integrate libraries and tools (Like tailwind) without being constrained by a rigid structure. This enables us to customize the application more.

1. Industry Adoption

    React is widely used in the industry, which means there is lots of tutorials and support to be obtained online. It's also great to have in our CV and portfolio for after our studies. 

### Comparison with Other Frameworks

**Vue.js**
 
Pros: 

- Simplicity and ease of learning

- Flexible

- Strong community and good performance

Cons:

- Smaller ecosystem compared to React

- Less mature and less common

**Angular**

Pros:

- Comprehensive framework with built-in features

- Robust tools for large-scale applications

Cons:

- Steeper learning curve

- Less flexible

- We don't know TypeScript

After evaluating we concluded that React was the best choice for our project, mostly because of the learning curve and common use in the industry. As a result however, it's easily scaleable and maintainable. 

## Contributors
- [archways404](https://github.com/archways404) - Philip
- [gorillagripcore](https://github.com/gorillagripcore) - Alexandra
- [Leopozart](https://github.com/Leopozart) - Felix

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
