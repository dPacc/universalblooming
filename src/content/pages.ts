import type { Section, Faq } from "./types";

/* ------------------------------------------------------------------ */
/* Admissions                                                          */
/* ------------------------------------------------------------------ */

export const admissions: {
  quickAnswer: string;
  steps: { title: string; text: string; icon: string }[];
  documents: string[];
  sections: Section[];
  faqs: Faq[];
} = {
  quickAnswer:
    "Joining Universal Blooming takes five friendly steps: **send us an enquiry**, **visit** to meet the teachers and see the classrooms, complete the **registration form and documents**, agree a gentle **settling-in plan** together, then celebrate your child's **first day**. Choose [Preschool](/programs/preschool) (3 to 6 years), [Day Care](/programs/day-care) or [After School Activities](/programs/after-school) (3+ years), and we'll guide you through everything else.",
  steps: [
    {
      title: "Say hello",
      text: "Send us an enquiry through the form, WhatsApp or email. Tell us your child's age and the program you're curious about, and we'll get back to you to arrange a visit.",
      icon: "💬",
    },
    {
      title: "Visit and meet us",
      text: "Come and see the classrooms, meet the teachers and watch play-based learning in action. Bring your child and every question you have.",
      icon: "🏫",
    },
    {
      title: "Registration form and documents",
      text: "Fill in the registration form and share the documents on our checklist, such as your child's passport, visa or Emirates ID, birth certificate and vaccination record.",
      icon: "📋",
    },
    {
      title: "Plan the settling-in",
      text: "Together we agree a gentle, step-by-step settling-in plan that fits your child, from short first visits to a full session.",
      icon: "🤗",
    },
    {
      title: "First day of blooming",
      text: "Your child joins their class, makes new friends and starts to bloom. We keep you updated so you feel part of every new discovery.",
      icon: "🌸",
    },
  ],
  documents: [
    "Completed registration form (child's name, nationality, date of birth, address and phone numbers)",
    "Copy of your child's passport and UAE residence visa (or Emirates ID details where the visa sticker is no longer issued)",
    "Copy of your child's Emirates ID (please bring the original to show at registration)",
    "Copy of your child's birth certificate (attested or translated if issued outside the UAE, where required)",
    "Vaccination record (UAE immunisation card or equivalent)",
    "Health and medical form, including allergies, medication and your child's doctor or paediatrician details",
    "Recent passport-size photos of your child",
    "Copies of both parents' passports, visas and Emirates IDs",
    "Emergency contacts and a list of adults authorised to collect your child",
    "Any other documents we request, which we'll confirm on your visit",
  ],
  sections: [
    {
      id: "what-happens-on-a-visit",
      title: "What happens when you visit Universal Blooming?",
      blocks: [
        {
          type: "p",
          text: "A visit is the best way to feel whether we're the right fit for your family. You'll see the classrooms, meet the teachers and watch children at play. There's no pressure and no script: it's simply a relaxed chance to get to know us, and for us to get to know you and your child.",
        },
        {
          type: "p",
          text: "We'll talk about your child's personality, routines and interests, and which program fits best: [Preschool](/programs/preschool) for 3 to 6 year olds, [Day Care](/programs/day-care) for little ones who aren't yet ready for preschool, or [After School Activities](/programs/after-school) for children aged 3 and up, including Right Brain Activation classes for memory, focus, visualisation and creativity. We'll also share practical details such as the current fee sheet, session options and availability, so you leave with clear answers.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Bring your little one",
          text: "Children are very welcome on visits. Watching how your child reacts to the space, the toys and the teachers often tells you more than any brochure.",
        },
      ],
    },
    {
      id: "questions-to-ask",
      title: "What questions should you ask us?",
      blocks: [
        {
          type: "p",
          text: "Ask us anything. We're happy to answer every question clearly. Here is a list to get you started, adapted from our full [guide to choosing a preschool in the UAE](/parents-guide/how-to-choose-a-preschool-uae):",
        },
        {
          type: "checklist",
          items: [
            "How does a typical day look for my child's age group?",
            "How many children are in each room, and how many teachers?",
            "What qualifications and training do your teachers have?",
            "How do you settle new children, and how will I know how my child is doing?",
            "What do the fees include, and are there any extras such as meals, uniform or activities?",
            "What are your safety, illness and medication policies?",
            "How do you support toilet training, naps and eating?",
            "How do you communicate with parents during the day?",
          ],
        },
        {
          type: "p",
          text: "For a deeper look at fees and extras, read our [preschool fees guide](/parents-guide/preschool-fees-uae). If you're still comparing styles of early learning, our guide to [preschool curricula in the UAE](/parents-guide/preschool-curriculum-uae) explains how play-based learning compares with EYFS, Montessori and Reggio Emilia.",
        },
      ],
    },
    {
      id: "settling-in",
      title: "How do you help children settle in?",
      blocks: [
        {
          type: "p",
          text: "Starting preschool or day care is a big step, for children and parents alike. We believe every child is unique, so there is no one-size-fits-all timetable. Some children wave goodbye on day two; others need a little longer, and that's perfectly fine.",
        },
        {
          type: "p",
          text: "Together we plan short first sessions, often with you nearby, and gradually build up the time as your child grows more confident. A familiar comfort toy, a consistent goodbye routine and a warm teacher who gets to know your child's likes and dislikes all help. We keep you updated so you're never left wondering.",
        },
        {
          type: "ol",
          items: [
            "**Before the first day:** we learn about your child's routines, favourite things and any worries.",
            "**First sessions:** short, happy visits, often with a parent close by.",
            "**Building up:** longer sessions and short goodbyes as confidence grows.",
            "**Settled:** your child joins the full session and starts to bloom.",
          ],
        },
        {
          type: "p",
          text: "Our [settling-into-preschool guide](/parents-guide/settling-into-preschool) has practical tips for separation anxiety, including what to say at drop-off and how to prepare at home.",
        },
      ],
    },
    {
      id: "when-to-apply",
      title: "When should you apply?",
      blocks: [
        {
          type: "p",
          text: "The simple answer: as soon as you know when you'd like your child to start. Enquiring early gives you time to visit, collect documents and plan a relaxed settling-in. Many families start in September, but children can join us at other times of year too, depending on availability.",
        },
        {
          type: "p",
          text: "If you're planning ahead for school, age matters. From the 2026-27 academic year the UAE uses a **31 December cut-off** for FS1, KG1 and Grade 1 in September-start schools. Our guide on [what age a child can start preschool in the UAE](/parents-guide/preschool-age-uae) explains which year group your child fits and the rules emirate by emirate.",
        },
        {
          type: "callout",
          tone: "note",
          title: "Wondering if your child is ready?",
          text: "Take our two-minute [preschool readiness quiz](/tools/preschool-readiness-quiz) or browse the [school readiness checklist](/parents-guide/school-readiness-checklist). Then [book a visit](/contact) and we'll talk it through together.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Can my child join in the middle of the year?",
      a: "Often, yes. Children can join at different times of year depending on availability in their age group. Get in touch and we'll confirm current places on your visit or on WhatsApp.",
    },
    {
      q: "Do you have a waiting list?",
      a: "Availability depends on the program and your child's age group. If a class is full, we'll explain your options and how any waiting list works when you enquire or visit.",
    },
    {
      q: "Can my child have a trial day before joining?",
      a: "We know a gentle start matters. Ask us about trial or taster sessions when you visit and we'll confirm what's possible for your child's age group. Our settling-in plan also starts with short, happy sessions.",
    },
    {
      q: "What should I bring on the visit?",
      a: "Just yourself, your child and your questions. It helps to jot down your child's routines, any allergies or health needs, and the start date you have in mind. Our [questions to ask on a preschool visit](/parents-guide/how-to-choose-a-preschool-uae) list is a handy prompt.",
    },
    {
      q: "Can siblings join together?",
      a: "Absolutely, we love welcoming brothers and sisters. Siblings of different ages may join different programs, for example one in [Day Care](/programs/day-care) and one in [Preschool](/programs/preschool). Ask us about sibling availability and any sibling arrangements on your visit.",
    },
    {
      q: "What documents do I need to register?",
      a: "Usually your child's passport and visa or Emirates ID, birth certificate, vaccination record and health form, plus parents' IDs and emergency contacts. See our checklist above or the full [registration documents guide](/parents-guide/preschool-registration-documents-uae).",
    },
    {
      q: "What age can my child start?",
      a: "Our [Preschool](/programs/preschool) is for 3 to 6 year olds, [Day Care](/programs/day-care) cares for little ones who aren't yet ready for preschool, and [After School Activities](/programs/after-school) are for children aged 3 and up. Our [preschool age guide](/parents-guide/preschool-age-uae) explains school year groups too.",
    },
    {
      q: "How long does settling in take?",
      a: "Every child is different. Some settle within a few days, others take a couple of weeks. We build up gradually and keep you informed. Read our [settling-in guide](/parents-guide/settling-into-preschool) for tips.",
    },
    {
      q: "How do I book a visit?",
      a: "Send us a message through the [contact page](/contact), on WhatsApp or by email, and we'll arrange a time that suits you.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const about: {
  intro: string[];
  mission: string;
  vision: string;
  values: { title: string; text: string; icon: string }[];
  founderBio: string[];
  bloomi: { intro: string; facts: { q: string; a: string }[] };
  approach: Section[];
  faqs: Faq[];
} = {
  intro: [
    "Universal Blooming is a play-based preschool, day care and after school activities centre in the UAE, where young minds bloom. We care for and teach children from their first steps into learning, through [Preschool](/programs/preschool) for 3 to 6 year olds, loving [Day Care](/programs/day-care) for little ones, and [After School Activities](/programs/after-school) for children aged 3 and up.",
    "We believe **every child is unique**. Each one arrives with their own pace, personality and way of seeing the world, so we meet them where they are and help them grow from there. Some children bloom through painting and building, others through stories, songs or running around outside, and all of those paths are welcome here.",
    "Every day is filled with [creative arts](/activities/creative-arts), [storytime](/activities/storytime-and-phonics), [outdoor play](/activities/outdoor-play), [music](/activities/music-and-movement), [little science experiments](/activities/little-scientists) and plenty of kindness. Children learn by doing, and they grow in confidence because they feel safe, loved and heard.",
  ],
  mission:
    "To create a joyful learning space where children can explore, discover, and grow into confident learners.",
  vision:
    "To nurture young minds and help every child bloom with knowledge, creativity, and happiness.",
  values: [
    {
      title: "Every child is unique",
      text: "We follow each child's pace and interests, because no two flowers bloom the same way.",
      icon: "🌼",
    },
    {
      title: "Joy in learning",
      text: "Laughter, play and wonder are how little ones learn best, so we make learning fun.",
      icon: "😊",
    },
    {
      title: "Curiosity first",
      text: "We welcome every \"why?\" and give children room to explore, experiment and discover.",
      icon: "🔍",
    },
    {
      title: "Kindness and respect",
      text: "Children learn to share, take turns and care for each other, and we model that every day.",
      icon: "💛",
    },
    {
      title: "Safe and caring",
      text: "A warm, secure place where children feel loved is the soil everything else grows from.",
      icon: "🛡️",
    },
    {
      title: "Partnership with parents",
      text: "You know your child best. We work together with you so home and our classrooms feel connected.",
      icon: "🤝",
    },
  ],
  founderBio: [
    "Our founder started Universal Blooming around the idea that every child carries a seed of greatness. If every child already carries something great inside, our job is not to fill them up or hurry them along. It is to notice what is growing, give it room and keep it well tended, day after day.",
    "For our founder, a preschool is a garden, not a factory. Children are not rushed or compared; they are given warmth, encouragement and plenty of chances to play, try and discover. With love and care as the foundation, and joyful learning as the sunshine, every child can grow into a confident learner in their own time.",
  ],
  bloomi: {
    intro:
      "**Bloomi** is our cheerful flower sprout, with eight rainbow petals, a sunny smile, two leafy arms perfect for waving and a shiny star badge. Legend has it that Bloomi grows a brand-new petal every time a child learns something new, which means Bloomi is very, very busy at Universal Blooming. You'll spot Bloomi cheering children on in the classroom, the garden of ideas and everywhere a new discovery happens.",
    facts: [
      {
        q: "Why does Bloomi have eight petals?",
        a: "Each petal is one of the eight colours of the Universal Blooming logo, from pink and orange to sunny yellow, leafy green and sky blue. Together they show that every child brings their own colour to our garden.",
      },
      {
        q: "What is Bloomi's favourite activity?",
        a: "Storytime! Bloomi loves curling up with a picture book, and gets especially excited when the story has a garden, a rainbow or a very hungry caterpillar in it.",
      },
      {
        q: "What does Bloomi's star badge mean?",
        a: "The star is for trying. Bloomi earned it for having a go at something tricky, and believes every child deserves a star for being brave and trying something new.",
      },
      {
        q: "What does Bloomi eat for breakfast?",
        a: "Sunshine and a big glass of water, of course. Bloomi says it's the best way to grow tall and strong, and always reminds friends to drink their water too.",
      },
      {
        q: "What is Bloomi's favourite word?",
        a: "\"Why?\" Bloomi thinks the best adventures start with a question, which is why Bloomi loves our [little scientists](/activities/little-scientists) sessions.",
      },
    ],
  },
  approach: [
    {
      id: "play-based-approach",
      title: "What does play-based learning mean at Universal Blooming?",
      blocks: [
        {
          type: "p",
          text: "Play is how young children make sense of the world. When a toddler stacks blocks, pours water or pretends to cook dinner, they are building early maths, language, problem-solving and social skills. Our teachers set up rich, inviting activities and join in the play, gently guiding children towards the next step.",
        },
        {
          type: "p",
          text: "A day might include painting and crafts in [creative arts](/activities/creative-arts), building vocabulary in [storytime](/activities/storytime-and-phonics), running and climbing during [outdoor play](/activities/outdoor-play), and learning to share and take turns through [social and emotional skills](/activities/social-and-emotional-skills). Curious about how play-based learning compares with other approaches? Our [preschool curriculum guide](/parents-guide/preschool-curriculum-uae) explains the differences.",
        },
      ],
    },
    {
      id: "partnership-with-parents",
      title: "How do we work with parents?",
      blocks: [
        {
          type: "p",
          text: "Parents are a child's first teachers, and we see ourselves as your partners. From the first visit we want to understand your child's routines, likes and worries, so that time with us feels like a natural extension of home.",
        },
        {
          type: "p",
          text: "We share how your child is getting on, celebrate new milestones with you and welcome your ideas and questions at any time. When children see the adults in their lives working together, they feel secure, and secure children are free to explore and bloom. Our [child development milestones guide](/parents-guide/child-development-milestones) is a helpful companion for the journey.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Who founded Universal Blooming?",
      a: "Universal Blooming was founded by our Principal, who believes every child carries a seed of greatness that grows through love, care and joyful learning.",
    },
    {
      q: "What makes Universal Blooming different?",
      a: "We are play-based and child-centred. We believe every child is unique, so we follow each child's pace and interests through arts, stories, music, outdoor play, science and social games.",
    },
    {
      q: "Who is Bloomi?",
      a: "Bloomi is our flower sprout mascot with eight rainbow petals, a sunny face and a star badge. Legend says Bloomi grows a new petal every time a child learns something new.",
    },
    {
      q: "Which ages do you welcome?",
      a: "Children from 3 to 6 years in [Preschool](/programs/preschool), little ones who aren't yet ready for preschool in [Day Care](/programs/day-care), and children from 3 years and up in [After School Activities](/programs/after-school), including Right Brain Activation classes that build memory, focus, visualisation and creativity.",
    },
    {
      q: "Can I visit before deciding?",
      a: "Of course. We'd love to show you around. See our [admissions page](/admissions) for how visits work, or [contact us](/contact) to book a time.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* FAQ page                                                            */
/* ------------------------------------------------------------------ */

export const faqPage: { group: string; faqs: Faq[] }[] = [
  {
    group: "Programs & ages",
    faqs: [
      {
        q: "What programs does Universal Blooming offer?",
        a: "Three: [Preschool](/programs/preschool) for 3 to 6 year olds, [Day Care](/programs/day-care) for little ones who aren't yet ready for preschool, and [After School Activities](/programs/after-school) for children aged 3 and up. See all [programs](/programs) side by side.",
      },
      {
        q: "What is the difference between day care, preschool and kindergarten?",
        a: "In the UAE the words overlap. Day care focuses on caring for younger children through the day, preschool focuses on getting ready for school, and \"early years\" is the umbrella term for care and learning before school. Our guide on [day care vs preschool vs kindergarten](/parents-guide/daycare-vs-preschool-vs-kindergarten) explains when each fits.",
      },
      {
        q: "Which program is right for my child's age?",
        a: "As a guide: 3 to 6 year olds join [Preschool](/programs/preschool) and can add [After School Activities](/programs/after-school) too; younger children join [Day Care](/programs/day-care); over 6, [After School Activities](/programs/after-school). Every child is unique, so we'll help you decide on your visit. Our [preschool age guide](/parents-guide/preschool-age-uae) also explains school year groups.",
      },
      {
        q: "What is a play-based approach?",
        a: "Children learn through hands-on play guided by caring teachers: painting, stories, music, building, outdoor games and simple science. Read how it compares with EYFS, Montessori and Reggio Emilia in our [preschool curriculum guide](/parents-guide/preschool-curriculum-uae).",
      },
      {
        q: "What activities will my child do?",
        a: "Our days include [creative arts](/activities/creative-arts), [storytime and phonics](/activities/storytime-and-phonics), [outdoor play](/activities/outdoor-play), [music and movement](/activities/music-and-movement), [sports and games](/activities/sports-and-games), [little scientists](/activities/little-scientists) and [social and emotional skills](/activities/social-and-emotional-skills). Browse all [activities](/activities).",
      },
      {
        q: "What do after-school activities involve?",
        a: "Children aged 3 and up explore hobbies and discover new talents after class, including Right Brain Activation classes: fun memory, focus, visualisation and creativity activities. Our [after-school activities guide](/parents-guide/after-school-activities-guide) helps you choose well, and the [After School Activities program page](/programs/after-school) has the details.",
      },
    ],
  },
  {
    group: "Admissions & documents",
    faqs: [
      {
        q: "How do I enrol my child?",
        a: "Enquire, visit, complete the registration form and documents, plan the settling-in, then enjoy the first day. The full process is on our [admissions page](/admissions).",
      },
      {
        q: "What documents do I need?",
        a: "Typically your child's passport and visa or Emirates ID, birth certificate, vaccination record, health form and photos, plus parents' IDs and emergency contacts. See the full [registration documents checklist](/parents-guide/preschool-registration-documents-uae).",
      },
      {
        q: "Can my child join mid-year?",
        a: "Often, yes, depending on availability in your child's age group. [Contact us](/contact) and we'll confirm current places.",
      },
      {
        q: "What age can my child start FS1 or KG1?",
        a: "From the 2026-27 academic year, September-start schools use a 31 December cut-off: FS1 (Pre-KG) at 3 and FS2 (KG1) at 4. Read the details, including how to work out your child's year group, in our [preschool age guide](/parents-guide/preschool-age-uae).",
      },
      {
        q: "Can I visit before registering?",
        a: "Yes, and we recommend it. Visiting lets you see the classrooms, meet the teachers and ask every question. Use our [questions to ask on a visit](/parents-guide/how-to-choose-a-preschool-uae) list and [book a visit](/contact).",
      },
      {
        q: "Is my child ready for preschool?",
        a: "Readiness is about more than age. Try our [preschool readiness quiz](/tools/preschool-readiness-quiz) and read the [school readiness checklist](/parents-guide/school-readiness-checklist). Then come and visit so we can talk it through.",
      },
    ],
  },
  {
    group: "Fees & payments",
    faqs: [
      {
        q: "How much are Universal Blooming's fees?",
        a: "Fees depend on the program and schedule you choose. We share our current fee sheet on your visit or on WhatsApp. For context on what UAE families typically pay, see our [preschool fees guide](/parents-guide/preschool-fees-uae).",
      },
      {
        q: "What do the fees include?",
        a: "Please ask us for the current breakdown, including whether items like meals, uniform or trips are included or charged separately. Our [fees guide](/parents-guide/preschool-fees-uae) lists the common extras worth asking about at any preschool or day care.",
      },
      {
        q: "Is there a registration fee or deposit?",
        a: "We'll explain any registration fee or deposit clearly on your visit, before you commit. [Contact us](/contact) if you'd like the details in advance.",
      },
      {
        q: "Can I pay monthly or termly?",
        a: "Ask us about the payment options available for your chosen program. We'll confirm them on your visit or on WhatsApp.",
      },
      {
        q: "Are there sibling discounts?",
        a: "Ask us on your visit about any arrangements for siblings. We'll give you clear, up-to-date information.",
      },
    ],
  },
  {
    group: "Daily life & care",
    faqs: [
      {
        q: "What does a typical day look like?",
        a: "A mix of free play, group time, creative activities, stories, songs, outdoor play, snacks and rest, adjusted to each age group. See example days on the [Preschool](/programs/preschool) and [Day Care](/programs/day-care) pages.",
      },
      {
        q: "What are your opening hours and session options?",
        a: "Please ask us for our current hours and session options, as they can vary by program. We'll confirm them on your visit or on WhatsApp.",
      },
      {
        q: "How do you help children settle in?",
        a: "Gently and step by step. We start with short sessions, build up as your child grows confident and keep you updated. Our [settling-in guide](/parents-guide/settling-into-preschool) has tips for separation anxiety.",
      },
      {
        q: "Do you support toilet training?",
        a: "We work together with parents so toilet training feels consistent between home and our classrooms. Ask us about toilet-training expectations for [Preschool](/programs/preschool) and [Day Care](/programs/day-care) on your visit.",
      },
      {
        q: "What about meals and naps?",
        a: "We'll talk through meals, snacks and rest times for your child's age group on your visit, including any dietary needs or allergies. Share your child's routine with us and we'll help keep it familiar.",
      },
      {
        q: "How will I know how my child is doing?",
        a: "We keep in close touch with parents and share your child's progress and new discoveries. To follow development at home, see our [child development milestones guide](/parents-guide/child-development-milestones).",
      },
    ],
  },
  {
    group: "Health & safety",
    faqs: [
      {
        q: "How do you keep children safe?",
        a: "Children's safety and wellbeing come first in everything we do. Ask us about our safety, supervision and collection procedures on your visit, and see what to look for at any early childhood centre in our [how to choose a preschool guide](/parents-guide/how-to-choose-a-preschool-uae).",
      },
      {
        q: "What happens if my child is unwell?",
        a: "Please keep your child at home if they are unwell, and let us know. We'll share our illness policy, including when children can return, when you register.",
      },
      {
        q: "Can you give my child medication?",
        a: "Ask us about our medication policy on your visit. We'll explain what information and permission we need from parents.",
      },
      {
        q: "How do you handle allergies?",
        a: "Tell us about any allergies or dietary needs on the health form and in person. We'll talk through how we manage them for your child. See the [registration documents guide](/parents-guide/preschool-registration-documents-uae) for the health information early years settings typically ask for.",
      },
      {
        q: "Who can collect my child?",
        a: "Only the adults you authorise at registration. Ask us about our collection procedure, including what to do if someone new is picking up.",
      },
      {
        q: "Do children need vaccinations to join?",
        a: "UAE preschools and day care centres typically ask for your child's vaccination record at registration. Bring it along, and ask us if you have any questions about your child's health records. See our [documents checklist](/admissions).",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Preschool readiness quiz                                             */
/* ------------------------------------------------------------------ */

export const readinessQuiz: {
  seoTitle: string;
  seoDescription: string;
  quickAnswer: string;
  questions: { q: string; area: string; options: { label: string; points: 0 | 1 | 2 }[] }[];
  results: { min: number; title: string; text: string; mood: "cheer" | "happy" | "think" }[];
  sections: Section[];
  faqs: Faq[];
} = {
  seoTitle: "Is My Child Ready for Preschool? Free Quiz",
  seoDescription:
    "Answer 10 quick questions on self-care, language, play and routines to see how ready your 2.5 to 4 year old is for preschool, plus friendly tips.",
  quickAnswer:
    "Preschool readiness is less about age and more about everyday skills: coping with short separations, communicating needs, playing alongside others, following simple routines and trying to do things independently. Most children are **still growing** in some of these areas when they start, and that's normal. Answer 10 quick questions to see where your child is blooming and where to help at home.",
  questions: [
    {
      q: "Can your child do simple self-care tasks, like washing hands or putting on shoes with a little help?",
      area: "Self-care",
      options: [
        { label: "Not yet, I do most of it", points: 0 },
        { label: "Sometimes, with lots of help", points: 1 },
        { label: "Yes, usually with just a little help", points: 2 },
      ],
    },
    {
      q: "How does your child cope when you leave them with another trusted adult for a short time?",
      area: "Separation",
      options: [
        { label: "Very upset, it's hard for them", points: 0 },
        { label: "Upset at first, then settles", points: 1 },
        { label: "Usually happy after a quick goodbye", points: 2 },
      ],
    },
    {
      q: "Can your child tell an adult what they need, using words, short phrases or gestures?",
      area: "Language",
      options: [
        { label: "Not yet, I mostly guess", points: 0 },
        { label: "Sometimes, with a few words or signs", points: 1 },
        { label: "Yes, usually they can make themselves understood", points: 2 },
      ],
    },
    {
      q: "Does your child enjoy playing near or with other children?",
      area: "Social play",
      options: [
        { label: "Not yet, they prefer to stay with me", points: 0 },
        { label: "Sometimes, alongside others", points: 1 },
        { label: "Yes, they seek out other children", points: 2 },
      ],
    },
    {
      q: "Can your child stay with one activity, like a story or a puzzle, for a few minutes?",
      area: "Attention",
      options: [
        { label: "Not yet, they move on quickly", points: 0 },
        { label: "Sometimes, if it's something they love", points: 1 },
        { label: "Yes, usually for a few minutes", points: 2 },
      ],
    },
    {
      q: "Does your child have a fairly regular daily routine for meals, naps and sleep?",
      area: "Routines",
      options: [
        { label: "Not yet, every day is different", points: 0 },
        { label: "Sometimes, it's settling down", points: 1 },
        { label: "Yes, most days follow a pattern", points: 2 },
      ],
    },
    {
      q: "Can your child run, climb a few steps and use their hands to scribble or stack blocks?",
      area: "Motor skills",
      options: [
        { label: "Not yet, still working on it", points: 0 },
        { label: "Some of these, not all", points: 1 },
        { label: "Yes, usually with confidence", points: 2 },
      ],
    },
    {
      q: "Is your child showing signs of toilet training, like telling you when they need to go?",
      area: "Toilet training",
      options: [
        { label: "Not yet, still fully in nappies", points: 0 },
        { label: "Sometimes, we've started practising", points: 1 },
        { label: "Yes, usually they tell me or use the toilet", points: 2 },
      ],
    },
    {
      q: "Can your child feed themselves with a spoon or fork and drink from a cup?",
      area: "Eating",
      options: [
        { label: "Not yet, I still feed them", points: 0 },
        { label: "Sometimes, with help and some mess", points: 1 },
        { label: "Yes, usually on their own", points: 2 },
      ],
    },
    {
      q: "Does your child show curiosity, like asking questions or exploring new toys and places?",
      area: "Curiosity",
      options: [
        { label: "Not yet, they're cautious with new things", points: 0 },
        { label: "Sometimes, once they feel safe", points: 1 },
        { label: "Yes, they love to explore", points: 2 },
      ],
    },
  ],
  results: [
    {
      min: 15,
      title: "Ready to bloom!",
      text: "Your child is showing lots of the everyday skills that help preschool feel exciting from day one. They'll still need a gentle settling-in, as every child does, but they sound ready for new friends and adventures. Come and visit Universal Blooming so they can see the classrooms and meet the teachers.",
      mood: "cheer",
    },
    {
      min: 8,
      title: "Growing nicely",
      text: "Your child is well on the way, with some skills blooming and others still sprouting. That's exactly where many children are when they start preschool, and a caring play-based setting helps those skills grow fast. Try the tips below at home, and book a visit so we can talk about the right start for your child.",
      mood: "happy",
    },
    {
      min: 0,
      title: "Just sprouting",
      text: "Your child is still growing into many of these skills, which is completely normal, especially for younger children. Every child blooms in their own time. A gentle, step-by-step start can make all the difference, and the home tips below will help. Visit us and we'll share how we support little ones who need a little more time.",
      mood: "think",
    },
  ],
  sections: [
    {
      id: "what-is-preschool-readiness",
      title: "What does preschool readiness really mean?",
      blocks: [
        {
          type: "p",
          text: "Preschool readiness isn't a test your child passes or fails. It's a picture of the everyday skills that help a child feel comfortable in a group setting: coping with short separations, communicating needs, joining in with play and following simple routines. Age matters for school year groups (see our [preschool age guide](/parents-guide/preschool-age-uae)), but two children of the same age can be at very different stages, and both are normal.",
        },
        {
          type: "p",
          text: "Most children start preschool still working on some of these skills. In fact, preschool is where many of them grow fastest, because children learn by watching friends, practising routines and being encouraged by caring teachers. This quiz is a friendly guide, not a diagnosis. If you have concerns about your child's development, our [child development milestones guide](/parents-guide/child-development-milestones) is a helpful reference, and your paediatrician is the best person to talk to.",
        },
        {
          type: "p",
          text: "For children heading towards FS1 or KG1, our [school readiness checklist](/parents-guide/school-readiness-checklist) covers the next stage. If you're still choosing between settings, read [day care vs preschool vs kindergarten](/parents-guide/daycare-vs-preschool-vs-kindergarten).",
        },
      ],
    },
    {
      id: "build-readiness-at-home",
      title: "How can you build preschool readiness at home?",
      blocks: [
        {
          type: "p",
          text: "Small, playful habits at home make a big difference. You don't need special equipment, just a little time and patience. Pick two or three ideas from this checklist and build from there:",
        },
        {
          type: "checklist",
          items: [
            "**Practise short goodbyes:** leave your child with a trusted adult for short spells and always say a cheerful goodbye, never sneak away.",
            "**Name feelings:** help your child put words to feelings (\"You feel sad because...\") so they can tell teachers how they feel.",
            "**Read together every day:** stories build language, attention and a love of books.",
            "**Encourage \"I can do it\":** let your child try washing hands, putting on shoes and tidying toys, even if it takes longer.",
            "**Arrange playdates:** time with other children helps with sharing, turn-taking and making friends.",
            "**Keep a steady routine:** regular times for meals, naps and bedtime help children feel secure.",
            "**Offer a spoon and cup:** let your child feed themselves at mealtimes, mess and all.",
            "**Watch for toilet-training signs:** follow your child's lead and keep it relaxed and positive.",
            "**Talk about preschool positively:** read picture books about starting preschool and visit together before the first day.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Visit together",
          text: "Seeing the classroom and meeting the teachers before day one helps children feel at home. [Book a visit](/admissions) to Universal Blooming, and read our [settling-into-preschool guide](/parents-guide/settling-into-preschool) for a step-by-step plan.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What age is best to start preschool or day care?",
      a: "There's no single best age, and readiness matters as much as age. At Universal Blooming, [Preschool](/programs/preschool) is for 3 to 6 year olds and [Day Care](/programs/day-care) cares for younger children.",
    },
    {
      q: "Does my child need to be toilet trained to start preschool?",
      a: "Many young children start preschool or day care before they're fully toilet trained, and learn with support from home and our teachers together. Ask us about expectations for your child's age group on your visit.",
    },
    {
      q: "My child scored low. Should I wait?",
      a: "Not necessarily. A low score simply shows skills that are still growing, and a gentle, play-based setting often helps them grow faster. Visit us, talk it through, and decide what feels right for your family.",
    },
    {
      q: "How do I help my child with separation anxiety?",
      a: "Practise short separations, keep goodbyes short and cheerful, and be consistent. Our [settling-into-preschool guide](/parents-guide/settling-into-preschool) has a full plan.",
    },
    {
      q: "Is this quiz a developmental assessment?",
      a: "No. It's a friendly guide to everyday skills, not a diagnostic tool. If you have concerns, see our [milestones guide](/parents-guide/child-development-milestones) and talk to your paediatrician.",
    },
  ],
};
