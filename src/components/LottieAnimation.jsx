import { Player } from '@lottiefiles/react-lottie-player';
import coolAnim from '../assets/lottie-animations/lottie-animation-eighth.json';

export default function LottieAnimation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <Player
        autoplay
        loop
        src={coolAnim}
        style={{ height: '150px', width: '150px' }}
      />
    </div>
  );
}