import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const PersonSchema = z.object({
  email: z.string().email(),
  name: z.string().regex(/^[a-zA-Z\s.]{3,}$/, {
    message: "Are you kidding me? That's the name of your victim?",
  }),
});

export const DonationSchema = z.object({
  victim: PersonSchema,
  perpetrator: PersonSchema,
  drink: z.string().min(3),
  challenge: z.string().min(3),
});

export const useDonationStore = create<
  z.infer<typeof DonationSchema> & {
    setVictim: (victim: z.infer<typeof PersonSchema>) => void;
    setPerpetrator: (perpetrator: z.infer<typeof PersonSchema>) => void;
    setDrink: (drink: string) => void;
    setChallenge: (challenge: string) => void;
  }
>()(
  persist<
    z.infer<typeof DonationSchema> & {
      setVictim: (victim: z.infer<typeof PersonSchema>) => void;
      setPerpetrator: (perpetrator: z.infer<typeof PersonSchema>) => void;
      setDrink: (drink: string) => void;
      setChallenge: (challenge: string) => void;
    }
  >(
    (set) => ({
      victim: {
        email: "",
        name: "",
      },
      perpetrator: {
        email: "",
        name: "",
      },
      drink: "",
      challenge: "",
      setVictim: (victim: z.infer<typeof PersonSchema>) =>
        set(() => ({
          victim,
        })),
      setPerpetrator: (perpetrator: z.infer<typeof PersonSchema>) =>
        set(() => ({
          perpetrator,
        })),
      setDrink: (drink: string) => set({ drink }),
      setChallenge: (challenge: string) => set({ challenge }),
    }),
    {
      name: "donation-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
