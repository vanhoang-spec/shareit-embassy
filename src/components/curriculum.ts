// =================================================================
// CURRICULUM_DATA — single source of truth for ALL lesson content.
// Add or edit lesson content here. Screens read it via getUnitData(unit, level).
// =================================================================
export const CURRICULUM_DATA = {
  level_5: {
    unit_1: {
      title: "Adventure Camp",
      icon: "🪐",
      formToggleLabel: "Past Form ⏳",
      grammarGameMode: "ASTEROID_SMASHER",
      quizGameMode: "FOUR_IN_A_ROW",
      vocabulary: {
        lesson_1: [
          { word: "build a shelter",    alt: "built a shelter",    vn: "dựng lều trú ẩn",       emoji: "⛺" },
          { word: "ride a zipline",     alt: "rode a zipline",     vn: "trượt đu dây tự do",    emoji: "⚡" },
          { word: "sleep in a tent",    alt: "slept in a tent",    vn: "ngủ trong lều",         emoji: "⛺" },
          { word: "go hiking",          alt: "went hiking",        vn: "đi bộ đường dài",       emoji: "🥾" },
          { word: "go mountain biking", alt: "went mountain biking", vn: "đi xe đạp địa hình",  emoji: "🚲" },
          { word: "cook on a campfire", alt: "cooked on a campfire", vn: "nấu ăn bên lửa trại", emoji: "🔥" },
          { word: "go horseback riding", alt: "went horseback riding", vn: "cưỡi ngựa",          emoji: "🐎" },
          { word: "go canoeing",        alt: "went canoeing",      vn: "chèo thuyền canoe",     emoji: "🛶" },
        ],
        lesson_5: ["jump on a trampoline","go climbing","play volleyball","make jewelry","play table tennis","play badminton","go ice skating","go bowling"],
      },
      ai_speak: [
        "I cooked dinner on a campfire last night.",
        "I built a shelter and I slept in it.",
        "This morning we went hiking and I rode on a zipline.",
        "Did you go horseback riding yesterday afternoon?",
        "We didn't go canoeing because it started raining.",
      ],
      reading: {
        text: "Camp Energy Journal: Yesterday was amazing. We built a shelter in the woods. Later, we cooked on a campfire...",
        questions: [
          { q: "They built a shelter yesterday.", a: true },
          { q: "They cooked inside a kitchen.",   a: false },
          { q: "They slept in a hotel.",          a: false },
        ],
      },
    },
    unit_2: {
      title: "Gadget Nebula",
      icon: "🌀",
      formToggleLabel: "Plural Form 👥",
      grammarGameMode: "ROCKET_FUEL",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "smartwatch",       alt: "smartwatches",       vn: "đồng hồ thông minh",     emoji: "⌚" },
          { word: "laptop",           alt: "laptops",            vn: "máy tính xách tay",      emoji: "💻" },
          { word: "smartphone",       alt: "smartphones",        vn: "điện thoại thông minh",  emoji: "📱" },
          { word: "tablet",           alt: "tablets",            vn: "máy tính bảng",          emoji: "📟" },
          { word: "digital camera",   alt: "digital cameras",    vn: "máy ảnh kỹ thuật số",    emoji: "📷" },
          { word: "e-reader",         alt: "e-readers",          vn: "máy đọc sách",           emoji: "📖" },
          { word: "headphones",                                  vn: "tai nghe",               emoji: "🎧" },
          { word: "portable speaker", alt: "portable speakers",  vn: "loa di động",            emoji: "🔊" },
        ],
        lesson_5: ["upload a photo","text a friend","stream a video","download a song","charge a phone","log in","print a document","search the internet"],
      },
      ai_speak: [
        "At nine o'clock last night, I was streaming a video.",
        "He was texting a friend when the Wi-Fi stopped.",
        "They were listening to music during class.",
        "What were you downloading when your laptop died?",
        "She was charging her smartphone while talking to me.",
      ],
      reading: {
        text: "Vlogging Kit & Tech Tools Review: This smartwatch is excellent for tracking steps. The portable speaker is loud...",
        questions: [
          { q: "The smartwatch tracks steps.",   a: true },
          { q: "The speaker is very quiet.",     a: false },
          { q: "The review talks about cooking.", a: false },
        ],
      },
    },
    unit_3: {
      title: "Surprise!",
      icon: "☄️",
      formToggleLabel: "Past Form ⏳",
      grammarGameMode: "NEBULA_BRIDGE",
      quizGameMode: "SPACE_DEFENSE_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "buy groceries",      alt: "bought groceries",     vn: "mua nhu yếu phẩm", emoji: "🛒" },
          { word: "walk the dog",       alt: "walked the dog",       vn: "dắt chó đi dạo",   emoji: "🦮" },
          { word: "study for a test",   alt: "studied for a test",   vn: "ôn thi",           emoji: "📝" },
          { word: "take out the trash", alt: "took out the trash",   vn: "đổ rác",           emoji: "🗑️" },
          { word: "buy a present",      alt: "bought a present",     vn: "mua quà",          emoji: "🎁" },
          { word: "play chess",         alt: "played chess",         vn: "chơi cờ vua",      emoji: "♟️" },
          { word: "read the newspaper", alt: "read the newspaper",   vn: "đọc báo giấy",     emoji: "📰" },
          { word: "watch the news",     alt: "watched the news",     vn: "xem thời sự",      emoji: "📺" },
        ],
        lesson_5: ["go online","listen to the radio","read a magazine","download an app","look at the screen","read a blog post"],
      },
      ai_speak: [
        "A man was walking his dog when it ran into the street.",
        "What were you doing when the bell rang this morning?",
        "Dad and Seb were buying groceries when the accident happened.",
        "She was studying for a test when her friend called her.",
        "They were playing chess when they heard a loud noise outside.",
      ],
      reading: {
        text: "The History of News: Long ago, there were no radios, televisions, or smartphones. People got their daily updates from a town crier in the busy town square. The crier would ring a heavy bell and shout important announcements to everyone around the world. Later, printing presses were invented, and people started reading the newspaper to discover what was happening.",
        questions: [
          { q: "People used smartphones to read news long ago.", a: false },
          { q: "A town crier would ring a bell in the town square.", a: true },
          { q: "The story discusses the history of how people get news.", a: true },
        ],
      },
    },
    unit_4: {
      title: "Myths & Legends",
      icon: "🧜‍♀️",
      formToggleLabel: "Plural Form 👥",
      grammarGameMode: "ORBITAL_ALIGNMENT",
      quizGameMode: "QUANTUM_MEMORY_MATCH",
      vocabulary: {
        lesson_1: [
          { word: "minotaur", alt: "minotaurs",   vn: "quái vật nhân ngưu",       emoji: "🐂" },
          { word: "mermaid",  alt: "mermaids",    vn: "nàng tiên cá",            emoji: "🧜‍♀️" },
          { word: "phoenix",  alt: "phoenixes",   vn: "chim phượng hoàng",       emoji: "🦅" },
          { word: "dragon",   alt: "dragons",     vn: "con rồng",                emoji: "🐉" },
          { word: "centaur",  alt: "centaurs",    vn: "nhân mã",                 emoji: "🏹" },
          { word: "unicorn",  alt: "unicorns",    vn: "kỳ lân",                  emoji: "🦄" },
          { word: "pegasus",  alt: "pegasuses",   vn: "ngựa có cánh pegasus",    emoji: "🐎" },
          { word: "kraken",   alt: "krakens",     vn: "quái vật mực khổng lồ",   emoji: "🦑" },
        ],
        lesson_5: ["tell a story","paint a picture","write a poem","sing a song","read a comic","make a statue"],
      },
      ai_speak: [
        "A minotaur was a monster that lived in a giant labyrinth.",
        "Mermaids were mythical creatures who lived deep in the ocean.",
        "The phoenix is a magical bird that can be reborn from fire.",
        "Dragons are powerful creatures that breathe fire and guard gold.",
        "The centaur was a legendary warrior who was half man and half horse.",
      ],
      reading: {
        text: "The Legend of Atlantis: Long ago, Greek philosophers wrote stories about a magnificent, powerful island nation called Atlantis. This utopian city possessed incredible technology, golden temples, and vast wealth. However, the legends claim that the people became greedy, angering the ancient gods. In a single day and night of misfortune, the entire island was swallowed by the sea, disappearing forever into the dark Atlantic ocean.",
        questions: [
          { q: "Atlantis was a real city that scientists found yesterday.", a: false },
          { q: "Legends say the island was swallowed by the sea.", a: true },
          { q: "The story discusses a famous myth about a sunken island.", a: true },
        ],
      },
    },
    unit_5: {
      title: "Let's Cook!",
      icon: "🍳",
      formToggleLabel: "Plural Form 👥",
      grammarGameMode: "QUANTUM_SCALE",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "flour",            vn: "bột mì",                emoji: "🌾" },
          { word: "butter",           vn: "bơ",                    emoji: "🧈" },
          { word: "sugar",            vn: "đường",                 emoji: "🍬" },
          { word: "jelly",            vn: "thạch",                 emoji: "🍮" },
          { word: "salt and pepper",  vn: "muối và hạt tiêu",      emoji: "🧂" },
          { word: "honey",            vn: "mật ong",               emoji: "🍯" },
          { word: "olive",      alt: "olives",       vn: "quả ô-liu",      emoji: "🫒" },
          { word: "strawberry", alt: "strawberries", vn: "quả dâu tây",    emoji: "🍓" },
          { word: "mushroom",   alt: "mushrooms",    vn: "cây nấm",        emoji: "🍄" },
        ],
        lesson_5: ["cup","teaspoon","tablespoon","knife","bowl","fork","plate","glass"],
      },
      ai_speak: [
        "There is too much sugar in this giant bowl.",
        "There aren't enough strawberries to make the jelly.",
        "Could you hand me a tablespoon and a clean knife?",
        "There are too many olives on that small plate.",
        "Is there enough flour and butter to bake the cake?",
      ],
      reading: {
        text: "The Galaxy Bakery: Today, Seb and Taylor are in the spaceship kitchen. They want to bake a special strawberry surprise cake for Mom's birthday. There is enough flour and butter, but there isn't enough sugar in the cabinet. Seb looks around and says, 'We have too many mushrooms and olives, but we need more sweet ingredients!' Luckily, Taylor finds a jar of golden honey. They use a measuring cup and a tablespoon to mix everything in a massive bowl. Mom will love it!",
        questions: [
          { q: "They are making a birthday cake for Mom.", a: true },
          { q: "They have too much sugar in the kitchen.", a: false },
          { q: "They use a cup and a tablespoon to mix the ingredients.", a: true },
        ],
      },
    },
    unit_6: {
      title: "Save Our Planet!",
      icon: "🌍",
      formToggleLabel: "Plural Form 👥",
      grammarGameMode: "ECO_BALANCER",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "giant panda",      alt: "giant pandas",      vn: "gấu trúc lớn", emoji: "🐼" },
          { word: "black rhino",      alt: "black rhinos",      vn: "tê giác đen",  emoji: "🦏" },
          { word: "blue whale",       alt: "blue whales",       vn: "cá voi xanh",  emoji: "🐋" },
          { word: "mountain gorilla", alt: "mountain gorillas", vn: "khỉ đột núi",  emoji: "🦍" },
          { word: "snow leopard",     alt: "snow leopards",     vn: "báo tuyết",    emoji: "🐆" },
          { word: "sea turtle",       alt: "sea turtles",       vn: "rùa biển",     emoji: "🐢" },
          { word: "polar bear",       alt: "polar bears",       vn: "gấu bắc cực",  emoji: "🐻‍❄️" },
          { word: "orangutan",        alt: "orangutans",        vn: "đười ươi",     emoji: "🦧" },
        ],
        lesson_5: ["recycle trash","plant trees","save water","turn off lights","clean up parks","reuse plastic bags"],
      },
      ai_speak: [
        "If we don't protect the giant pandas, they will disappear.",
        "We should turn off the lights to save energy every day.",
        "If people plant more green trees, the air will be cleaner.",
        "Sea turtles are endangered because there is too much plastic in the ocean.",
        "What will happen if we recycle all our plastic bottles?",
      ],
      reading: {
        text: "The Green Mission: Our planet is home to many incredible creatures like the giant panda and the blue whale. However, pollution and climate change are putting their ecosystems in danger. If we don't take action now, these beautiful animals might disappear forever. Luckily, children around the world are helping. By recycling paper, planting green trees, and saving clean water, every small explorer can make a massive difference to protect Mother Earth.",
        questions: [
          { q: "Pollution can put animal ecosystems in danger.", a: true },
          { q: "Only adults can help protect the planet.", a: false },
          { q: "The story advises us to recycle paper and plant trees.", a: true },
        ],
      },
    },
    unit_8: {
      title: "On Vacation!",
      icon: "🛳️",
      formToggleLabel: "Past Form ⏳",
      grammarGameMode: "NEBULA_GATEWAY",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "go on a cruise",      alt: "went on a cruise",     vn: "đi du thuyền",            emoji: "🛳️" },
          { word: "visit a theme park",  alt: "visited a theme park", vn: "thăm công viên giải trí", emoji: "🎢" },
          { word: "see a show",          alt: "saw a show",           vn: "xem biểu diễn",           emoji: "🎭" },
          { word: "go to the beach",     alt: "went to the beach",    vn: "đi bãi biển",             emoji: "🏖️" },
          { word: "stay in a hotel",     alt: "stayed in a hotel",    vn: "ở khách sạn",             emoji: "🏨" },
          { word: "visit a museum",      alt: "visited a museum",     vn: "thăm bảo tàng",           emoji: "🏛️" },
          { word: "go sightseeing",      alt: "went sightseeing",     vn: "đi ngắm cảnh",            emoji: "🏙️" },
          { word: "buy souvenirs",       alt: "bought souvenirs",     vn: "mua quà lưu niệm",        emoji: "🎁" },
        ],
        lesson_5: ["pack a suitcase","book a flight","buy a ticket","check in","board the plane","explore the city"],
      },
      ai_speak: [
        "Have you ever stayed in a luxury hotel near the beach?",
        "We have already bought beautiful souvenirs for our family.",
        "She hasn't visited the space theme park yet.",
        "They went sightseeing and saw an incredible light show last night.",
        "He is going to pack his big suitcase for the cruise tomorrow.",
      ],
      reading: {
        text: "The Galactic Vacation: Summer vacation has finally arrived! This year, Leo's family is planning an incredible trip across the solar system. First, they booked a flight on a hyper-drive starship. Yesterday, they checked in at the spaceport terminal and boarded the plane. They are going to stay in a floating hotel near the cosmic beach. Leo wants to visit a famous space museum and buy alien souvenirs for his best friends back home. It will be an unforgettable adventure!",
        questions: [
          { q: "Leo's family is going on a vacation across the solar system.", a: true },
          { q: "They forgot to book a flight and stayed home.",                a: false },
          { q: "Leo wants to buy souvenirs for his friends.",                  a: true },
        ],
      },
    },
  },
  level_3: {
    unit_4: {
      title: "After School",
      icon: "⏰",
      formToggleLabel: "He/She Form 👤",
      grammarGameMode: "COSMIC_BALLOON_POP",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "do homework", alt: "does homework", vn: "làm bài tập về nhà", emoji: "📝" },
          { word: "practice the piano", alt: "practices the piano", vn: "luyện đàn piano", emoji: "🎹" },
          { word: "go to English class", alt: "goes to English class", vn: "đi học lớp tiếng Anh", emoji: "🇬🇧" },
          { word: "have a snack", alt: "has a snack", vn: "ăn nhẹ / ăn vặt", emoji: "🍪" },
          { word: "watch a video", alt: "watches a video", vn: "xem video", emoji: "📺" },
          { word: "go to gymnastics", alt: "goes to gymnastics", vn: "đi tập thể dục dụng cụ", emoji: "🤸" },
          { word: "wash the dishes", alt: "washes the dishes", vn: "rửa chén bát", emoji: "🧽" },
          { word: "play video games", alt: "plays video games", vn: "chơi trò chơi điện tử", emoji: "🎮" },
        ],
        lesson_5: ["take art classes", "play soccer", "go to ballet class", "do karate", "play the violin", "sing in the choir"],
      },
      ai_speak: [
        "What do you do after school? I do my homework.",
        "He goes to English class and he doesn't wash the dishes.",
        "Does she practice the piano or play video games?",
        "What does he do after school? He goes to gymnastics.",
        "Do you take art classes or do karate after school?",
      ],
      reading: {
        text: "After-School Fun: Every day after school, the children on the Space Station have lots of fun. Toby does his homework first, and then he plays cosmic video games. Ellen practices the piano with her music robot buddy. In the afternoon, some cosmic campers go to English class or gymnastics. What do you do after school?",
        questions: [
          { q: "Toby plays video games before doing his homework.", a: false },
          { q: "Ellen practices the piano with a robot.", a: true },
          { q: "Some campers go to English class after school.", a: true },
        ],
      },
    },
    unit_5: {
      title: "Let's Play!",
      icon: "⚽",
      formToggleLabel: "-ing Form 🔄",
      grammarGameMode: "COSMIC_BALLOON_POP",
      quizGameMode: "ALIEN_TRIVIA",
      vocabulary: {
        lesson_1: [
          { word: "play basketball", alt: "playing basketball", vn: "chơi bóng rổ", emoji: "🏀" },
          { word: "play soccer", alt: "playing soccer", vn: "chơi bóng đá", emoji: "⚽" },
          { word: "go swimming", alt: "going swimming", vn: "đi bơi", emoji: "🏊" },
          { word: "ride a bike", alt: "riding a bike", vn: "đi xe đạp", emoji: "🚲" },
          { word: "inline skate", alt: "inline skating", vn: "trượt patin", emoji: "🛼" },
          { word: "skateboard", alt: "skateboarding", vn: "trượt ván", emoji: "🛹" },
          { word: "play tennis", alt: "playing tennis", vn: "chơi quần vợt", emoji: "🎾" },
          { word: "dance", alt: "dancing", vn: "nhảy múa", emoji: "💃" },
        ],
        lesson_5: ["play the guitar", "sing songs", "draw pictures", "cook dinner", "read books", "watch cartoons"],
      },
      ai_speak: [
        "He is playing basketball with his friends in the park.",
        "She is going swimming because the weather is very hot.",
        "Are you riding a bike or inline skating right now?",
        "My brother loves skateboarding but he cannot play tennis.",
        "We are dancing and singing happy songs together today.",
      ],
      reading: {
        text: "The Galactic Sports Day: Today is the annual Sports Day on the Space Station. All the alien children are excited. Toby is playing basketball with his floating drone buddy. Luna is going swimming in the zero-gravity pool. Some cosmic campers are riding bikes, and others are inline skating down the neon hallways.",
        questions: [
          { q: "Today is the annual Sports Day on the Space Station.", a: true },
          { q: "Luna is playing tennis in the kitchen.", a: false },
          { q: "The children are riding bikes and inline skating.", a: true },
        ],
      },
    },
  },
};
export function getUnitData(unit, level = "level_5") {
  const lvl = CURRICULUM_DATA[level];
  if (lvl && lvl[`unit_${unit}`]) return lvl[`unit_${unit}`];
  // Only fall back to level_5 if the requested level itself is unknown.
  if (!lvl) {
    return CURRICULUM_DATA.level_5[`unit_${unit}`] || CURRICULUM_DATA.level_5.unit_1;
  }
  // Requested level exists but unit missing → empty shell, no level_5 leak.
  return {
    title: "",
    icon: "",
    formToggleLabel: "",
    vocabulary: { lesson_1: [], lesson_5: [] },
    ai_speak: [],
    reading: { text: "Waiting for content update...", questions: [] },
    games: { grammar: [], phonics: { categories: [], words: [] } },
  };
}
