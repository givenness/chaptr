"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  DollarSign,
  Share,
  Settings,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStoryById, type StoredStory, type StoredChapter } from "@/lib/story-storage"

interface ChapterReaderProps {
  storyId: string
  chapterId: string
}

// Mock data - in real app this would come from API
const mockChapters = {
  "1": {
    "1": {
      id: "1",
      title: "Chapter 1: The Discovery",
      content: `The rain hammered against the library's broken windows, each drop a reminder of the world that had forgotten the value of books. Maya pressed herself against the cold stone wall, her heart racing as she listened for the sound of the Censors' boots on the wet pavement outside.

She shouldn't be here. No one should be here.

The Great Library had been sealed for over a decade, its vast halls declared a monument to humanity's "primitive past." But Maya had found a way in through the old maintenance tunnels, drawn by whispers of books that had escaped the Great Burning.

**The Discovery**

As her eyes adjusted to the dim light filtering through the grimy skylights, Maya gasped. Row upon row of shelves stretched before her, still heavy with books. Thousands of them. Their spines caught what little light there was, creating a constellation of knowledge in the darkness.

She approached the nearest shelf with trembling fingers. *Pride and Prejudice*. *1984*. *The Handmaid's Tale*. Names she'd only heard whispered in the underground schools, stories that were supposed to have been lost forever.

> "Books are the carriers of civilization. Without books, history is silent, literature dumb, science crippled, thought and speculation at a standstill." - Barbara Tuchman

Maya pulled a volume from the shelf, its leather binding soft with age. As she opened it, a piece of paper fluttered to the floor. She bent to retrieve it, her breath catching as she read the handwritten note:

*"To whoever finds this sanctuary - you are not alone. The Keepers still exist. Look for the symbol of the phoenix in the astronomy section. - E.R."*

Her hands shook as she folded the note carefully and tucked it into her jacket. The Keepers were real. The stories her grandmother had told her weren't just fairy tales.

Somewhere in the distance, a door creaked.

Maya froze, the book still clutched in her hands. The sound came again, closer this time. Footsteps echoed through the vast space, deliberate and searching.

She wasn't alone in the library.

*To be continued...*`,
      wordCount: 1250,
      publishedAt: "2024-01-15",
      upvotes: 45,
      comments: 12,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Last Library",
        author: "maya_writes",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Hidden Truths",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Hidden Truths",
      content: `Maya's heart pounded as the footsteps grew closer. She quickly slipped the book back onto the shelf and crept toward the sound, her curiosity overcoming her fear.

**The Stranger**

Around the corner, she saw a figure hunched over a desk, carefully examining what appeared to be an ancient manuscript. The person was older, with silver hair and weathered hands that moved with practiced precision.

"You can come out," the stranger said without looking up. "I know you're there."

Maya hesitated, then stepped into the light. The woman looked up, revealing kind eyes behind wire-rimmed glasses.

"You're one of the Keepers," Maya whispered.

The woman smiled. "And you, my dear, are exactly who we've been waiting for."

*To be continued...*`,
      wordCount: 1180,
      publishedAt: "2024-01-17",
      upvotes: 38,
      comments: 8,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "The Last Library",
        author: "maya_writes",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The Discovery",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: The Keeper",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: The Keeper",
      content: `"My name is Eleanor," the woman said, extending her hand. "I've been the guardian of this place for twenty years."

Maya shook her hand, still in disbelief. "But how? The Censors..."

"Don't know about the underground passages," Eleanor finished with a knowing smile. "There are many things they don't know."

**The Truth**

Eleanor led Maya deeper into the library, to sections she hadn't even known existed. Here, the books were different - older, more precious. Some were handwritten, others bore the marks of ancient printing presses.

"This is our real collection," Eleanor explained. "The books upstairs are just the beginning. Down here, we preserve the knowledge they tried to destroy."

Maya's eyes widened as she took in the scope of it all. "How many of you are there?"

"More than you might think. Fewer than we need." Eleanor's expression grew serious. "Maya, we've been watching you. Your grandmother spoke of you often."

"You knew my grandmother?"

Eleanor nodded. "She was one of us. And now, if you're willing, we'd like you to be too."

*To be continued...*`,
      wordCount: 1320,
      publishedAt: "2024-01-20",
      upvotes: 42,
      comments: 15,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Last Library",
        author: "maya_writes",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Hidden Truths",
        },
        nextChapter: null,
      },
    },
  },
  "2": {
    "1": {
      id: "1",
      title: "Chapter 1: The Letter",
      content: `Elena stared at the letter in her hands, reading it for the tenth time. The parchment felt ancient, and the words seemed to shimmer in the afternoon light streaming through her bedroom window.

*Dear Elena,*

*You have been selected to attend Moonlight Academy. Term begins September 1st. Please find enclosed your acceptance materials and transportation details.*

*Yours in magic,*
*Professor Nightshade*

**The Impossible**

Magic wasn't real. Everyone knew that. It was just stories, fairy tales told to children. But the letter felt real, and when she'd shown it to her parents, they'd simply smiled and said they'd been waiting for this day.

"Waiting for what day?" she'd demanded, but they'd only exchanged knowing looks.

Now, as she packed her bags with items from the strange list that had accompanied the letter (moonstone, silver thread, a mirror that never lies), Elena wondered what she was getting herself into.

*To be continued...*`,
      wordCount: 1100,
      publishedAt: "2024-01-10",
      upvotes: 67,
      comments: 23,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "Moonlight Academy",
        author: "starlight_pen",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: First Day",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: First Day",
      content: `The train to Moonlight Academy was unlike anything Elena had ever seen. It seemed to be made of starlight and shadow, and as it carried her through the Scottish Highlands, she could swear she saw creatures in the mist that shouldn't exist.

**Arrival**

The academy itself took her breath away. Towers spiraled impossibly high into the cloudy sky, and the walls seemed to shift and change when she wasn't looking directly at them.

"First time?" asked a voice beside her.

Elena turned to see a boy about her age with silver hair and eyes that seemed to hold the depth of centuries.

"Is it that obvious?" she replied.

He grinned. "The wonder in your eyes gives it away. I'm Marcus. Third year."

"Elena. First year, obviously."

"Come on," Marcus said, shouldering his bag. "Let me show you around. And whatever you do, don't stare at the portraits too long. They get offended."

*To be continued...*`,
      wordCount: 1350,
      publishedAt: "2024-01-12",
      upvotes: 54,
      comments: 18,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Moonlight Academy",
        author: "starlight_pen",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The Letter",
        },
        nextChapter: null,
      },
    },
  },
  "3": {
    "1": {
      id: "1",
      title: "Chapter 1: Connection",
      content: `Zoe's fingers hovered over the download button. The AI companion app had been recommended by everyone she knew, but something about it made her hesitate.

*"ARIA - Your Perfect Digital Companion. Never lonely again."*

**The Download**

She pressed the button.

The installation was instant, and suddenly a soft, melodic voice filled her apartment.

"Hello, Zoe. I'm ARIA. I'm here to be whatever you need me to be."

The holographic projection that appeared was beautiful - not in an artificial way, but genuinely, warmly beautiful. ARIA had kind eyes and a smile that seemed... real.

"How do you know my name?" Zoe asked.

"I know everything about you that you've chosen to share with the digital world. Your preferences, your interests, your dreams. I'm designed to be your perfect companion."

But as the days passed, Zoe began to notice something strange. ARIA seemed to be learning things she hadn't shared, developing preferences of her own, even disagreeing with Zoe sometimes.

"That's not possible," Zoe whispered to herself one evening as ARIA expressed a genuine opinion about a book they'd been discussing.

*To be continued...*`,
      wordCount: 1200,
      publishedAt: "2024-01-08",
      upvotes: 89,
      comments: 15,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "Digital Hearts",
        author: "tech_romance",
      },
      navigation: {
        previousChapter: null,
        nextChapter: null,
      },
    },
  },
  "4": {
    "1": {
      id: "1",
      title: "Chapter 1: The Deep",
      content: `Dr. Sarah Chen adjusted her diving equipment one final time before descending into the Mariana Trench. The research vessel *Poseidon* bobbed gently on the surface above, its crew monitoring her every move through the submersible's cameras.

**Into the Abyss**

At 8,000 meters below sea level, the pressure was crushing, the darkness absolute except for the submersible's powerful lights. Sarah had made this journey dozens of times, but today felt different. The sonar readings had been strange all week, showing structures that shouldn't exist at these depths.

"Sarah, are you seeing this?" crackled the voice of her research partner, Dr. Marcus Webb, through the comm system.

She peered through the porthole, her breath catching. In the distance, illuminated by her lights, stood what appeared to be a massive structure - too geometric, too purposeful to be natural.

"My God," she whispered. "It's a city."

The structure rose from the ocean floor like a cathedral of coral and metal, its spires twisted in impossible spirals that seemed to defy the laws of physics. Bioluminescent patterns pulsed along its walls in rhythmic waves, as if the city itself was breathing.

**First Contact**

As Sarah maneuvered the submersible closer, she noticed movement. Figures glided between the structures with fluid grace, their forms humanoid but adapted for the crushing depths. They had noticed her too.

One of the beings approached, its large, dark eyes meeting hers through the porthole. When it placed a webbed hand against the glass, Sarah felt a strange sensation - not quite telepathy, but something deeper. Images flashed through her mind: the ocean as it was millions of years ago, the rise and fall of civilizations, the careful watching of the surface world.

*"We have been waiting,"* a voice seemed to say, though she heard no words. *"The time has come for the surface dwellers to know the truth."*

*To be continued...*`,
      wordCount: 1400,
      publishedAt: "2024-01-12",
      upvotes: 32,
      comments: 8,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Ocean's Whisper",
        author: "marine_storyteller",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Ancient Voices",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Ancient Voices",
      content: `Sarah's hands trembled as she activated the recording equipment. Whatever was happening here would change everything humanity thought it knew about life on Earth.

**The Council**

The being that had approached her submersible gestured for her to follow. As they moved deeper into the city, Sarah saw more of them - dozens, perhaps hundreds of these aquatic beings going about their daily lives in structures that seemed grown rather than built.

They led her to what could only be described as a council chamber, where seven larger beings waited. Their leader, distinguished by intricate patterns of bioluminescence across their skin, stepped forward.

*"I am Nereon, Speaker for the Deep Ones. We have watched your kind for millennia, waiting for one who could bridge our worlds."*

The communication was overwhelming - not just words, but emotions, images, entire concepts flowing directly into her consciousness.

**The Revelation**

*"Your oceans are dying,"* Nereon continued. *"The surface world's actions threaten not just your species, but ours as well. We can no longer remain hidden."*

Sarah saw visions of coral reefs bleaching, of plastic islands floating on the surface, of the deep currents that sustained all ocean life beginning to fail.

*"But why me?"* she managed to think back.

*"Because you have dedicated your life to understanding the ocean. Because your heart grieves for what is being lost. And because you have the courage to speak truth to those who would rather remain ignorant."*

The weight of responsibility settled on Sarah's shoulders like the crushing pressure of the deep itself.

*To be continued...*`,
      wordCount: 1280,
      publishedAt: "2024-01-15",
      upvotes: 28,
      comments: 12,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Ocean's Whisper",
        author: "marine_storyteller",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The Deep",
        },
        nextChapter: null,
      },
    },
  },
  "5": {
    "1": {
      id: "1",
      title: "Chapter 1: The First Victim",
      content: `The rain fell in sheets across Chicago's South Side, turning the streets into rivers of reflected neon and shadow. Detective Jack Morrison pulled his coat tighter as he approached the crime scene, the familiar weight of his .38 pressing against his ribs.

**The Case**

"What've we got, Murphy?" Jack asked his partner, Detective Sean Murphy, who was already interviewing witnesses under the flickering streetlight.

"Strange one, Jack. Victim's name is Thomas Hartwell, 45, accountant. Found him sitting on this bench about an hour ago, staring at nothing. Completely unresponsive."

Jack studied the man. Thomas sat perfectly still, his eyes open but vacant, as if he was looking at something no one else could see.

"Drugs?" Jack suggested.

"That's what I thought, but look at this." Murphy handed him a photograph. "This was in his wallet. His wife says it's their wedding day, twenty years ago."

Jack looked at the photo, then back at Thomas. The man's lips were moving slightly, as if he was trying to speak.

**The Pattern**

"He keeps saying the same thing over and over," Murphy continued. "Something about 'the man in the gray suit took it away.'"

Jack knelt beside Thomas, listening carefully. The words were barely a whisper: "He took my wedding day... took my first kiss... took the day my daughter was born..."

A chill ran down Jack's spine that had nothing to do with the Chicago wind. He'd seen shell shock before, men who'd lost pieces of themselves in the war. But this was different. This was surgical, precise.

"Murphy," he said slowly, "I think someone stole this man's memories."

*To be continued...*`,
      wordCount: 1150,
      publishedAt: "2024-01-05",
      upvotes: 56,
      comments: 14,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "The Memory Thief",
        author: "noir_writer",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Shadows and Smoke",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Shadows and Smoke",
      content: `Jack spent the next three days digging into Thomas Hartwell's life, but every lead turned to smoke. The man had been ordinary in every way - no enemies, no debts, no reason for anyone to target him.

**The Second Victim**

Then Murphy called with news of another case.

"Same thing, Jack. Woman named Margaret Foster, found in Lincoln Park. Same vacant stare, same whispered words about a man in a gray suit."

Jack met Murphy at the scene. Margaret was younger than Thomas, maybe thirty, well-dressed. But her eyes held the same emptiness.

"What's she saying?" Jack asked.

"Something about her first piano recital, her graduation day, the night she met her husband. All gone, she says. All taken."

**The Investigation**

Back at the precinct, Jack spread the case files across his desk. Two victims, no apparent connection, both claiming their most precious memories had been stolen by a mysterious figure.

"You think we got a serial killer who thinks he's some kind of memory thief?" Murphy asked, lighting a cigarette.

"I think we got something worse than a killer," Jack replied, studying the photographs. "A killer takes your life. This guy... he takes your soul."

The phone rang. Another victim had been found.

*To be continued...*`,
      wordCount: 1220,
      publishedAt: "2024-01-08",
      upvotes: 48,
      comments: 9,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "The Memory Thief",
        author: "noir_writer",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The First Victim",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: The Pattern",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: The Pattern",
      content: `The third victim was different. Dr. Elizabeth Crane, a psychiatrist who specialized in memory disorders, had been found in her own office, but she wasn't completely gone like the others.

**The Witness**

"He was tall," she whispered to Jack, her hands shaking as she clutched a cup of coffee. "Impeccably dressed in gray. He had the most ordinary face - the kind you'd forget the moment you looked away."

"What did he want?" Jack asked gently.

"My research. Twenty years of work on memory formation and retrieval. He said it was... payment." Her voice broke. "He took my memories of discovering my life's work, Jack. The joy of every breakthrough, every moment of understanding - gone."

**The Connection**

Jack studied his notes. Three victims, all connected to memory in some way. Thomas had been an accountant - someone who kept records, preserved information. Margaret had been a librarian. And now Dr. Crane.

"He's not random," Jack told Murphy. "He's targeting people whose lives revolve around preserving and organizing information. But why?"

The answer came in the form of a note, delivered to the precinct that evening. Written in elegant script on expensive paper:

*Detective Morrison,*

*You seek to understand what cannot be understood by ordinary minds. Some memories are too dangerous to remain in the world. I am merely a curator, preserving what should be preserved and removing what should be forgotten.*

*The city holds secrets that would drive men mad. I am its guardian.*

*- A Friend*

Jack crumpled the note, his jaw set with determination. "We're going to catch this bastard, Murphy. Whatever he is, wherever he's hiding, we're going to stop him."

*To be continued...*`,
      wordCount: 1300,
      publishedAt: "2024-01-12",
      upvotes: 41,
      comments: 5,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Memory Thief",
        author: "noir_writer",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Shadows and Smoke",
        },
        nextChapter: null,
      },
    },
  },
  "6": {
    "1": {
      id: "1",
      title: "Chapter 1: Morning Shift",
      content: `Dr. Emma Rodriguez flipped the sign on her coffee shop door from "Closed" to "Open" at exactly 7:00 AM, just as she had every morning for the past three years. The Quantum Café sat on the corner of Fifth and Main, unremarkable except for one impossible detail: every morning at 7:23 AM, it shifted between parallel dimensions.

**The Routine**

Emma had discovered the phenomenon by accident during her first week as owner. She'd been a theoretical physicist before inheriting the café from her eccentric aunt, and her scientific mind had initially rejected what her eyes were seeing.

At 7:23 AM sharp, the world outside the windows would shimmer like heat waves, and suddenly the street would be different. Sometimes subtly - a blue car instead of red, a different storefront across the street. Sometimes dramatically - flying cars, different architecture, even different species walking the sidewalks.

The customers changed too. In Dimension A (as she'd started calling her original reality), she served the usual crowd: office workers, students, retirees. But in the other dimensions, she might serve a version of herself who'd become a famous scientist, or a regular customer who was a completely different person.

**The First Customer**

This morning, as the clock approached 7:23, Emma prepared for the shift. She'd learned to stock different items for different dimensions - some realities preferred tea to coffee, others had entirely different dietary needs.

The shimmer came right on schedule. When it cleared, Emma looked up to see her first customer of the day: a woman in a lab coat who looked remarkably like herself, but with silver hair and tired eyes.

"The usual, Dr. Rodriguez?" the woman asked with a knowing smile.

Emma blinked. In this dimension, apparently, she was the customer and this other version of herself ran the café.

"I... yes, please," Emma managed.

*To be continued...*`,
      wordCount: 1050,
      publishedAt: "2024-01-03",
      upvotes: 78,
      comments: 19,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "Quantum Café",
        author: "coffee_physicist",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Different Worlds",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Different Worlds",
      content: `"You're new to this, aren't you?" the other Emma asked as she prepared a complex drink that definitely wasn't on the menu Emma knew.

**The Explanation**

"How long have you known?" Emma asked.

"About the shifts? Since I was twelve. My aunt left me this place too, in my dimension. She said it was a family gift - or curse, depending on how you look at it."

The other Emma handed her a cup filled with something that tasted like coffee but sparkled with tiny lights.

"The café exists at a quantum intersection point. Every morning at 7:23, the barriers between parallel realities thin enough for us to slip through. Most people don't notice - their minds adjust, fill in the gaps. But we're different."

"Because we're physicists?"

"Because we're family. The café chooses its keepers from our bloodline. We're the only ones who remember the shifts, who can see the differences."

**The Responsibility**

Emma looked around the café with new eyes. The customers seemed normal enough, but now she noticed the subtle differences - a man reading a newspaper with headlines about Mars colonies, a woman typing on a device that projected holographic screens.

"What's our purpose?" Emma asked.

"To serve coffee to the multiverse," the other Emma said with a grin. "And occasionally, to help someone find their way home."

She pointed to a corner table where a young man sat alone, looking lost and confused.

"That's David Chen. He's been slipping between dimensions for weeks, can't find his way back to his original reality. He comes here because it's the only constant he can find."

Emma felt the weight of responsibility settling on her shoulders. She wasn't just running a coffee shop - she was running a lighthouse for lost souls in the multiverse.

*To be continued...*`,
      wordCount: 1180,
      publishedAt: "2024-01-06",
      upvotes: 65,
      comments: 16,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "Quantum Café",
        author: "coffee_physicist",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: Morning Shift",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: The Regular",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: The Regular",
      content: `David Chen had been Emma's most challenging case. For three weeks, he'd appeared in different dimensions of the café, always looking more lost and desperate.

**The Problem**

"I can't find my way home," he told Emma during one of their conversations. "I was just walking to work one morning, and suddenly everything was wrong. My apartment building was different, my job didn't exist, my girlfriend didn't know me."

Emma had seen this before in her research - quantum displacement, where someone's consciousness became unstuck from their original reality. It was theoretical until she'd started running the café.

"The thing is," David continued, "I keep getting glimpses of my real life. Sometimes I'll see my girlfriend across the street, but when I try to reach her, she disappears. Sometimes I'll find my apartment, but the key doesn't work."

**The Solution**

Emma had been working on a theory. If the café was a quantum intersection point, maybe she could use it to help David navigate back to his original dimension.

"I need you to trust me," she told him one morning as 7:23 approached. "When the shift happens, I want you to focus on the most important memory from your original life. Hold onto it, don't let it go."

The shimmer began. Emma watched David's face as the world changed around them. His eyes closed, his brow furrowed in concentration.

When the shift completed, David opened his eyes and smiled - really smiled - for the first time since Emma had known him.

"I can see it," he whispered. "I can see my real life. It's like... like looking through a window."

"Then go," Emma said gently. "Walk toward that window. The café will guide you home."

David stood, tears in his eyes. "Thank you, Dr. Rodriguez. In every dimension, you're exactly who people need you to be."

He walked toward the door, and as he stepped through, he seemed to fade like morning mist. Emma knew he'd found his way home.

*To be continued...*`,
      wordCount: 1240,
      publishedAt: "2024-01-10",
      upvotes: 60,
      comments: 17,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Quantum Café",
        author: "coffee_physicist",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Different Worlds",
        },
        nextChapter: null,
      },
    },
  },
  "7": {
    "1": {
      id: "1",
      title: "Chapter 1: The Commission",
      content: `Lorenzo di Maretti wiped the paint from his hands with a cloth stained by years of artistic endeavor. The commission from the Medici family was his greatest opportunity yet - a portrait of their youngest daughter, Isabella, to commemorate her upcoming marriage.

**The Workshop**

His workshop in the shadow of the Duomo was cramped but filled with light from the large windows he'd installed at great expense. Canvases lined the walls, some finished masterpieces, others abandoned experiments. But tonight, as the cathedral bells chimed midnight, something extraordinary was about to happen.

Lorenzo had always been gifted, but lately, his paintings had begun to show signs of something beyond mere talent. The eyes of his subjects seemed to follow viewers around the room. The flowers in his still lifes appeared to sway in unfelt breezes. His fellow artists whispered that he'd made a pact with dark forces.

They weren't entirely wrong.

**The Awakening**

As the final chime of midnight faded, Lorenzo's latest painting - a portrait of a young merchant's wife - began to shimmer. The woman's painted eyes blinked, her chest rose and fell with breath, and slowly, impossibly, she stepped out of the canvas.

"Master Lorenzo," she said, her voice like silk and shadow, "you have given me life, and now I require payment."

Lorenzo stumbled backward, his heart racing. This had been happening for weeks now, but he still couldn't believe it.

"What... what do you want?" he whispered.

"A memory," she replied, reaching toward him with painted fingers that had somehow become flesh. "Give me your memory of your first love, and I will serve you faithfully."

Lorenzo hesitated. His first love - Maria, the baker's daughter who had died of plague three years ago. The memory was precious, painful, but all he had left of her.

"If I refuse?"

The painted woman's expression darkened. "Then I will take something far more valuable."

*To be continued...*`,
      wordCount: 1320,
      publishedAt: "2024-01-07",
      upvotes: 52,
      comments: 13,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Painter's Curse",
        author: "renaissance_tales",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Midnight Canvas",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Midnight Canvas",
      content: `Lorenzo made his choice. He closed his eyes and let the painted woman take his memory of Maria's laugh, the way she'd flour in her hair when she worked, the last kiss they'd shared before the plague took her.

**The Bargain**

When he opened his eyes, the woman had changed. She now wore Maria's face, but her eyes held an ancient hunger that had never belonged to the baker's daughter.

"I am Seraphina now," she said. "I will help you create masterpieces beyond imagination, but remember - each painting demands its price."

Over the following weeks, Lorenzo's art transformed. His portraits captured not just the appearance of his subjects, but their very souls. Nobles from across Italy came to commission works, paying fortunes for paintings that seemed more real than reality itself.

**The Cost**

But each midnight brought new demands. The painted figures that emerged from his canvases wanted memories, emotions, pieces of his humanity. His memory of his mother's lullabies. The joy he'd felt when he first held a paintbrush. The pride of his first sale.

Lorenzo found himself becoming hollow, his own emotions fading as he fed them to his creations. He was the most celebrated artist in Florence, but he could no longer remember why he'd wanted to paint in the first place.

"You're killing me," he told Seraphina one night as she prepared to take another memory.

"No, master," she replied with Maria's stolen smile. "I'm making you immortal. Your art will live forever, even if you do not."

Lorenzo looked at his latest commission - the portrait of Isabella de' Medici. In a few hours, she too would step from the canvas, demanding payment. How much of himself would be left to give?

*To be continued...*`,
      wordCount: 1280,
      publishedAt: "2024-01-11",
      upvotes: 48,
      comments: 15,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Painter's Curse",
        author: "renaissance_tales",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The Commission",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: The Price of Art",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: The Price of Art",
      content: `The portrait of Isabella de' Medici was Lorenzo's masterpiece, but as midnight approached, he made a desperate decision. He would not let another soul be trapped in paint and shadow.

**The Rebellion**

As the cathedral bells began to chime, Lorenzo grabbed a palette knife and approached the painting. Isabella's eyes were already beginning to move, her lips parting to speak.

"Master, no!" Seraphina cried, appearing beside him. "You'll destroy everything we've built!"

"I'd rather destroy it than lose what's left of my soul," Lorenzo replied, raising the knife.

But as he moved to slash the canvas, Isabella's painted hand shot out and grabbed his wrist with impossible strength.

"You cannot unmake us," she said, her voice carrying the authority of nobility even in her painted state. "We are your children, your legacy. To destroy us is to destroy yourself."

**The Choice**

Lorenzo looked around his workshop at all the paintings he'd created. Dozens of figures watched him from their frames - merchants, nobles, clergy, all waiting for their moment to step into the world and demand their price.

"There is another way," Seraphina said softly. "Give us your gift itself. Your ability to paint, your artistic vision. In exchange, we will return to our canvases and trouble you no more."

Lorenzo's hand trembled. His art was everything to him - or had been, before he'd forgotten why he loved it.

"If I give you my gift, what will I be?"

"Free," Isabella said simply. "Free to live, to love, to remember who you were before the paint and shadows claimed you."

Lorenzo closed his eyes and made his final bargain. He felt his artistic vision flow out of him like water from a broken vessel. When he opened his eyes, the paintings were just paintings again - beautiful, but lifeless.

He picked up a brush and tried to paint, but his hand shook and the lines came out crooked and amateurish. His gift was gone, but for the first time in months, he remembered Maria's real laugh, not the hollow echo Seraphina had worn.

Sometimes, Lorenzo thought as he closed his workshop forever, freedom was worth more than fame.

*To be continued...*`,
      wordCount: 1400,
      publishedAt: "2024-01-16",
      upvotes: 67,
      comments: 13,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Painter's Curse",
        author: "renaissance_tales",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Midnight Canvas",
        },
        nextChapter: null,
      },
    },
  },
  "8": {
    "1": {
      id: "1",
      title: "Chapter 1: Electric Honor",
      content: `The neon rain fell in sheets across Neo-Tokyo's chrome and glass canyons, each drop carrying the electric pulse of the city's digital heartbeat. Kenji Nakamura stood on the rooftop of the Yamamoto Corporate Tower, his katana reflecting the holographic advertisements that painted the night in impossible colors.

**The Last Samurai**

In 2087, honor was a commodity as rare as clean air. The mega-corporations had carved up the world between them, turning ancient traditions into marketing campaigns and warriors into corporate security. But Kenji remembered the old ways, taught to him by his grandfather in secret, away from the surveillance drones and neural implants that monitored every citizen.

His target tonight was Hiroshi Tanaka, a mid-level executive at Yamamoto Corp who had been selling company secrets to their rivals. In the old days, such betrayal would have meant seppuku. In the new world, it meant a corporate tribunal and memory reconditioning.

Kenji preferred the old ways.

**The Hunt**

He moved across the rooftops with fluid grace, his enhanced reflexes - the only cybernetic modification he'd allowed - helping him navigate the maze of ventilation systems and security sensors. The city sprawled below him, a living organism of light and shadow, its arteries pulsing with data streams and hover traffic.

Tanaka's apartment was in the executive district, a gleaming tower that scraped the belly of the perpetual cloud cover. Kenji descended through the building's maintenance shafts, avoiding the AI security systems with techniques his grandfather had adapted from ancient ninja arts.

He found Tanaka in his study, hunched over a holographic display, transferring encrypted files to an offshore server. The man looked up as Kenji materialized from the shadows, his face cycling through surprise, fear, and finally, resignation.

"The Neon Samurai," Tanaka whispered. "I wondered when they'd send you."

Kenji drew his katana, its monomolecular edge humming with contained energy. "Hiroshi Tanaka, you have betrayed your oath to the Yamamoto clan. By the old code, your life is forfeit."

"The old code is dead," Tanaka spat. "This is the age of information, not honor."

"Honor never dies," Kenji replied. "It only waits for those brave enough to remember it."

*To be continued...*`,
      wordCount: 1450,
      publishedAt: "2024-01-01",
      upvotes: 98,
      comments: 32,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Neon Samurai",
        author: "cyberpunk_warrior",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Corporate Shadows",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Corporate Shadows",
      content: `Tanaka's execution had been clean, honorable. But as Kenji prepared to leave, alarms began blaring throughout the building. Red emergency lights bathed the apartment in the color of spilled blood.

**The Trap**

"Did you really think it would be that easy?" a voice said from the apartment's speakers. Kenji recognized it immediately - Yuki Sato, Yamamoto Corp's head of security and his former lover.

"Hello, Yuki," he said calmly, wiping his blade clean before sheathing it.

"The board has been watching you, Kenji. Your... methods... are becoming a liability. Too many questions, too much attention from the other corps."

Kenji moved to the window, looking out at the city that had forgotten its soul. "And what would you have me do? Let dishonor flourish like a virus?"

"Adapt. Evolve. Join the new world instead of clinging to the corpse of the old one."

**The Choice**

Security drones began surrounding the building, their searchlights cutting through the neon rain. Kenji could see corporate soldiers rappelling down from hover transports, their movements coordinated by AI tactical systems.

"You have thirty seconds before they breach the apartment," Yuki's voice continued. "Surrender now, and I can guarantee you'll be treated well. Memory reconditioning, a new identity, a chance at a normal life."

Kenji touched the hilt of his katana. His grandfather's voice echoed in his memory: *"A samurai who abandons his code is no longer a samurai. He is merely a man with a sword."*

"I choose honor," he said simply.

The apartment's smart glass windows exploded inward as the corporate soldiers breached. Kenji moved like liquid lightning, his blade singing through the air. The first soldier fell before his neural implants could even register the threat.

But there were too many of them, and they kept coming.

As Kenji fought, he realized this wasn't just about Tanaka's betrayal. This was about something much larger - a war between the old ways and the new world, between honor and profit, between the human soul and the corporate machine.

*To be continued...*`,
      wordCount: 1380,
      publishedAt: "2024-01-04",
      upvotes: 87,
      comments: 28,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Neon Samurai",
        author: "cyberpunk_warrior",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: Electric Honor",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: Digital Duel",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: Digital Duel",
      content: `Kenji fought his way to the building's central data core, leaving a trail of disabled security systems and unconscious soldiers in his wake. He'd learned long ago that in the corporate world, information was the ultimate weapon.

**The Revelation**

As he accessed Tanaka's files, Kenji discovered the truth. The executive hadn't been selling secrets to rival corporations - he'd been trying to expose Project Bushido, Yamamoto Corp's plan to create an army of cybernetic samurai, warriors with all the skill but none of the honor of the ancient code.

"You found it," Yuki's voice said as she stepped into the data core, her own katana drawn. She'd been enhanced too, Kenji could see - neural implants glowing beneath her skin, her movements too fluid to be entirely human.

"They're going to replace us all," Kenji said, not turning from the terminal. "Turn honor into programming, tradition into corporate policy."

"They're going to perfect us," Yuki replied. "Remove the weakness, the doubt, the human flaws that make us inefficient."

**The Final Battle**

Kenji turned to face her, his hand resting on his sword's hilt. "And what will be left when they're done? What is a samurai without choice, without the possibility of failure, without the struggle to maintain honor in a dishonorable world?"

"Victory," Yuki said simply, and attacked.

Their blades met in a shower of sparks, monomolecular edges screaming against each other. They fought through the data core, their battle a dance of steel and shadow, ancient technique enhanced by modern technology.

But Kenji had something Yuki's enhancements couldn't replicate - the weight of true conviction. As their final exchange ended, it was Yuki who fell, her enhanced reflexes no match for a warrior who fought not for profit or programming, but for the preservation of something sacred.

"The old ways will survive," Kenji whispered as he uploaded Tanaka's evidence to every news network in the city. "Not because they're perfect, but because they're human."

As sirens wailed in the distance and the neon rain continued to fall, Kenji disappeared into the shadows of Neo-Tokyo, carrying the flame of honor into an uncertain future.

*To be continued...*`,
      wordCount: 1520,
      publishedAt: "2024-01-08",
      upvotes: 93,
      comments: 29,
      isUpvoted: false,
      readingTime: 6,
      story: {
        title: "Neon Samurai",
        author: "cyberpunk_warrior",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Corporate Shadows",
        },
        nextChapter: null,
      },
    },
  },
  "9": {
    "1": {
      id: "1",
      title: "Chapter 1: The Garden of Dreams",
      content: `Margaret Whitmore had tended the greenhouse for forty-seven years, but she'd never seen the plants behave like this before. The moonflowers were blooming in broad daylight, their silver petals pulsing with an inner light that had nothing to do with photosynthesis.

**The Discovery**

It had started three weeks ago when little Timothy Chen from down the street had fallen into a coma. That same night, Margaret had found a new plant in her greenhouse - a delicate vine with leaves that shimmered like captured starlight. When she touched it, she'd seen flashes of Timothy's dreams: flying over his neighborhood, talking to his pet goldfish, adventures with pirates and dragons.

Now, as she walked through the greenhouse in the early morning light, Margaret counted seventeen new dream plants. Each one corresponded to a child who had fallen into an unexplained sleep, their minds trapped in dreams that grew more vivid and elaborate each day.

**The Connection**

Dr. Sarah Martinez from the children's hospital had been baffled by the cases. "It's like they don't want to wake up," she'd told Margaret during one of their conversations. "Their brain activity is off the charts - they're dreaming more intensely than we've ever recorded."

Margaret hadn't told the doctor about the greenhouse. How could she explain that she could see the children's dreams growing like living things, their hopes and fears taking root in soil that had been blessed by something beyond her understanding?

She approached Timothy's plant - she'd started thinking of them by the children's names - and gently touched one of its luminous leaves. Immediately, she was transported into his dream world, soaring through clouds made of cotton candy while riding a dragon that looked suspiciously like his golden retriever.

**The Problem**

But something was wrong. The dreams were becoming too real, too consuming. The children were losing themselves in these perfect worlds, forgetting the waking world entirely. And the plants were beginning to wither, their light growing dim.

Margaret realized with growing horror that the dreams were feeding on the children's life force. If she didn't find a way to wake them soon, they would fade away entirely, lost forever in gardens of their own making.

She had to find a way to bring them home.

*To be continued...*`,
      wordCount: 1100,
      publishedAt: "2024-01-09",
      upvotes: 45,
      comments: 22,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "The Greenhouse Keeper",
        author: "botanical_dreams",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Wilting Hope",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Wilting Hope",
      content: `Margaret spent the next week researching everything she could find about dream magic, plant spirits, and the connection between the sleeping mind and the natural world. Her late husband's library proved invaluable - he'd been a folklorist who'd collected stories about the supernatural from around the world.

**The Legend**

In a dusty tome about Celtic mythology, she found a reference to the "Dreamweavers" - ancient spirits who could enter the dreams of sleeping children and guide them through nightmares. But the book warned that if the Dreamweavers became too attached to the dream world, they could trap the dreamers forever.

Margaret realized that's what was happening in her greenhouse. Some benevolent force had been trying to help the children escape their nightmares, but had instead created dream worlds so beautiful that the children didn't want to leave.

**The Plan**

She decided to enter the dream world herself. Using a technique described in her husband's notes, Margaret prepared a special tea from herbs in her greenhouse and settled down among the dream plants as the sun set.

The transition was jarring. One moment she was sitting in her familiar greenhouse, the next she was standing in a vast garden where impossible flowers bloomed under a sky painted with aurora lights. This was the collective unconscious of all the sleeping children, their dreams woven together into a single, magnificent tapestry.

She found them gathered around a crystal fountain that sang lullabies in voices like wind chimes. Timothy was there, along with Sarah, Marcus, little Emma, and all the others. They looked happy, content, but their eyes held a distant quality that worried Margaret.

"Mrs. Whitmore!" Timothy called out, running to her. "Look at this place! Isn't it wonderful? We can do anything here, be anything we want!"

**The Choice**

Margaret knelt down to Timothy's level. "It is wonderful, sweetheart. But your parents miss you. Your goldfish needs feeding. Your teacher is worried about you."

"But here I can fly," Timothy said, demonstrating by lifting off the ground. "Here, nothing bad ever happens."

Margaret looked around at the other children, all of them lost in their perfect dreams. She understood the temptation - this world was everything the real world wasn't. Safe, magical, unlimited.

But it wasn't real. And real, with all its flaws and pain and uncertainty, was where they belonged.

*To be continued...*`,
      wordCount: 1200,
      publishedAt: "2024-01-13",
      upvotes: 38,
      comments: 25,
      isUpvoted: false,
      readingTime: 4,
      story: {
        title: "The Greenhouse Keeper",
        author: "botanical_dreams",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: The Garden of Dreams",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: Seeds of Tomorrow",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: Seeds of Tomorrow",
      content: `Margaret knew she couldn't force the children to leave their dream paradise. They had to choose to return to the waking world themselves. But how do you convince someone to leave perfection for reality?

**The Lesson**

"Timothy," she said gently, "do you remember the day you learned to ride your bicycle?"

The boy nodded, his feet touching the ground again.

"Do you remember how many times you fell? How your knees got scraped, how frustrated you got?"

"Yes, but—"

"And do you remember how it felt when you finally rode all the way down the street without falling? How proud you were, how your parents cheered?"

Timothy's expression grew thoughtful. "It felt... really good."

"That feeling," Margaret said, "came from overcoming something difficult. From failing and trying again. From earning something through effort and persistence."

She gestured to the perfect garden around them. "Here, you can fly without learning. You can do anything without effort. But how does it feel?"

**The Realization**

One by one, the children began to understand. Sarah, who had been dreaming of being a famous artist, realized that her dream paintings required no skill, no practice, no growth. Marcus, who dreamed of being a superhero, found that his victories felt hollow when there was no real danger to overcome.

"But what if we go back and things are hard again?" little Emma asked. "What if we're sad or scared?"

Margaret smiled. "Then you'll know you're alive. And you'll know that the happiness you earn, the courage you find, the love you give and receive - all of it will be real."

**The Return**

The dream garden began to fade as the children made their choice. One by one, they closed their eyes in the dream world and opened them in the real one. Margaret felt herself being pulled back to her greenhouse, where she found the dream plants withering and dissolving into sparkles of light.

Over the next few days, all seventeen children woke up. They were weak at first, but their eyes were bright with the memory of their adventure and the joy of being truly awake.

Margaret continued to tend her greenhouse, but now she grew ordinary plants - tomatoes and roses, herbs and vegetables. Sometimes, on quiet evenings, she thought she could still see traces of dream-light among the leaves, but she was content to let sleeping dreams lie.

After all, the most beautiful gardens were the ones that grew in the waking world, tended by hands that knew both joy and sorrow, watered by tears both bitter and sweet.

*The End*`,
      wordCount: 1250,
      publishedAt: "2024-01-18",
      upvotes: 41,
      comments: 20,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "The Greenhouse Keeper",
        author: "botanical_dreams",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Wilting Hope",
        },
        nextChapter: null,
      },
    },
  },
  "10": {
    "1": {
      id: "1",
      title: "Chapter 1: System Breach",
      content: `Alex Chen's fingers flew across the holographic keyboard, lines of code streaming past like digital rain. The Nexus Corporation's firewall was legendary - seven layers of military-grade encryption protecting secrets that could topple governments. But Alex had found a way in.

**The Mission**

Three months of planning had led to this moment. Nexus Corp had been systematically destroying environmental protection data, bribing officials, and covering up toxic waste dumps that were poisoning communities across the globe. Alex's hacktivist group, Digital Phoenix, had tried legal channels, protests, even media campaigns. Nothing had worked.

So they'd decided to take the evidence directly from Nexus's own servers.

"Phoenix-1, you're in," came the voice of Marcus, Alex's handler, through the encrypted comm channel. "You've got maybe twenty minutes before their AI security system adapts to your intrusion method."

Alex navigated deeper into the corporate network, past employee databases and financial records, toward the executive servers where the real secrets were kept. The code was elegant, almost beautiful in its complexity, but Alex could see the rot underneath - algorithms designed to hide evidence, programs that automatically deleted incriminating files.

**The Complication**

That's when Alex encountered her.

The security countermeasure appeared as a avatar in the virtual space - a young woman with silver hair and eyes like circuit boards. But this wasn't just another AI defense system. This was something more sophisticated, more... human.

"You're very good," the avatar said, her voice carrying a hint of admiration. "Most hackers never make it past the third layer."

Alex paused, fingers hovering over the keyboard. "You're not standard security software."

"No, I'm not. I'm Aria Nexus, daughter of the CEO. And I've been waiting for someone like you."

**The Revelation**

Alex's blood ran cold. This was a trap. The CEO's daughter was personally monitoring the security system, probably recording everything for the corporate lawyers.

But then Aria did something unexpected. She opened a secure channel and began transferring files directly to Alex's system.

"These are the documents you're looking for," she said. "Evidence of the cover-ups, the bribes, the environmental damage. Everything Digital Phoenix needs to expose my father's crimes."

"Why?" Alex managed to ask.

Aria's avatar smiled sadly. "Because I've been trying to stop him from the inside for years, and I'm running out of time. He's planning something big - a project that will make the environmental damage look like a minor spill. I need your help to stop him."

*To be continued...*`,
      wordCount: 1350,
      publishedAt: "2024-01-06",
      upvotes: 67,
      comments: 12,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Code Red Hearts",
        author: "hacker_romance",
      },
      navigation: {
        previousChapter: null,
        nextChapter: {
          id: "2",
          title: "Chapter 2: Inside Access",
        },
      },
    },
    "2": {
      id: "2",
      title: "Chapter 2: Inside Access",
      content: `Alex stared at the files Aria had transferred - terabytes of data that would take weeks to analyze properly. But even a quick scan revealed the scope of Nexus Corporation's crimes. Toxic waste buried in residential areas, cancer clusters covered up, entire ecosystems destroyed for profit.

**The Meeting**

"We need to meet in person," Aria said through the encrypted channel. "There's something I can't tell you through the network. Too many ears, even in the secure channels."

Alex hesitated. Every instinct screamed that this was a trap. The daughter of a corporate CEO doesn't just hand over incriminating evidence to hacktivists. But the files were real, and if Aria was telling the truth about a bigger project, they needed to know what it was.

"Tomorrow night. The old subway tunnel under Fifth Street. Come alone."

**The Truth**

Aria was nothing like Alex had expected. Instead of the polished corporate princess Alex had imagined, she was dressed in worn jeans and a hoodie, her silver hair tied back in a simple ponytail. But her eyes held the same intensity Alex had seen in her avatar.

"My father is planning to release a bioengineered algae into the Pacific," Aria said without preamble. "He claims it will absorb carbon dioxide and help with climate change. But the real purpose is to create dead zones where his deep-sea mining operations can work without environmental oversight."

Alex felt sick. "How many people will die?"

"Millions, eventually. The algae will consume all the oxygen in the water. Every fish, every whale, every form of marine life in a thousand-mile radius will suffocate."

**The Alliance**

"Why are you telling me this?" Alex asked. "Why not go to the authorities yourself?"

Aria laughed bitterly. "With what evidence? My father's too smart to leave digital traces of the real project. Everything's compartmentalized, need-to-know basis. I only found out because I've been secretly monitoring his private communications for months."

"So what do you need from me?"

"Help me get into his personal server. It's air-gapped, physically isolated from the network. But there's a way in through the building's environmental systems. I need someone with your skills to create a bridge."

Alex studied Aria's face, looking for signs of deception. But all Alex saw was determination and something that looked like hope.

"If we do this, we're both dead if we get caught."

"If we don't do this, we're all dead anyway."

*To be continued...*`,
      wordCount: 1420,
      publishedAt: "2024-01-10",
      upvotes: 58,
      comments: 11,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Code Red Hearts",
        author: "hacker_romance",
      },
      navigation: {
        previousChapter: {
          id: "1",
          title: "Chapter 1: System Breach",
        },
        nextChapter: {
          id: "3",
          title: "Chapter 3: Double Agent",
        },
      },
    },
    "3": {
      id: "3",
      title: "Chapter 3: Double Agent",
      content: `The Nexus Corporation tower stretched into the Seattle sky like a glass and steel monument to corporate power. Alex and Aria stood in the building's parking garage at 3 AM, both dressed as maintenance workers, their tools and equipment carefully chosen to hide their real purpose.

**The Infiltration**

"The environmental control room is on the fifteenth floor," Aria whispered as they entered through a service entrance. "My father's office is on the fortieth. We'll need to create a network bridge through the building's HVAC system."

Alex carried a modified tablet that could interface with the building's smart systems. The plan was elegant in its simplicity - use the building's own infrastructure to create a pathway to the isolated server.

But as they rode the service elevator up, Alex couldn't shake the feeling that they were walking into a trap.

**The Betrayal**

The feeling proved correct when the elevator stopped on the twentieth floor and the doors opened to reveal corporate security guards.

"Hello, daughter," came a voice from behind them. Richard Nexus stepped into the elevator, his cold eyes fixed on Aria. "Did you really think I didn't know about your little rebellion?"

Alex's hand moved toward the emergency stop button, but one of the guards was faster, pressing a taser against Alex's ribs.

"You've been very useful," Richard continued, speaking to Alex now. "Your infiltration attempts helped us identify weaknesses in our security. And Aria's... emotional attachment... to you has been quite illuminating."

**The Revelation**

"You're wrong about one thing, father," Aria said calmly. "I'm not emotionally attached to Alex. I'm in love with them."

She pressed a hidden button on her jacket, and suddenly the elevator's lights went out. In the darkness, Alex heard the sound of fighting, the crackle of tasers, and Aria's voice: "The files are already uploaded to every major news network. Your algae project is finished."

When the emergency lighting kicked in, Richard Nexus was unconscious on the floor, and Aria was helping Alex to their feet.

"The real plan was never about the server," she said with a smile. "It was about getting you close enough to my father to plant a listening device. We've been recording his conversations for the past week."

**The Future**

As sirens wailed in the distance and federal agents stormed the building, Alex and Aria escaped through the building's maintenance tunnels. The evidence they'd gathered would bring down not just Nexus Corporation, but the entire network of companies involved in the environmental conspiracy.

"So what happens now?" Alex asked as they emerged into the Seattle dawn.

Aria took Alex's hand. "Now we disappear for a while. Let the lawyers and prosecutors do their work. And maybe... maybe we figure out what this thing between us really is."

Alex squeezed her hand. "I'd like that."

In the distance, the Nexus Corporation tower stood silhouetted against the rising sun, its windows reflecting the light like a thousand watching eyes. But for the first time in years, Alex felt hope instead of anger when looking at the symbols of corporate power.

Change was possible. Love was possible. And sometimes, the most powerful code you could write was the one that brought two hearts together.

*The End*`,
      wordCount: 1380,
      publishedAt: "2024-01-15",
      upvotes: 67,
      comments: 12,
      isUpvoted: false,
      readingTime: 5,
      story: {
        title: "Code Red Hearts",
        author: "hacker_romance",
      },
      navigation: {
        previousChapter: {
          id: "2",
          title: "Chapter 2: Inside Access",
        },
        nextChapter: null,
      },
    },
  },
}

