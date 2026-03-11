import { Player } from '@lottiefiles/react-lottie-player';
import coolAnim from '../assets/lottie-animations/networking.json';

export default function LottieAnimation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <Player
        autoplay
        loop
        src={coolAnim}
        style={{ height: '500px', width: '500px' }}
      />
    </div>
  );
}