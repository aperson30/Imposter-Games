
import { CategoryOption } from './types';

export const WORD_CATEGORIES: CategoryOption[] = [
  { id: 'christmas', name: 'Christmas', icon: '🎄' },
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'objects', name: 'Objects', icon: '🪑' },
  { id: 'movies', name: 'Movies', icon: '🎬' },
  { id: 'locations', name: 'Locations', icon: '📍' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'professions', name: 'Professions', icon: '💼' },
  { id: 'brands', name: 'Brands', icon: '🏷️' },
  { id: 'tools', name: 'Tools', icon: '🛠️' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'superpowers', name: 'Superpowers', icon: '⚡' },
  { id: 'games', name: 'Games', icon: '🎮' },
  { id: 'countries', name: 'Countries', icon: '🗺️' }
];

export const QUESTION_CATEGORIES: CategoryOption[] = [
  { id: 'daily_life', name: 'Daily Life', icon: '🏠' },
  { id: 'love_rel', name: 'Love & Romance', icon: '💑' },
  { id: 'money_fame', name: 'Money & Fame', icon: '💰' },
  { id: 'future_tech', name: 'Future & Tech', icon: '🤖' },
  { id: 'spicy_wild', name: 'Spicy & Wild', icon: '🔥' }
];

export interface WordEntry {
  word: string;
  hint: string;
}

export const WORD_BANK: Record<string, WordEntry[]> = {
  christmas: [
    { word: "Reindeer", hint: "They pull a heavy sleigh" },
    { word: "Snowman", hint: "Built with three large balls" },
    { word: "Tinsel", hint: "Shiny string on trees" },
    { word: "Mistletoe", hint: "Makes people kiss" },
    { word: "Eggnog", hint: "Thick creamy holiday drink" },
    { word: "Stocking", hint: "Hung by the chimney" },
    { word: "Sleigh", hint: "Santa's vehicle" },
    { word: "Grinch", hint: "Green holiday hater" },
    { word: "Gingerbread", hint: "Spicy cookies used for houses" }
  ],
  animals: [
    { word: "Elephant", hint: "Has a long trunk and big ears" },
    { word: "Giraffe", hint: "Very long neck" },
    { word: "Penguin", hint: "Flightless bird in tuxedos" },
    { word: "Octopus", hint: "Eight arms and ink" },
    { word: "Kangaroo", hint: "Has a pouch for babies" },
    { word: "Chameleon", hint: "Changes color to hide" },
    { word: "Flamingo", hint: "Pink bird that stands on one leg" }
  ],
  food: [
    { word: "Sushi", hint: "Raw fish and rice" },
    { word: "Burrito", hint: "Wrapped in a flour tortilla" },
    { word: "Spaghetti", hint: "Long thin noodles" },
    { word: "Croissant", hint: "Flaky buttery French pastry" },
    { word: "Pizza", hint: "Italian round dough with toppings" }
  ],
  objects: [
    { word: "Telescope", hint: "Look at stars through this" },
    { word: "Typewriter", hint: "Old school word processor" },
    { word: "Headphones", hint: "Used to listen to music privately" },
    { word: "Flashlight", hint: "Portable light source" }
  ],
  movies: [
    { word: "Inception", hint: "Dreams within dreams" },
    { word: "Titanic", hint: "Famous sinking ship movie" },
    { word: "Star Wars", hint: "Space opera with lightsabers" }
  ],
  locations: [
    { word: "Paris", hint: "City of Light with the Eiffel Tower" },
    { word: "Tokyo", hint: "Busiest capital of Japan" },
    { word: "Egypt", hint: "Home of the Great Pyramids" }
  ],
  sports: [
    { word: "Basketball", hint: "Played with a hoop and a ball" },
    { word: "Cricket", hint: "Popular in UK and India with bats" },
    { word: "Tennis", hint: "Played on a court with rackets" }
  ],
  professions: [
    { word: "Astronaut", hint: "Goes to outer space" },
    { word: "Surgeon", hint: "Performs medical operations" },
    { word: "Firefighter", hint: "Puts out blazes" }
  ],
  brands: [
    { word: "Apple", hint: "Known for the iPhone" },
    { word: "Nike", hint: "Famous for the Swoosh logo" },
    { word: "Google", hint: "The world's biggest search engine" }
  ],
  tools: [
    { word: "Screwdriver", hint: "Used for turning screws" },
    { word: "Hammer", hint: "Used for hitting nails" },
    { word: "Wrench", hint: "Used for loosening nuts" }
  ],
  vehicles: [
    { word: "Submarine", hint: "Goes underwater" },
    { word: "Helicopter", hint: "Blades on top, vertical takeoff" },
    { word: "Motorcycle", hint: "Two wheels and an engine" }
  ],
  superpowers: [
    { word: "Invisibility", hint: "Cannot be seen" },
    { word: "Teleportation", hint: "Move instantly from place to place" },
    { word: "Flying", hint: "Soaring through the air" }
  ],
  games: [
    { word: "Minecraft", hint: "Block building game" },
    { word: "Chess", hint: "Game of kings on a 64-square board" },
    { word: "Among Us", hint: "Social deduction game in space" }
  ],
  countries: [
    { word: "Canada", hint: "Maple leaves and cold winters" },
    { word: "Japan", hint: "Land of the rising sun" },
    { word: "Brazil", hint: "Largest country in South America" }
  ]
};

export const QUESTION_BANK: Record<string, { a: string, b: string }[]> = {
  daily_life: [
    { a: "What is the first thing you do when you wake up?", b: "What is something you do every morning?" },
    { a: "Which kitchen appliance could you not live without?", b: "What is a common object in your house?" },
    { a: "How do you prefer to travel locally?", b: "How do you get from place to place?" }
  ],
  love_rel: [
    { a: "What was your most romantic date like?", b: "What is a nice way to spend time with someone?" },
    { a: "What quality do you value most in a partner?", b: "What do you like about people?" }
  ],
  money_fame: [
    { a: "What would you buy first if you won the lottery?", b: "What is something expensive you want?" },
    { a: "Would you rather be famous for art or science?", b: "What would you like to be known for?" }
  ],
  future_tech: [
    { a: "What planet would you want to colonize first?", b: "Where in space would you go?" },
    { a: "Which piece of futuristic tech do you want now?", b: "What is a cool gadget?" }
  ],
  spicy_wild: [
    { a: "What is the craziest thing you've done for a dare?", b: "What is a bold thing you've done?" },
    { a: "What is a secret talent no one knows about?", b: "What is something you are good at?" }
  ]
};

export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 3;
