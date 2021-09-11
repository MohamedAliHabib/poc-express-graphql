export const BOOKS = [
  {name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '2'},
  {name: 'The final empire', genre: 'Fantasy', id: '2', authorId: '2'},
  {name: 'The long earth', genre: 'Sci-Fi', id: '3', authorId: '1'},
];

export const AUTHORS = [
  {name: 'Patrick Rothfuss', age: 44, id: '1'},
  {name: 'Brandon Sanderson', age: 42, id: '2'},
  {name: 'Terry Pratchett', age: 66, id: '3'},
];

export const GENRES = [
  {id: '1', name: 'Sci-Fi'},
  {id: '2', name: 'Drama'},
  {id: '3', name: 'Action'},
];

export const MOVIES = [
  {
    id: '1',
    name: 'Interstellar',
    genre: {id: '1', name: 'Sci-Fi'},
    numberInStock: 300,
    dailyRentalRate: 20,
  },
  {
    id: '2',
    name: 'A Beautiful Mind',
    genre: {id: '2', name: 'Drama'},
    numberInStock: 400,
    dailyRentalRate: 18,
  },
];
