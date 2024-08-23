export interface Challenge {
  name: string;
  description: string;
  difficulty: 0 | 1 | 2;
}

const names: Challenge[] = [
  {
    name: "Push-Up Challenge",
    description:
      "Challenge your friend to do 20 push-ups right there on the spot, in front of everyone. If they fail, they have to add 5 more to the count.",
    difficulty: 1,
  },
  {
    name: "Dance Dare",
    description:
      "Ask your friend to do a quick 30-second dance routine in the middle of the room, ideally to a song of your choosing. Bonus points if it's a silly dance like the chicken dance or robot.",
    difficulty: 0,
  },
  {
    name: "Cartwheel or Somersault",
    description:
      "Have your friend perform a cartwheel or a somersault in a public area. It doesn’t have to be perfect, but they need to give it their best shot!",
    difficulty: 1,
  },
  {
    name: "Wall Sit Challenge",
    description:
      "Your friend has to do a wall sit (pretending to sit on an invisible chair against a wall) for 1 minute while singing a song of your choosing.",
    difficulty: 2,
  },
  {
    name: "Imitate a Famous Athlete",
    description:
      "Ask your friend to imitate the playing style or signature move of a famous athlete (e.g., Ronaldo’s goal celebration, LeBron’s slam dunk stance, or Serena Williams’ serve).",
    difficulty: 0,
  },
  {
    name: "Public Yoga Pose",
    description:
      "Challenge your friend to hold a yoga pose like the 'Tree Pose' or 'Downward Dog' in the middle of a busy area for 30 seconds.",
    difficulty: 1,
  },
  {
    name: "Loud Sports Chant",
    description:
      "Your friend has to lead a loud, enthusiastic sports chant or cheer in front of a group of people, as if they're at a championship game.",
    difficulty: 0,
  },
  {
    name: "Run in Place",
    description:
      "Have your friend run in place as fast as they can for 1 minute while counting out loud how many steps they’re taking.",
    difficulty: 1,
  },
  {
    name: "Jumping Jacks",
    description:
      "Ask your friend to do 30 jumping jacks in a row. If they stop, they have to start over from the beginning.",
    difficulty: 0,
  },
  {
    name: "Imitate a Sportscaster",
    description:
      "Your friend has to pretend to be a sportscaster and narrate what’s happening around them as if it’s a sports event, complete with commentary on 'player actions' and 'strategies'.",
    difficulty: 0,
  },
];

export default names;
