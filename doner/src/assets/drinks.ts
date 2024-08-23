export interface Drink {
  image: string;
  name: string;
  description: string;
  price: number;
}

const drinks: Drink[] = [
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697ecb9d7ecf.jpg",
    name: "Cuban Cocktail No. 2",
    description:
      "Faint sweetness balances spirituous rum notes in this delicately fruity, rose-red, bite-sized cocktail.",
    price: 12,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e918d6a6d.jpg",
    name: "Beijo Sour",
    description: "A cachaça sour with raspberry and pineapple.",
    price: 10,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667ab46d7ebf9.jpg",
    name: "Zapatero Old Fashioned",
    description:
      "Delicately bittered and spiced mezcal and bourbon, lifted by subtle rich almond.",
    price: 14,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697eb7c45232.jpg",
    name: "Espresso Breakfast Martini",
    description:
      "As the name suggests, a mashup of the Espresso and Breakfast Martinis, delivering gin-laced coffee and marmalade citrus.",
    price: 13,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e952d2375.jpg",
    name: "President Napoleon",
    description:
      "Napoleon tendencies aside, this cocktail is bigger than its diminutive proportions, packed with bourbon-laced, expressive bittersweet fruity sourness.",
    price: 11,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697ea3e51dc4.jpg",
    name: "Infante",
    description:
      "A Margarita riff with orgeat replacing the usual orange liqueur, so disguising it with alluring almond/marzipan notes. Some versions call for rose rather.",
    price: 12,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697df02e7bbb.jpg",
    name: "Fogerty",
    description:
      "Spirit-forward and bittersweet. Sometimes that's what life calls for! If you find Ryan's recipe, which originally calls for a high-strength rye, a tad.",
    price: 13,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e84e8f12c.jpg",
    name: "Margarita Soda",
    description:
      "A Tommy's Margarita lengthened with soda. Tasty and refreshing.",
    price: 9,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/08/66adde6cb02b0.jpg",
    name: "Ancestor",
    description:
      "Looking at the recipe, with liqueur and a whopping 15ml (¾oz) of maple syrup, I thought it would be overly sweet. However, as you'd expect from a Satan's.",
    price: 12,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/05/664f1398b08d8.jpg",
    name: "Non-zero Possibility",
    description:
      "Cola-like herbal and marine notes invigorated with tonic water.",
    price: 10,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667ab884a79fd.jpg",
    name: "Periscope",
    description: "Fabulously light, almost creamy, and floral.",
    price: 11,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697eb42a9ebb.jpg",
    name: "Blind Pilot",
    description:
      "Best described as a Galliano Manhattan, I was sceptical when David Selle, a fellow Discerning Drinker, recommended this three equal-parts cocktail to me.",
    price: 13,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697eb142ba27.jpg",
    name: "Trinity",
    description:
      "A Dry Manhattan-based on Scotch with a dash of apricot liqueur and a touch of crème de menthe.",
    price: 12,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/05/664f184da0355.jpg",
    name: "Pisco Sour (Difford's recipe)",
    description:
      "All the Peruvian bartenders I've met prefer their Pisco Sours blended rather than shaken. Indeed, it is a brilliant cocktail when blended, but I prefer.",
    price: 11,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667ab81db62e3.jpg",
    name: "Verdant Martini",
    description:
      "What this cocktail lacks in verdant colour is made up by its grassy green flavour.",
    price: 12,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e87ab6905.jpg",
    name: "White Witch",
    description:
      "Overproof rum, orange curaçao and lime are the main influences in this long, refreshing cocktail. However, crème de cacao adds pleasing chocolaty notes.",
    price: 10,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667aba947f96c.jpg",
    name: "Mezcal Porn Star Martini",
    description:
      "A mezcal-laced riff on the classically vanilla vodka-based Porn Star Martini.",
    price: 14,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e7d334635.jpg",
    name: "Old Money No. 2",
    description:
      "Best described as a nutty, delicately bittersweet Old Fashioned. A tasty digestivo or late-night sipper.",
    price: 13,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697e77f1b4df.jpg",
    name: "Tobacco Oaxaca Old Fashioned",
    description:
      "Tobacco bitters add a distinctive and very pleasant flavour to the modern classic Oaxaca Old Fashioned.",
    price: 15,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/6661cbae71de2.jpg",
    name: "Electric Circus",
    description: "A bright and bold sour in both flavour and colour.",
    price: 9,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667ab501d598f.jpg",
    name: "Empire State of Mind",
    description: "A delicately bittered apple sour.",
    price: 10,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/06/667ab4b97f404.jpg",
    name: "Stun Wray",
    description:
      "To better fit a 12oz Collins glass, I've reduced the original spec of this cocktail by a third. However, you'll need properly cold crushed ice (ideally.",
    price: 11,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697ebf2c3022.jpg",
    name: "VC (Vermouth & Cassis)",
    description: "Dry vermouth balances the richness of crème de cassis.",
    price: 8,
  },
  {
    image:
      "https://cdn.diffords.com/contrib/stock-images/2024/07/6697ec3a85919.jpg",
    name: "Vermuttino",
    description:
      "Select good vermouth, strike the perfect dilution with the freshness of lemon zest twist, and you'll enjoy a delicious aperitivo.",
    price: 9,
  },
];

export default drinks;
