const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Resource = require('../models/Resource');
const Exercise = require('../models/Exercise');

// Sample data
const resources = [
  {
    title: 'National Suicide Prevention Lifeline',
    description: 'The National Suicide Prevention Lifeline is a national network of local crisis centers that provides free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week.',
    category: 'Hotline',
    contactInfo: {
      phone: '1-800-273-8255',
      website: 'https://suicidepreventionlifeline.org/',
    },
    isVerified: true
  },
  {
    title: 'Crisis Text Line',
    description: 'Crisis Text Line is a global not-for-profit organization providing free mental health texting service through confidential crisis intervention via SMS message.',
    category: 'Hotline',
    contactInfo: {
      phone: 'Text HOME to 741741',
      website: 'https://www.crisistextline.org/',
    },
    isVerified: true
  },
  {
    title: 'BetterHelp Online Therapy',
    description: 'BetterHelp is an online counseling platform that matches you with licensed, accredited therapists who can help with depression, anxiety, relationships, and more.',
    category: 'Online Platform',
    contactInfo: {
      website: 'https://www.betterhelp.com/',
    },
    isVerified: true
  },
  {
    title: 'Talkspace Online Therapy',
    description: 'Talkspace is an online therapy platform that connects users with licensed therapists through text, audio, and video messaging.',
    category: 'Online Platform',
    contactInfo: {
      website: 'https://www.talkspace.com/',
    },
    isVerified: true
  },
  {
    title: 'Psychology Today Therapist Directory',
    description: 'Find detailed professional listings for psychologists, psychiatrists, therapists, counselors, group therapy and treatment centers in the United States and Canada.',
    category: 'Therapist',
    contactInfo: {
      website: 'https://www.psychologytoday.com/us/therapists',
    },
    isVerified: true
  },
  {
    title: 'National Alliance on Mental Illness (NAMI)',
    description: 'NAMI is the nation\'s largest grassroots mental health organization dedicated to building better lives for the millions of Americans affected by mental illness.',
    category: 'Support Group',
    contactInfo: {
      phone: '1-800-950-6264',
      website: 'https://www.nami.org/',
    },
    isVerified: true
  },
  {
    title: 'Mental Health America',
    description: 'Mental Health America is the nation\'s leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.',
    category: 'Support Group',
    contactInfo: {
      website: 'https://www.mhanational.org/',
    },
    isVerified: true
  },
  {
    title: 'Anxiety and Depression Association of America',
    description: 'ADAA is an international nonprofit organization dedicated to the prevention, treatment, and cure of anxiety, depression, OCD, PTSD, and co-occurring disorders.',
    category: 'Support Group',
    contactInfo: {
      website: 'https://adaa.org/',
    },
    isVerified: true
  }
];

