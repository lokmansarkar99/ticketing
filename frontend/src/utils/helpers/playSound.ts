import success from "/sound/success.wav";
import welcome from "/sound/welcome.wav";
import warning from "/sound/warning.wav";
import remove from "/sound/remove.wav";

export const playSound = (
  variant: "success" | "welcome" | "warning" | "remove" | "add",
  volume: number = 1.0
) => {
  if (variant === "success") {
    const audio = new Audio(success);
    audio.volume = volume;
    return audio.play();
  }
  if (variant === "welcome") {
    const audio = new Audio(welcome);
    audio.volume = volume;
    return audio.play();
  }
  if (variant === "warning") {
    const audio = new Audio(warning);
    audio.volume = volume;
    return audio.play();
  }
  if (variant === "remove") {
    const audio = new Audio(remove);
    audio.volume = volume;
    return audio.play();
  }
};
