# Rick and Morty Character Explorer

A modern React application for exploring characters from the Rick and Morty universe. Built with TypeScript, Vite, and GraphQL, featuring a responsive design with search, filtering, and favorites functionality.

## 🚀 Features

- **Character Browsing**: View all Rick and Morty characters with pagination
- **Search & Filter**: Find characters by name, species, status, and more
- **Favorites System**: Save your favorite characters locally
- **Comments**: Add and manage comments for each character
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Search**: Instant search results as you type
- **Sorting**: Sort characters by name in ascending or descending order

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **GraphQL**: Apollo Client
- **Icons**: Heroicons
- **Testing**: Vitest + Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blossom-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

The application includes comprehensive unit tests for all components.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 API Documentation

This application uses the [Rick and Morty API](https://rickandmortyapi.com/) via GraphQL. The API provides access to characters, episodes, and locations from the Rick and Morty universe.

### GraphQL Endpoint
```
https://rickandmortyapi.com/graphql
```

### Main Queries

#### 1. Get Characters (Paginated)
```graphql
query GetCharacters($page: Int, $filter: FilterCharacter) {
  characters(page: $page, filter: $filter) {
    info {
      count
      pages
      next
      prev
    }
    results {
      id
      name
      status
      species
      type
      gender
      image
      episode {
        id
        name
      }
      location {
        id
        name
      }
      origin {
        id
        name
      }
      created
    }
  }
}
```

**Parameters:**
- `page`: Page number (optional, defaults to 1)
- `filter`: Filter object with properties like `name`, `status`, `species`, `gender` (optional)

#### 2. Get Single Character
```graphql
query GetCharacter($id: ID!) {
  character(id: $id) {
    id
    name
    status
    species
    type
    gender
    image
    episode {
      id
      name
      air_date
      episode
    }
    location {
      id
      name
      type
      dimension
    }
    origin {
      id
      name
      type
      dimension
    }
    created
  }
}
```

**Parameters:**
- `id`: Character ID (required)

### API Response Examples

#### Characters Response
```json
{
  "data": {
    "characters": {
      "info": {
        "count": 826,
        "pages": 42,
        "next": 2,
        "prev": null
      },
      "results": [
        {
          "id": "1",
          "name": "Rick Sanchez",
          "status": "Alive",
          "species": "Human",
          "type": "",
          "gender": "Male",
          "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          "episode": [
            {
              "id": "1",
              "name": "Pilot"
            }
          ],
          "location": {
            "id": "3",
            "name": "Citadel of Ricks"
          },
          "origin": {
            "id": "1",
            "name": "Earth (C-137)"
          },
          "created": "2017-11-04T18:48:46.250Z"
        }
      ]
    }
  }
}
```

### Filtering Options

The API supports filtering characters by various criteria:

- **Name**: Search by character name (partial matches supported)
- **Status**: `Alive`, `Dead`, `unknown`
- **Species**: `Human`, `Alien`, `Humanoid`, `Robot`, etc.
- **Gender**: `Female`, `Male`, `Genderless`, `unknown`
- **Type**: Character type (varies by character)

### Pagination

The API uses cursor-based pagination with the following response structure:

```json
{
  "info": {
    "count": 826,      // Total number of characters
    "pages": 42,       // Total number of pages
    "next": 2,         // Next page number (null if no next page)
    "prev": null       // Previous page number (null if no previous page)
  }
}
```

## 🎯 Usage Guide

### Browsing Characters
1. **View All Characters**: The main page displays all characters with pagination
2. **Load More**: Click "Load More Characters" to fetch additional pages
3. **Character Details**: Click on any character to view detailed information

### Search and Filter
1. **Search Bar**: Type in the search bar to filter characters by name
2. **Filter Options**: Click the filter icon to access advanced filtering:
   - **Characters**: Filter by favorites, starred, or others
   - **Species**: Filter by human, alien, humanoid, robot, or all
3. **Sort**: Use the sort button to toggle between ascending/descending name order

### Favorites
1. **Add to Favorites**: Click the heart icon next to any character
2. **View Favorites**: Use the filter options to show only favorite characters
3. **Remove from Favorites**: Click the filled heart icon to remove from favorites

### Comments
1. **Add Comments**: On character detail pages, scroll to the comments section
2. **Write Comment**: Type your comment in the text area and click "Add Comment"
3. **Delete Comments**: Click the trash icon next to any comment to delete it

### Responsive Design
- **Desktop**: Full feature set with sidebar filters
- **Mobile**: Optimized layout with modal filters and touch-friendly interactions

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── Character.tsx   # Individual character display
│   ├── Comments.tsx    # Comment system
│   ├── FilterPopover.tsx # Filter options
│   ├── LoadMoreButton.tsx # Pagination
│   ├── SearchAndFilter.tsx # Search and filter UI
│   └── CharacterListHeader.tsx # Page header
├── pages/              # Page components
├── services/           # API and GraphQL setup
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

### Key Dependencies
- **Apollo Client**: GraphQL client for API communication
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons

### Environment Variables
No environment variables are required for this application as it uses the public Rick and Morty API.

## 🐛 Troubleshooting

### Common Issues

1. **API Rate Limiting**: The Rick and Morty API has rate limits. If you encounter issues, wait a moment and try again.

2. **Network Errors**: Ensure you have a stable internet connection as the app relies on the external API.

3. **Build Issues**: If you encounter build issues, try:
   ```bash
   npm clean-install
   npm run build
   ```

4. **Test Failures**: If tests fail, ensure all dependencies are installed:
   ```bash
   npm install
   npm test
   ```

## 📄 License

This project is for educational purposes and uses the Rick and Morty API which is publicly available.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation at [rickandmortyapi.com](https://rickandmortyapi.com/)
3. Open an issue in the repository

---

**Enjoy exploring the Rick and Morty universe! 🚀**
