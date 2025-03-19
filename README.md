# BuildCores PC Case Comparison Tool

A simple web application that allows users to search for PC cases and compare their specifications side by side. This app uses the BuildCores API to fetch PC case data.

## Features

- Search for PC cases using the BuildCores API
- Add multiple cases to a comparison view
- Compare specifications side by side
- Responsive design that works on desktop and mobile
- Data persistence using localStorage

## Technologies Used

- React.js
- Axios for API requests
- CSS for styling
- LocalStorage for data persistence

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd buildcores-compare
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for deployment to Vercel. To deploy:

1. Install the Vercel CLI (if not already installed):
   ```
   npm install -g vercel
   ```

2. Run the Vercel deployment command:
   ```
   vercel
   ```

3. Follow the prompts to complete deployment.

## API Usage

This application uses the BuildCores API to search for PC cases. The API endpoint used is:

```
https://www.api.buildcores.com/api/official/database/parts
```

The request is sent with parameters to search for PC cases with:
- `part_category`: "PCCase"
- `search_query`: User's input search term

## License

This project is open source and available under the MIT License.
