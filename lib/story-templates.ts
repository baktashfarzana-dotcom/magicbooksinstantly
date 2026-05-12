export type StoryTemplate = {
  id: string;
  title: string;
  lesson: string;
};

export type StoryTemplateCategory = {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  templates: StoryTemplate[];
};

function template(id: string, title: string, lesson: string): StoryTemplate {
  return { id, title, lesson };
}

export const storyTemplateCategories: StoryTemplateCategory[] = [
  {
    id: "daily-routines",
    icon: "sunrise",
    title: "Daily Routines & Habits",
    tagline: "The parent's lifesaver for everyday friction.",
    templates: [
      template("toothbrush-knight", "The Toothbrush Knight", "Dental hygiene and brushing"),
      template("great-potty-kingdom", "The Great Potty Kingdom", "Potty training"),
      template("broccoli-dinosaur", "The Broccoli Dinosaur", "Picky eating"),
      template("sleepy-starship", "The Sleepy Starship", "Staying in bed all night"),
      template("cleanup-countdown", "The Cleanup Countdown", "Cleaning up toys"),
      template("dress-myself-dragon", "The Dress-Myself Dragon", "Getting dressed independently"),
      template("bath-time-submarine", "The Bath Time Submarine", "Fear of water or bathing"),
      template("screen-time-wizard", "The Screen-Time Wizard", "Turning off the tablet calmly"),
      template("morning-express-train", "The Morning Express Train", "Getting out the door"),
      template("shoelace-secret", "The Shoelace Secret", "Confidence tying shoes"),
    ],
  },
  {
    id: "big-emotions",
    icon: "volcano",
    title: "Big Emotions & Meltdowns",
    tagline: "The counselor's corner for naming and taming feelings.",
    templates: [
      template("roaring-red-volcano", "The Roaring Red Volcano", "Anger management"),
      template("wiggle-wobble-worry-bug", "The Wiggle-Wobble Worry Bug", "Mild anxiety"),
      template("valley-of-the-deep-breath", "The Valley of the Deep Breath", "Calming down and mindfulness"),
      template("puddle-of-tears", "The Puddle of Tears", "Sadness and crying"),
      template("frustration-station", "The Frustration Station", "Things not working out"),
      template("impatient-penguin", "The Impatient Penguin", "Waiting your turn"),
      template("jealousy-jelly-monster", "The Jealousy Jelly Monster", "Envy of others"),
      template("no-ninja", "The No! Ninja", "Understanding and accepting boundaries"),
      template("tantrum-tornado", "The Tantrum Tornado", "Sudden outbursts"),
      template("overwhelmed-octopus", "The Overwhelmed Octopus", "Sensory overload and loud noises"),
    ],
  },
  {
    id: "social-skills",
    icon: "friends",
    title: "Social Skills & Friendships",
    tagline: "The playground guide for peers, empathy, and kindness.",
    templates: [
      template("playground-peacekeeper", "The Playground Peacekeeper", "Resolving peer conflicts"),
      template("shy-turtles-big-hello", "The Shy Turtle's Big Hello", "Making the first move"),
      template("interrupting-iguana", "The Interrupting Iguana", "Listening while others speak"),
      template("apology-apple", "The Apology Apple", "Saying sorry and meaning it"),
      template("sharing-safari", "The Sharing Safari", "Taking turns fairly"),
      template("bossy-bear-learns-to-ask", "The Bossy Bear Learns to Ask", "Leading without demanding"),
      template("empathy-elephant", "The Empathy Elephant", "Understanding others' feelings"),
      template("secret-rule-of-tag", "The Secret Rule of Tag", "Good sportsmanship"),
      template("lonely-little-alien", "The Lonely Little Alien", "Including left-out kids"),
      template("i-can-help-hero", "The I Can Help! Hero", "Volunteering to assist others"),
    ],
  },
  {
    id: "school-focus",
    icon: "backpack",
    title: "School & Focus",
    tagline: "The teacher's toolkit for classroom success.",
    templates: [
      template("fidgety-fox", "The Fidgety Fox", "Sitting still and focusing"),
      template("listening-ears-magic-trick", "The Listening Ears Magic Trick", "Following directions"),
      template("homework-mountain", "The Homework Mountain", "Breaking hard tasks into pieces"),
      template("i-dont-know-detective", "The I Don't Know Detective", "Asking for help"),
      template("first-day-space-launch", "The First Day Space Launch", "Preschool or kindergarten anxiety"),
      template("distraction-dragon", "The Distraction Dragon", "Staying on task"),
      template("mistake-makers-masterpiece", "The Mistake Maker's Masterpiece", "Learning from mistakes"),
      template("lunchbox-mystery", "The Lunchbox Mystery", "Eating at school independently"),
      template("substitute-teacher-surprise", "The Substitute Teacher Surprise", "Adapting to new routines"),
      template("raise-your-hand-rocket", "The Raise-Your-Hand Rocket", "Classroom etiquette"),
    ],
  },
  {
    id: "courage-fears",
    icon: "lion",
    title: "Courage & Facing Fears",
    tagline: "The mentor's push for scary new things.",
    templates: [
      template("shadows-that-danced", "The Shadows that Danced", "Fear of the dark"),
      template("doctors-office-safari", "The Doctor's Office Safari", "Shots and checkups"),
      template("dentists-magical-chair", "The Dentist's Magical Chair", "Fear of the dentist"),
      template("thunderstorm-symphony", "The Thunderstorm Symphony", "Loud weather"),
      template("bug-that-wanted-a-hug", "The Bug That Wanted a Hug", "Fear of insects or spiders"),
      template("high-dive-dolphin", "The High Dive Dolphin", "Swimming or taking the leap"),
      template("barking-dog-friendship", "The Barking Dog Friendship", "Fear of dogs"),
      template("big-stage-butterfly", "The Big Stage Butterfly", "Stage fright"),
      template("monster-under-the-beds-secret", "The Monster Under the Bed's Secret", "Imaginary fears"),
      template("brave-little-try", "The Brave Little Try", "Trying completely new things"),
    ],
  },
  {
    id: "siblings-family",
    icon: "family",
    title: "Siblings & Family Dynamics",
    tagline: "The peacekeeper for harmony under one roof.",
    templates: [
      template("new-baby-alien", "The New Baby Alien", "Welcoming a new baby sibling"),
      template("two-castle-kingdom", "The Two-Castle Kingdom", "Divorce and two homes"),
      template("he-hit-me-freeze-frame", "The He Hit Me! Freeze Frame", "Keeping hands to yourself"),
      template("middle-child-magic", "The Middle Child Magic", "Feeling seen and special"),
      template("big-sibling-guidebook", "The Big Sibling Guidebook", "Responsibility without bossing"),
      template("toy-tug-o-war", "The Toy-Tug-O-War", "Sharing with siblings"),
      template("personal-space-bubble", "The Personal Space Bubble", "Respecting rooms and belongings"),
      template("family-team-huddle", "The Family Team Huddle", "Working together on chores"),
      template("adopted-star", "The Adopted Star", "Celebrating adoption"),
      template("missing-you-mailbox", "The Missing You Mailbox", "Parent travel anxiety"),
    ],
  },
  {
    id: "growth-mindset",
    icon: "sprout",
    title: "Resilience & Growth Mindset",
    tagline: "The coach's playbook for grit and recovery.",
    templates: [
      template("not-yet-yeti", "The Not Yet Yeti", "The power of yet"),
      template("bicycle-balance-magic", "The Bicycle Balance Magic", "Getting back up after falling"),
      template("puzzled-panther", "The Puzzled Panther", "Sticking with frustrating tasks"),
      template("losing-team-trophy", "The Losing-Team Trophy", "Losing gracefully"),
      template("criticized-canvas", "The Criticized Canvas", "Handling negative feedback"),
      template("i-cant-can", "The I Can't Can", "Self-belief and efficacy"),
      template("perfect-practice-pirate", "The Perfect Practice Pirate", "Hard work over perfection"),
      template("broken-tower", "The Broken Tower", "Rebuilding after failure"),
      template("optimism-ostrich", "The Optimism Ostrich", "Looking on the bright side"),
      template("goal-setting-gazelle", "The Goal-Setting Gazelle", "Working consistently toward a prize"),
    ],
  },
  {
    id: "health-boundaries",
    icon: "shield",
    title: "Health, Bodies & Boundaries",
    tagline: "The caregiver's guide for safety and autonomy.",
    templates: [
      template("my-body-is-my-castle-knight", "The My Body is My Castle Knight", "Body autonomy and consent"),
      template("sneezing-samurai", "The Sneezing Samurai", "Covering coughs and germ safety"),
      template("magic-band-aid", "The Magic Band-Aid", "Small scrapes and pain"),
      template("sleepy-time-battery", "The Sleepy-Time Battery", "Why sleep matters"),
      template("sugar-monsters-maze", "The Sugar Monster's Maze", "Healthy eating choices"),
      template("water-gulping-whale", "The Water Gulping Whale", "Hydration"),
      template("glasses-of-truth", "The Glasses of Truth", "Confidence getting glasses"),
      template("hearing-aid-hero", "The Hearing Aid Hero", "Normalizing hearing aids"),
      template("unwanted-hug", "The Unwanted Hug", "Saying no to unwanted affection"),
      template("secret-keeping-safe", "The Secret-Keeping Safe", "Good secrets and bad secrets"),
    ],
  },
  {
    id: "life-changes-grief",
    icon: "butterfly",
    title: "Major Life Changes & Grief",
    tagline: "The safe harbor for delicate transitions.",
    templates: [
      template("moving-truck-magic-carpet", "The Moving Truck Magic Carpet", "Moving to a new house"),
      template("goodbye-balloon", "The Goodbye Balloon", "Loss of a pet"),
      template("empty-chair", "The Empty Chair", "Loss of a loved one"),
      template("new-neighborhood-navigator", "The New Neighborhood Navigator", "Making friends in a new place"),
      template("big-kid-bed-adventure", "The Big Kid Bed Adventure", "Moving from crib to bed"),
      template("binky-fairys-visit", "The Binky Fairy's Visit", "Giving up the pacifier"),
      template("changing-seasons", "The Changing Seasons", "Understanding life changes"),
      template("potty-accident", "The Potty Accident", "Regression and mistakes"),
      template("missing-friend", "The Missing Friend", "A best friend moving away"),
      template("step-parent-bridge", "The Step-Parent Bridge", "Blended family transition"),
    ],
  },
  {
    id: "imagination-life-skills",
    icon: "tools",
    title: "Imagination & Life Skills",
    tagline: "The fun aunt or uncle for practical skills.",
    templates: [
      template("boredom-buster-blueprint", "The Boredom Buster Blueprint", "Independent play"),
      template("allowance-architect", "The Allowance Architect", "Money and saving"),
      template("grocery-store-guide", "The Grocery Store Guide", "Helping and behaving in public"),
      template("lost-in-the-store-protocol", "The Lost-in-the-Store Protocol", "What to do if separated from parents"),
      template("stranger-danger-shield", "The Stranger Danger Shield", "Safe adults and tricky people"),
      template("gratitude-jar-genie", "The Gratitude Jar Genie", "Saying thank you"),
      template("pet-caretakers-promise", "The Pet Caretaker's Promise", "Pet responsibility"),
      template("curiosity-compass", "The Curiosity Compass", "Asking good questions"),
      template("im-sorry-i-broke-it-fixer", "The I'm Sorry I Broke It Fixer", "Accountability for accidents"),
      template("everyday-magic-maker", "The Everyday Magic Maker", "Joy in ordinary days"),
    ],
  },
];

export const storyTemplateCount = storyTemplateCategories.reduce(
  (total, category) => total + category.templates.length,
  0,
);
