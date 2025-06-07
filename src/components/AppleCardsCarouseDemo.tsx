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

const DummyContent = () => {    
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700">
              Dementia patients struggle with memory loss, daily task management, and recognizing loved ones. Traditional reminders are ineffective, and there are safety concerns such as wandering. Additionally, emotional well-being and cognitive stimulation are often neglected.
              </span>{" "}
              NeuroNest is an AI-powered mobile/web application that provides adaptive reminders, facial recognition, emergency tracking, and emotional well-being support to help dementia patients and caregivers manage daily life efficiently.


            </p>
            <img
            //   src={logo}
                src="https://images.unsplash.com/photo-1619976336288-38db38e4c503?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

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
    title:  "AI will identify the strangers .",
    src: "https://media.istockphoto.com/id/1168365129/photo/authentication-by-facial-recognition-concept-biometric-security-system.jpg?s=2048x2048&w=is&k=20&c=JwPYe0TPiH4JQUe5Z5g59Iq2AQE7MsW302d9YN4l4gc=",
    content: <DummyContent />,
  },
  {
    category: "E",
    title: "Caregivers can set safe zones ",
    src: "https://media.istockphoto.com/id/662948926/photo/women-hands-holding-phone-with-application-call-taxi-on-screen.jpg?s=2048x2048&w=is&k=20&c=0QolN5h2P8v4u_fLTslZSQQGWURifq724sz4DULkzyY=",
    content: <DummyContent />,
  },

  {
    category: "F",
    title: "Minds games for sharpeness of the mind.",
    src: "https://images.unsplash.com/photo-1619976336288-38db38e4c503?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "G",
    title: "Medication Progress Tracking and Progress Reports",
    src: "https://images.unsplash.com/photo-1581159186721-b68b78da4ec9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "H",
    title: "Music Therapy and Voice Notes",
    src: "https://images.unsplash.com/photo-1723912628184-dfde150fab82?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "I",
    title: "SMS alerts for the patient.",
    src: "https://images.unsplash.com/photo-1561395663-cfe4cf1be1e7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];