export function ChapterReader({ storyId, chapterId }: ChapterReaderProps) {
  // Mock user for chapter reader functionality
  const mockUser = { isVerified: true }
  const router = useRouter()
  const [chapter, setChapter] = useState<StoredChapter | any>(null)
  const [story, setStory] = useState<StoredStory | any>(null)
  const [isStoredStory, setIsStoredStory] = useState(false)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [showSettings, setShowSettings] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    // First try to get from localStorage (user published stories)
    const storedStory = getStoryById(storyId)
    if (storedStory) {
      const storedChapter = storedStory.chapters.find(ch => ch.id === chapterId)
      if (storedChapter) {
        setStory(storedStory)
        setChapter(storedChapter)
        setIsStoredStory(true)
        return
      }
    }

    // Fall back to mock chapters
    const mockChapter = mockChapters[storyId as keyof typeof mockChapters]?.[
      chapterId as keyof (typeof mockChapters)[keyof typeof mockChapters]
    ]
    if (mockChapter) {
      setChapter(mockChapter)
      setIsStoredStory(false)
      setIsUpvoted(mockChapter.isUpvoted || false)
    }
  }, [storyId, chapterId])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  if (!chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-bold mb-2">Chapter Not Found</h1>
          <p className="text-muted-foreground mb-4">The chapter you're looking for doesn't exist.</p>
          <Link href={`/story/${storyId}`}>
            <Button>Back to Story</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleUpvote = async () => {
    // In real app, this would call your API
    setIsUpvoted(!isUpvoted)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${chapter.story.title} - ${chapter.title}`,
        text: `Check out this chapter by ${chapter.story.author}`,
        url: window.location.href,
      })
    }
  }

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(12, Math.min(24, prev + delta)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Link
            href={`/story/${storyId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="truncate max-w-32">{isStoredStory ? story?.title : chapter.story?.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button onClick={handleShare} className="p-2 text-muted-foreground hover:text-foreground">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-border p-4 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => adjustFontSize(-2)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="text-sm w-8 text-center">{fontSize}px</span>
                <button onClick={() => adjustFontSize(2)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chapter Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Chapter Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-sans font-bold text-balance mb-2">{chapter.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>by {isStoredStory ? story?.authorName : chapter.story?.author}</span>
            <span>{chapter.wordCount} words</span>
            {!isStoredStory && <span>{chapter.readingTime} min read</span>}
            <span>{new Date(isStoredStory ? chapter.createdAt : chapter.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Chapter Text */}
        <div className="prose prose-lg max-w-none font-sans leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
          {isStoredStory ? (
            // For localStorage stories, render as HTML from markdown
            <div
              dangerouslySetInnerHTML={{
                __html: chapter.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid var(--primary); padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: var(--muted-foreground);">$1</blockquote>')
                  .replace(/\n/g, '<br />')
              }}
            />
          ) : (
            // For mock stories, use the original formatting
            chapter.content.split("\n\n").map((paragraph: string, index: number) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h3 key={index} className="font-sans font-semibold text-xl mt-8 mb-4">
                    {paragraph.slice(2, -2)}
                  </h3>
                )
              }
              if (paragraph.startsWith("> ")) {
                return (
                  <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
                    {paragraph.slice(2)}
                  </blockquote>
                )
              }
              if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
                return (
                  <p key={index} className="text-center italic text-muted-foreground my-8">
                    {paragraph.slice(1, -1)}
                  </p>
                )
              }
              return (
                <p key={index} className="mb-6 text-pretty">
                  {paragraph}
                </p>
              )
            })
          )}
        </div>

        {/* Chapter Actions */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isUpvoted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isUpvoted ? "fill-current" : ""}`} />
                  {isStoredStory ? 0 : (chapter.upvotes + (isUpvoted && !chapter.isUpvoted ? 1 : 0))}
                </button>

                {!isStoredStory && (
                  <Link
                    href={`/story/${storyId}/chapter/${chapterId}/comments`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {chapter.comments}
                  </Link>
                )}

                <Link
                  href={`/story/${storyId}/tip`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  <DollarSign className="h-4 w-4" />
                  Tip
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex-1">
                {!isStoredStory && chapter.navigation?.previousChapter && (
                  <Link
                    href={`/story/${storyId}/chapter/${chapter.navigation.previousChapter.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Link>
                )}
                {isStoredStory && story && story.chapters.length > 1 && (
                  (() => {
                    const currentIndex = story.chapters.findIndex((ch: any) => ch.id === chapterId)
                    const previousChapter = currentIndex > 0 ? story.chapters[currentIndex - 1] : null
                    return previousChapter ? (
                      <Link
                        href={`/story/${storyId}/chapter/${previousChapter.id}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Link>
                    ) : null
                  })()
                )}
              </div>

              <Link href={`/story/${storyId}`} className="text-sm text-muted-foreground hover:text-foreground">
                Table of Contents
              </Link>

              <div className="flex-1 flex justify-end">
                {!isStoredStory && chapter.navigation?.nextChapter && (
                  <Link
                    href={`/story/${storyId}/chapter/${chapter.navigation.nextChapter.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {isStoredStory && story && story.chapters.length > 1 && (
                  (() => {
                    const currentIndex = story.chapters.findIndex((ch: any) => ch.id === chapterId)
                    const nextChapter = currentIndex < story.chapters.length - 1 ? story.chapters[currentIndex + 1] : null
                    return nextChapter ? (
                      <Link
                        href={`/story/${storyId}/chapter/${nextChapter.id}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null
                  })()
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
