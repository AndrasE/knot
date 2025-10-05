import confetti from "canvas-confetti";

export default function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.7 },
  });
}