const exercises = [
  {
    title: 'Mindful Breathing',
    description: 'A simple breathing exercise to help calm your mind and reduce stress. This exercise can be done anywhere, anytime you feel stressed or anxious.',
    category: 'Breathing',
    duration: 5,
    steps: [
      'Find a comfortable seated position with your back straight.',
      'Close your eyes or maintain a soft gaze.',
      'Breathe in slowly through your nose for a count of 4.',
      'Hold your breath for a count of 2.',
      'Exhale slowly through your mouth for a count of 6.',
      'Repeat this pattern for 5 minutes.'
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Helps regulate emotions',
      'Lowers blood pressure'
    ]
  },
  {
    title: 'Body Scan Meditation',
    description: 'A meditation practice that involves systematically scanning your body from head to toe, bringing awareness to each part and noticing any sensations without judgment.',
    category: 'Meditation',
    duration: 15,
    steps: [
      'Lie down in a comfortable position or sit in a chair with your feet on the ground.',
      'Close your eyes and take a few deep breaths.',
      'Begin by bringing awareness to your toes, noticing any sensations.',
      'Slowly move your attention up through your feet, ankles, calves, and so on.',
      'For each body part, notice any sensations without trying to change them.',
      'If your mind wanders, gently bring it back to the body part you were focusing on.',
      'Continue until you\'ve scanned your entire body up to the top of your head.'
    ],
    benefits: [
      'Increases body awareness',
      'Reduces physical tension',
      'Improves sleep quality',
      'Helps identify stress responses in the body'
    ]
  },
  {
    title: '5-4-3-2-1 Grounding Technique',
    description: 'A grounding exercise that uses your five senses to help bring you back to the present moment when you\'re feeling anxious or overwhelmed.',
    category: 'Mindfulness',
    duration: 5,
    steps: [
      'Look around and name 5 things you can see.',
      'Notice 4 things you can feel or touch (like the texture of your clothes).',
      'Listen for 3 things you can hear.',
      'Identify 2 things you can smell (or like the smell of).',
      'Name 1 thing you can taste (or like the taste of).',
      'Take a deep breath and notice how you feel.'
    ],
    benefits: [
      'Quickly reduces anxiety',
      'Helps during panic attacks',
      'Brings awareness to the present moment',
      'Easy to remember and use anywhere'
    ]
  },
  {
    title: 'Progressive Muscle Relaxation',
    description: 'A technique that involves tensing and then releasing each muscle group in your body, helping to reduce physical tension and mental stress.',
    category: 'Physical',
    duration: 15,
    steps: [
      'Find a quiet place and sit or lie down comfortably.',
      'Take a few deep breaths to begin.',
      'Start with your feet: tense the muscles as tightly as you can for 5 seconds.',
      'Release the tension and notice how your muscles feel as they relax.',
      'Move up to your calves, then thighs, and continue up through your body.',
      'For each muscle group, tense for 5 seconds, then relax for 10-15 seconds.',
      'Pay attention to the difference between tension and relaxation.',
      'Complete the exercise by tensing and relaxing your facial muscles.'
    ],
    benefits: [
      'Reduces physical tension',
      'Decreases anxiety and stress',
      'Improves sleep quality',
      'Increases awareness of body sensations'
    ]
  },
  {
    title: 'Loving-Kindness Meditation',
    description: 'A meditation practice that involves sending positive wishes to yourself and others, cultivating feelings of love, kindness, and compassion.',
    category: 'Meditation',
    duration: 10,
    steps: [
      'Sit comfortably with your eyes closed or in a soft gaze.',
      'Begin by focusing on your breath for a few moments.',
      'Bring to mind someone you care deeply about.',
      'Silently repeat phrases like: "May you be happy. May you be healthy. May you be safe. May you live with ease."',
      'Next, direct these wishes toward yourself.',
      'Then extend these wishes to a neutral person (someone you neither like nor dislike).',
      'If you feel ready, extend these wishes to someone difficult in your life.',
      'Finally, extend these wishes to all beings everywhere.'
    ],
    benefits: [
      'Increases positive emotions',
      'Reduces negative emotions toward self and others',
      'Builds compassion and empathy',
      'Improves relationships'
    ]
  },
  {
    title: 'Thought Record Exercise',
    description: 'A cognitive-behavioral technique that helps you identify and challenge negative thought patterns that contribute to anxiety and depression.',
    category: 'Cognitive',
    duration: 15,
    steps: [
      'Identify a situation that triggered negative emotions.',
      'Write down the automatic thoughts that came to mind.',
      'Rate how strongly you believed these thoughts (0-100%).',
      'Identify the emotions these thoughts triggered and rate their intensity.',
      'Look for evidence that supports these thoughts.',
      'Look for evidence that contradicts these thoughts.',
      'Develop a more balanced alternative thought.',
      'Rate how strongly you believe this new thought.',
      'Notice how your emotions change with this new perspective.'
    ],
    benefits: [
      'Challenges negative thinking patterns',
      'Reduces symptoms of anxiety and depression',
      'Increases awareness of thought-emotion connections',
      'Develops more balanced thinking'
    ]
  },
  {
    title: 'Gratitude Practice',
    description: 'A simple exercise where you reflect on and write down things you\'re grateful for, helping to shift focus from negative to positive aspects of life.',
    category: 'Mindfulness',
    duration: 5,
    steps: [
      'Find a quiet place and take a few deep breaths.',
      'Think about 3-5 things you\'re grateful for today.',
      'Write them down, being as specific as possible.',
      'For each item, reflect on why you\'re grateful for it.',
      'Notice how you feel as you focus on these positive aspects.',
      'Try to practice regularly, ideally at the same time each day.'
    ],
    benefits: [
      'Increases positive emotions',
      'Reduces negative emotions',
      'Improves sleep quality',
      'Builds resilience against stress'
    ]
  },
  {
    title: 'Box Breathing',
    description: 'A simple breathing technique used by Navy SEALs to calm the nervous system and improve focus under stress.',
    category: 'Breathing',
    duration: 5,
    steps: [
      'Sit upright in a comfortable position.',
      'Inhale slowly through your nose for a count of 4.',
      'Hold your breath for a count of 4.',
      'Exhale slowly through your mouth for a count of 4.',
      'Hold your breath again for a count of 4.',
      'Repeat this pattern for 5 minutes or until you feel calm.'
    ],
    benefits: [
      'Quickly reduces stress',
      'Improves concentration',
      'Regulates the autonomic nervous system',
      'Can be done discreetly anywhere'
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Resource.deleteMany({});
    await Exercise.deleteMany({});
    
    // Insert seed data
    await Resource.insertMany(resources);
    await Exercise.insertMany(exercises);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
