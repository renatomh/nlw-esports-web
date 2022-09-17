import { useState, useEffect } from 'react';
import axios from 'axios';

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react';

import * as Dialog from '@radix-ui/react-dialog';

import { CreateAdModal } from './components/CreateAdModal';
import { CreateAdBanner } from './components/CreateAdBanner';
import { GameBanner } from './components/GameBanner';

import './styles/main.css';

import logoImg from './assets/logo-nlw-esports.svg';

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true, 
    mode: "free", 
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(min-width: 600px)": {
        slides: { perView: 3, spacing: 15 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 4, spacing: 15 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 5, spacing: 15 },
      },
    },
    slides: { perView: 1, spacing: 5 },
    created: () => {
      console.log('created');
    }
  }, []);
  const [games, setGames] = useState<Game[]>([]);

  /* Fetching items on API */
  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
        setGames(response.data);
      });
    instanceRef.current?.animator.start;
  },
  /* If no item is set on dependency array, it'll run just once the component render */
    []
  )

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">duo</span> está aqui.
      </h1>

      <div ref={sliderRef} className="mt-16 keen-slider">
        {games.map(game => {
          return (
            <div className="px-2 keen-slider__slide">
              <GameBanner
                key={game.id}
                title={game.title}
                bannerUrl={game.bannerUrl}
                adsCount={game._count.ads}
              />
            </div>
          )
        })}
      </div>

      <Dialog.Root>
        <CreateAdBanner />

        <CreateAdModal />
      </Dialog.Root>

    </div>
  )
}

export default App
