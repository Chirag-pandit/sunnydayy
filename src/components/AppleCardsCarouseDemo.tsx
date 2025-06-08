"use client";

// import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";
// import logo from './logo-png.png'====>add our app logo here 

const ReviewContent = ({ review, rating, name, title }: { review: string; rating: number; name: string; title: string }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <p className="text-gray-700 mb-4">{review}</p>
      <div className="flex items-center mb-2">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>
      <p className="font-semibold">{name}</p>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full py-10">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-500 dark:text-neutral-100 font-sans">
        By Our Users
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Mr. Shakti",
    title: "Excellent training programs and professional coaching",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250605-WA0037.jpg-GJQCXM9PST0G98k7tJjcmfWpG3Cfz9.jpeg",
    content: (
      <ReviewContent
        review="The MMA training here has completely transformed my fitness and fighting skills. The coaches are incredibly knowledgeable and the training programs are well-structured. I've seen massive improvements in my Brazilian Jiu-Jitsu technique and overall conditioning."
        rating={5}
        name="Shakti Sharma"
        title="BJJ Practitioner"
      />
    ),
  },
  {
   
    category: "Mr. Sidharth",
    title: "Top-notch facilities and expert guidance",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250605-WA0024.jpg-jr8EygvGej8ae0s6HDsGYd4LTUkj4A.jpeg",
    content: (
      <ReviewContent
        review="This place offers world-class MMA training with state-of-the-art equipment. The instructors are former professional fighters who bring real experience to every session. The community here is supportive and pushes you to be your best."
        rating={5}
        name="Sidharth Kumar"
        title="MMA Fighter"
      />
    ),
  },
  {
    category: "Charles",
    title: "Perfect training environment for serious fighters",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-01-25_10-12-53-113.jpg-104QqGhF1mp4JrTfMabuQhAOpsaRZi.jpeg",
    content: (
      <ReviewContent
        review="The heavy bag training and striking techniques I learned here have elevated my game to the next level. The gym has everything you need for serious MMA training - from grappling mats to professional-grade equipment."
        rating={5}
        name="Charles Mendes"
        title="Striking Coach"
      />
    ),
  },
  {
    category: "Alex",
    title: "Outstanding boxing and MMA programs",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-01-25_10-13-50-151.jpg-EUSR5SsESNuPQX24YZiYlmvcS4aEFx.jpeg",
    content: (
      <ReviewContent
        review="The boxing program here is exceptional. The coaches focus on proper technique and conditioning. I've improved my footwork, combinations, and defensive skills tremendously. Highly recommend for anyone serious about combat sports."
        rating={5}
        name="Alex Rodriguez"
        title="Boxing Enthusiast"
      />
    ),
  },
  {
    category: "Sunny",
    title: "Premium gear and professional training",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-04_12-21-17-362.jpg-5n3MM2fNzcx7diXE1kiihoUMS1UOqG.jpeg",
    content: (
      <ReviewContent
        review="Not only do they provide excellent training, but the gear and equipment available here is top-quality. The custom fight shorts and training gear have helped me perform better and look professional in competitions."
        rating={4}
        name="Sunny Patel"
        title="Amateur Fighter"
      />
    ),
  },
  {
    category: "D",
    title: "AI will identify the strangers.",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250116-WA0012.jpg-CNceqXosb8o8TuDWtyKuyN3LiKiq2J.jpeg",
    content: (
      <ReviewContent
        review="SunnyDay ke MMA T-shirts pehnte hi ek alag confidence feel hota hai. Fabric lightweight hone ke bawajood tough hai – exactly what a fighter needs. Jab AI design print pe logon ki nazar padti hai, sab wahi puchhte hain – 'Kaha se liya?'"
        rating={5}
        name="Shivansh Verma"
        title="MMA Athlete"
      />
    ),
  },
  {
    category: "E",
    title: "Caregivers can set safe zones",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-04_20-13-16-049.jpg-AXAPxy1meRYesGm7MSOgF050VoynzG.jpeg",
    content: (
      <ReviewContent
        review="SunnyDay ke hoodies ne mujhe style ke sath comfort bhi diya. Meri sister ke liye bhi hoodie li aur usne kaha – 'It's like a hug in fabric.' Safe zone ka matlab ab sirf GPS nahi, kapdon me bhi hota hai. Highly recommended!"
        rating={5}
        name="Ritika Anand"
        title="Fitness Caregiver"
      />
    ),
  },
  {
    category: "F",
    title: "Minds games for sharpeness of the mind.",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_24-08-09_15-23-53-793.jpg-GhHmse1wz9HEksN8UNmHncCZJj6qMT.jpeg",
    content: (
      <ReviewContent
        review="SunnyDay ke compression wear me focus aur concentration level boost hota hai. Jab mind sharp hona chahiye during intense training, tab yeh kapde discomfort nahi dete. It's like gear that trains your brain too."
        rating={5}
        name="Rizwan Shaikh"
        title="Combat Strategist"
      />
    ),
  },
  {
    category: "G",
    title: "Medication Progress Tracking and Progress Reports",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-04-05_14-14-49-110.jpg-mxtP6tV3IsPfC092kmm5SSrHY4LGEM.jpeg",
    content: (
      <ReviewContent
        review="Injury recovery ke dauran SunnyDay ka oversized wear pehna. Loose, breathable aur super soft – meri recovery ko fast-forward kiya. Ab jab bhi progress track karta hoon, SunnyDay mera go-to brand hai."
        rating={5}
        name="Dev Mehta"
        title="Rehab Athlete"
      />
    ),
  },
  {
    category: "H",
    title: "Outdoor fitness tracking and activity monitoring",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6765.jpg-0SkeV46UUMbkY8vWvl3irYhOAxxqAy.jpeg",
    content: (
      <ReviewContent
        review="Jogging se lekar hill climb tak, SunnyDay ke shorts sweat absorb karte hain bina chafe ke. Outdoor activities me kapda move karta hai body ke sath – not against it. Perfect for daily grind in the sun."
        rating={5}
        name="Yashpal Singh"
        title="Outdoor Fitness Coach"
      />
    ),
  },
  {
    category: "I",
    title: "Achievement system and progress rewards",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-08%20at%2012.08.30_cd546e4f.jpg-bRxjw2ZAVEVRXlUYG27M3TEjG8NLdr.jpeg",
    content: (
      <ReviewContent
        review="Har fight ke baad SunnyDay se kuch naya kharidna meri ritual ban chuki hai. Yeh brand reward jaisa feel karata hai – stylish, strong aur street-smart. Jab log bolte hain 'tu glow kar raha hai', main kehta hoon – SunnyDay ka effect hai bhai!"
        rating={5}
        name="Karan Batra"
        title="Body Transformation Coach"
      />
    ),
  },
  
];